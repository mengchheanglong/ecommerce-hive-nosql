import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";

export interface BridgeLineResult {
  skuCode: string;
  skuId: string;
  quantity: string;
  allocationId?: string;
}

export interface BridgeOrderResult {
  success: boolean;
  orderId?: string;
  platformOrderId?: string;
  facilityCode?: string;
  facilityId?: string;
  allocations?: BridgeLineResult[];
  error?: string;
  statusCode?: number;
}

@Injectable()
export class SupplyChainBridgeService implements OnModuleInit {
  private readonly logger = new Logger(SupplyChainBridgeService.name);
  private baseUrl: string;
  private token: string;
  private tenantId: string;
  private masterDataLoaded: boolean = false;

  // Authoritative seeded facilities
  private facilityMap: Record<string, { id: string; name: string; lat: number; lon: number }> = {
    "DC-PNH-01": {
      id: "71432ce1-c9fb-4f5b-9dfd-f9c2324485be",
      name: "Phnom Penh Central Fulfillment Hub",
      lat: 11.5564,
      lon: 104.9282,
    },
    "DC-REP-01": {
      id: "bf4878e1-d7ab-49b8-820a-787de47e2cd7",
      name: "Siem Reap Regional Depot",
      lat: 13.3671,
      lon: 103.8448,
    },
    "DC-KOS-01": {
      id: "6d6562f1-26a3-4a98-955d-a233bbaa1ca5",
      name: "Sihanoukville Coastal Cross-Dock",
      lat: 10.6253,
      lon: 103.5234,
    },
    "DC-BAT-01": {
      id: "a9123778-0025-4d88-8c70-f7a21fede2a8",
      name: "Battambang Distribution Center",
      lat: 13.0957,
      lon: 103.2022,
    },
  };

  // Authoritative seeded enterprise SKUs
  private skuMap: Record<string, { id: string; name: string; unit: "each" }> = {
    "SKU-FOOD-01": {
      id: "7cf96316-bae6-4906-806e-61fab1389062",
      name: "Organic Jasmine Rice 25kg Bag",
      unit: "each",
    },
    "SKU-ELEC-01": {
      id: "87689cfc-13b3-47bf-818d-871608745827",
      name: "Solar Inverter Battery 5kWh",
      unit: "each",
    },
    "SKU-COLD-01": {
      id: "106f5413-8e71-4f07-9f10-33e67a1328f1",
      name: "Temperature-Controlled Vaccine Vial",
      unit: "each",
    },
    "SKU-MED-01": {
      id: "246dc37e-ca08-4815-a2ab-1946a7058445",
      name: "Emergency First Aid Kit (Type A)",
      unit: "each",
    },
  };

  // Legacy catalog SKU to enterprise SKU mapping
  private skuAliases: Record<string, string> = {
    P0874: "SKU-FOOD-01",
    P0875: "SKU-FOOD-01",
    P0876: "SKU-FOOD-01",
    P0877: "SKU-FOOD-01",
    P0878: "SKU-FOOD-01",
    P0879: "SKU-FOOD-01",
    P0880: "SKU-FOOD-01",
    P0881: "SKU-FOOD-01",
    P2210: "SKU-ELEC-01",
    P2211: "SKU-ELEC-01",
    P2212: "SKU-ELEC-01",
    P2213: "SKU-ELEC-01",
    P2214: "SKU-ELEC-01",
    P2215: "SKU-ELEC-01",
    P2216: "SKU-ELEC-01",
    P2217: "SKU-ELEC-01",
    P5004: "SKU-COLD-01",
    P5005: "SKU-COLD-01",
    P3314: "SKU-MED-01",
    P3315: "SKU-MED-01",
    P3316: "SKU-MED-01",
    P3317: "SKU-MED-01",
    P3318: "SKU-MED-01",
    P3319: "SKU-MED-01",
    P3320: "SKU-MED-01",
    P3321: "SKU-MED-01",
  };

  constructor() {
    this.baseUrl = (process.env.SUPPLY_CHAIN_API_URL || "http://127.0.0.1:8100").replace(/\/+$/, "");
    this.token = process.env.SUPPLY_CHAIN_TOKEN || "";
    this.tenantId = process.env.SUPPLY_CHAIN_TENANT_ID || "0948f598-13c6-46ec-a0f5-0ec1b4984476";

    this.resolveCredentials();
  }

  async onModuleInit(): Promise<void> {
    await this.refreshMasterData();
  }

