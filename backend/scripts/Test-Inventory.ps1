# Uses an ephemeral, loopback-only MongoDB replica set. No existing data volumes.
[CmdletBinding()]
param()
$ErrorActionPreference = 'Stop'
$testContainer = 'inventory-test-' + [Guid]::NewGuid().ToString('N')
$previousTestUri = $env:TEST_MONGODB_URI
$backendPath = Split-Path $PSScriptRoot -Parent
Push-Location $backendPath
try {
    & docker run --rm -d --name $testContainer -p '127.0.0.1::27017' mongo:8.0 --replSet inventory_test --bind_ip_all | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'Cannot start isolated MongoDB test container' }
    $ready = $false
    for ($attempt = 0; $attempt -lt 30; $attempt++) {
        $ping = & docker exec $testContainer mongosh --quiet --eval 'db.adminCommand({ping:1}).ok' 2>$null
        if ($LASTEXITCODE -eq 0) { $ready = $true; break }
        Start-Sleep -Seconds 1
    }
    if (!$ready) { throw 'Test MongoDB did not start' }
    & docker exec $testContainer mongosh --quiet --eval "rs.initiate({_id:'inventory_test',members:[{_id:0,host:'127.0.0.1:27017'}]})" | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'Test replica set initialization failed' }
    $primary = $false
    for ($attempt = 0; $attempt -lt 30; $attempt++) {
        $state = & docker exec $testContainer mongosh --quiet --eval 'db.hello().isWritablePrimary'
        if ($LASTEXITCODE -eq 0 -and "$state".Trim() -eq 'true') { $primary = $true; break }
        Start-Sleep -Seconds 1
    }
    if (!$primary) { throw 'Test replica set did not elect a primary' }
    $binding = & docker port $testContainer 27017/tcp
    if ($binding -notmatch '^127\.0\.0\.1:(\d+)$') { throw 'Test MongoDB is not loopback-only' }
    $env:TEST_MONGODB_URI = 'mongodb://127.0.0.1:' + $Matches[1] + '/?directConnection=true&replicaSet=inventory_test'
    & pnpm build
    if ($LASTEXITCODE -ne 0) { throw 'Backend build failed' }
    & node --test tests/inventory.unit.test.cjs tests/web-write-boundary.unit.test.cjs tests/inventory.integration.test.cjs tests/telemetry.unit.test.cjs
    if ($LASTEXITCODE -ne 0) { throw 'Inventory regression tests failed' }
} finally {
    $env:TEST_MONGODB_URI = $previousTestUri
    & docker stop $testContainer 2>$null | Out-Null
    Pop-Location
}