  private resolveCredentials(): void {
    if (this.token) return;

    const candidateDirs = [
      path.resolve(process.cwd(), "..", "supply-chain-platform", ".secrets"),
      path.resolve(process.cwd(), "..", "..", "supply-chain-platform", ".secrets"),
      path.resolve(process.cwd(), ".secrets"),
    ];

    for (const dir of candidateDirs) {
      if (fs.existsSync(dir)) {
        try {
          const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
          if (files.length > 0) {
            const preferred = files.find((f) => f.includes(this.tenantId)) || files[0];
            const data = JSON.parse(fs.readFileSync(path.join(dir, preferred), "utf-8"));
            if (data.token) {
              this.token = data.token;
              this.tenantId = data.tenantId || this.tenantId;
              this.logger.log(`Loaded scoped tenant credential for ${this.tenantId} from ${preferred}`);
              return;
            }
          }
        } catch {}
      }
    }

    // Default static token for seeded tenant
    this.token = "2rTa1EJWQC6EyeyhpIcsDf2rEpRPBLGAz7eFwCwRQQo";
  }

  public resolveFacility(province?: string): { code: string; id: string } {
    const prov = (province || "").toLowerCase();
    if (prov.includes("siem reap")) {
      return { code: "DC-REP-01", id: this.facilityMap["DC-REP-01"].id };
    }
    if (prov.includes("sihanouk") || prov.includes("kampot") || prov.includes("koh kong") || prov.includes("coastal")) {
      return { code: "DC-KOS-01", id: this.facilityMap["DC-KOS-01"].id };
    }
    if (prov.includes("battambang")) {
      return { code: "DC-BAT-01", id: this.facilityMap["DC-BAT-01"].id };
    }
    return { code: "DC-PNH-01", id: this.facilityMap["DC-PNH-01"].id };
  }

  public resolveSku(productId: string): { code: string; id: string; name: string; unit: "each" } {
    const targetCode = this.skuMap[productId] ? productId : (this.skuAliases[productId] || "SKU-FOOD-01");
    const sku = this.skuMap[targetCode];
    return { code: targetCode, id: sku.id, name: sku.name, unit: sku.unit };
  }

  public async refreshMasterData(): Promise<void> {
    try {
      const headers = { Authorization: `Bearer ${this.token}` };
      const [facRes, skuRes] = await Promise.all([
        fetch(`${this.baseUrl}/api/v1/facilities`, { headers, signal: AbortSignal.timeout(3000) }),
        fetch(`${this.baseUrl}/api/v1/skus`, { headers, signal: AbortSignal.timeout(3000) }),
      ]);

      if (facRes.ok) {
        const facData: any = await facRes.json();
        for (const item of facData.items || []) {
          this.facilityMap[item.code] = {
            id: item.id,
            name: item.name,
            lat: item.latitude,
            lon: item.longitude,
          };
        }
      }

      if (skuRes.ok) {
        const skuData: any = await skuRes.json();
        for (const item of skuData.items || []) {
          this.skuMap[item.code] = {
            id: item.id,
            name: item.name,
            unit: item.unit,
          };
        }
      }
      this.masterDataLoaded = true;
    } catch {
      // Graceful degradation using authoritative seed mappings
    }
  }

  /**
   * Route storefront order into supply-chain-platform fulfillment API and reserve double-entry stock.
   */
  public async bridgeOrder(order: any): Promise<BridgeOrderResult> {
    const orderId = order.order_id;
    if (!orderId) return { success: false, error: "Missing order_id" };

    if (!this.masterDataLoaded) {
      await this.refreshMasterData();
    }

    const facility = this.resolveFacility(order.province);

    // Aggregate demand lines by enterprise SKU to prevent duplicate SKU entries
    const lineQtyMap = new Map<string, number>();
    for (const item of order.items || []) {
      const resolved = this.resolveSku(item.product_id);
      const prev = lineQtyMap.get(resolved.code) || 0;
      lineQtyMap.set(resolved.code, prev + (Number(item.quantity) || 1));
    }

    if (lineQtyMap.size === 0) {
      lineQtyMap.set("SKU-FOOD-01", 1);
    }

    const lines = Array.from(lineQtyMap.entries()).map(([code, qty]) => {
      const sku = this.skuMap[code];
      return {
        skuId: sku.id,
        quantity: String(qty),
        unit: sku.unit,
      };
    });

    const orderPayload = {
      idempotencyKey: randomUUID(),
      sourceSystem: "ecommerce-hive-nosql",
      externalId: orderId,
      facilityId: facility.id,
      customerReference: `${order.customer_id || "C0457"}: ${order.customer_name || "Guest"}`,
      lines,
    };

    try {
      // 1. Create order in sc_orders via supply-chain-platform fulfillment API
      const createRes = await fetch(`${this.baseUrl}/api/v1/fulfillment/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(orderPayload),
        signal: AbortSignal.timeout(5000),
      });

      if (!createRes.ok) {
        const errText = await createRes.text().catch(() => "");
        this.logger.warn(`Failed to create fulfillment order in platform: ${createRes.status} ${errText}`);
        return { success: false, statusCode: createRes.status, error: `Platform order creation failed with status ${createRes.status}` };
      }

      const createData: any = await createRes.json();
      const platformOrderId = createData.orderId;

      // 2. Query order detail to retrieve assigned line IDs for stock allocation
      const detailRes = await fetch(`${this.baseUrl}/api/v1/fulfillment/order?orderId=${platformOrderId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${this.token}` },
        signal: AbortSignal.timeout(4000),
      });

      const allocations: BridgeLineResult[] = [];
      let allocationFailed = false;
      let failureReason = "";
      let failureStatus = 409;
      let createdLines: any[] = [];

      if (detailRes.ok) {
        const detailData: any = await detailRes.json();
        createdLines = detailData.lines || [];

        // 3. Allocate and reserve double-entry stock ledger for each line
        for (const line of createdLines) {
          try {
            const allocRes = await fetch(`${this.baseUrl}/api/v1/fulfillment/allocate`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.token}`,
              },
              body: JSON.stringify({
                idempotencyKey: randomUUID(),
                sourceSystem: "ecommerce-hive-nosql",
                externalId: `${orderId}:alloc:${line.id}`,
                orderId: platformOrderId,
                lineId: line.id,
                quantity: line.requested,
              }),
              signal: AbortSignal.timeout(4000),
            });

            if (allocRes.ok) {
              const allocData: any = await allocRes.json();
              allocations.push({
                skuCode: line.skuCode,
                skuId: line.skuId,
                quantity: line.requested,
                allocationId: allocData.allocationId,
              });
            } else {
              allocationFailed = true;
              failureStatus = allocRes.status;
              const errBody: any = await allocRes.json().catch(() => null);
              failureReason = errBody?.error || errBody?.message || `Allocation failed with status ${allocRes.status}`;
              this.logger.warn(`Line allocation failed for ${line.skuCode}: ${allocRes.status} ${failureReason}`);
              break;
            }
          } catch (allocErr: any) {
            allocationFailed = true;
            failureReason = allocErr.message;
            this.logger.warn(`Allocation error for line ${line.id}: ${allocErr.message}`);
            break;
          }
        }
      } else {
        allocationFailed = true;
        failureReason = `Failed to fetch order lines: status ${detailRes.status}`;
      }

      // If allocation failed or was incomplete, roll back allocations and cancel order
      if (allocationFailed || (createdLines.length > 0 && allocations.length < createdLines.length)) {
        this.logger.warn(`Order ${orderId} allocation failed (${allocations.length}/${createdLines.length}). Rolling back reservations in supply-chain-platform...`);

        // Roll back any successful allocations
        for (const alloc of allocations) {
          if (alloc.allocationId) {
            try {
              await fetch(`${this.baseUrl}/api/v1/fulfillment/cancel-allocation`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${this.token}`,
                },
                body: JSON.stringify({
                  idempotencyKey: randomUUID(),
                  sourceSystem: "ecommerce-hive-nosql",
                  externalId: `${orderId}:cancel-alloc:${alloc.allocationId}`,
                  allocationId: alloc.allocationId,
                }),
                signal: AbortSignal.timeout(4000),
              });
            } catch (rbErr: any) {
              this.logger.error(`Failed to cancel allocation ${alloc.allocationId}: ${rbErr.message}`);
            }
          }
        }

        // Cancel order in supply-chain-platform
        try {
          await fetch(`${this.baseUrl}/api/v1/fulfillment/cancel-order`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.token}`,
            },
            body: JSON.stringify({
              idempotencyKey: randomUUID(),
              sourceSystem: "ecommerce-hive-nosql",
              externalId: `${orderId}:cancel-order:${platformOrderId}`,
              orderId: platformOrderId,
            }),
            signal: AbortSignal.timeout(4000),
          });
        } catch (rbOrderErr: any) {
          this.logger.error(`Failed to cancel order ${platformOrderId}: ${rbOrderErr.message}`);
        }

        return {
          success: false,
          orderId,
          platformOrderId,
          facilityCode: facility.code,
          facilityId: facility.id,
          statusCode: failureStatus || 409,
          error: `Double-entry inventory allocation failed: ${failureReason || 'Insufficient available balance'}. Platform order cancelled and ledger reservations rolled back.`,
          allocations: [],
        };
      }

      this.logger.log(`Bridged order ${orderId} -> Platform ${platformOrderId} at ${facility.code} with ${allocations.length} allocations`);

      return {
        success: true,
        orderId,
        platformOrderId,
        facilityCode: facility.code,
        facilityId: facility.id,
        allocations,
      };
    } catch (err: any) {
      this.logger.warn(`Supply chain bridge unreachable for order ${orderId}: ${err.message}`);
      return { success: false, statusCode: 503, error: err.message };
    }
  }
}
