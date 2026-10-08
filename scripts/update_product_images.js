const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const IMAGE_MAP = {
  // Food & Groceries
  P0874: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80", // Jasmine Rice
  P0875: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80", // Kampot Black Pepper
  P0876: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80", // Mondulkiri Arabica Coffee
  P0877: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80", // Wild Forest Honey
  P0878: "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?auto=format&fit=crop&w=800&q=80", // Kampot Fleur de Sel
  P0879: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80", // Kampong Speu Palm Sugar
  P0880: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80", // Lemongrass Herbal Tea
  P0881: "https://images.unsplash.com/photo-1524593689594-aae2f26b75ab?auto=format&fit=crop&w=800&q=80", // Roasted Cashews
  P0882: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80", // Fresh Green Oranges
  P0883: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80", // Golden Mangoes
  P0884: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80", // Hydroponic Asian Greens
  P0888: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80", // Artisanal Fish Sauce

  // Fashion & Accessories
  P3314: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80", // Linen Casual Shirt
  P3315: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80", // Takeo Silk Scarf
  P3316: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80", // Everyday Stretch Chinos
  P3317: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80", // Cotton Resort Shirt
  P3318: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80", // Commuter Backpack 22L
  P3319: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80", // Heritage Leather Loafers
  P3320: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80", // Bamboo Fiber Lounge Set
  P3321: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80", // UV Sun Hoodie UPF 50+
  P3323: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80", // Hand-Loomed Cotton Krama
  P3324: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80", // Printed Cotton Midi Dress
  P3325: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80", // Khmer Hol Silk Sarong

  // Electronics
  P2210: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80", // Ultra Smartphone 5G
  P2211: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80", // Wireless Earbuds Pro
  P2212: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80", // Curved 4K Ultra-Wide Monitor
  P2213: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80", // Smartwatch GPS Sapphire
  P2214: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80", // Mechanical Gaming Keyboard
  P2215: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80", // 65W 20,000mAh Power Bank
  P2216: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80", // Wi-Fi 6 Mesh Router
  P2217: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80", // Compact 4K Foldable Drone

  // Home & Living
  P4001: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80", // Terracotta Teapot Set
  P4002: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80", // Glazed Ceramic Rice Bowls
  P4003: "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=800&q=80", // Water Hyacinth Storage Baskets
  P4004: "https://images.unsplash.com/photo-1584269600519-112d071b35e6?auto=format&fit=crop&w=800&q=80", // Coconut Wood Cooking Utensils
  P4005: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80", // Silk Cushion Covers
  P4006: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", // Woven Bamboo Winnowing Wall Art
  P4007: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80", // Lemongrass & Jasmine Soy Candle
  P4008: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80", // Terracotta Relief Planter Pot
  P4009: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80", // Bamboo Lantern Lampshade
  P4010: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80", // Palm Wood Mortar & Pestle

  // Beauty & Wellness
  P5001: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80", // Moringa Face Oil 30ml
  P5002: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80", // Virgin Coconut Oil 250ml
  P5003: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=800&q=80", // Turmeric & Wild Honey Soap
  P5004: "https://images.unsplash.com/photo-1547793549-70faf88838c8?auto=format&fit=crop&w=800&q=80", // Khmer Herbal Balm & Inhaler
  P5005: "https://images.unsplash.com/photo-1519735777090-ec97162dc266?auto=format&fit=crop&w=800&q=80", // Kampot Sea Salt Body Scrub

  // Arts & Culture
  P6001: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80", // Silver Betel Box
  P6002: "https://images.unsplash.com/photo-1599837565318-67429bde7162?auto=format&fit=crop&w=800&q=80", // Carved Stone Apsara Sculpture
  P6003: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80", // Lacquerware Serving Platter
  P6004: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80", // Golden Silk Wall Tapestry
  P6005: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80"  // Angkor Wat Watercolor Art Print
};

async function main() {
  console.log('=== STARTING PRODUCT COVER IMAGE UPDATE ===');

  // 1. Update web/src/lib/data.ts
  const webPath = path.join(__dirname, '..', 'web', 'src', 'lib', 'data.ts');
  const webContent = fs.readFileSync(webPath, 'utf8');

  const startMarker = 'export const INITIAL_PRODUCTS: Product[] = [';
  const endMarker = 'export const INITIAL_ORDERS: OrderRecord[] = [';
  const startIdx = webContent.indexOf(startMarker);
  const endIdx = webContent.indexOf(endMarker);

  if (startIdx === -1 || endIdx === -1) {
    throw new Error('Markers not found in web/src/lib/data.ts');
  }

  const prefix = webContent.substring(0, startIdx + startMarker.length - 1);
  const suffix = webContent.substring(endIdx);
  const jsonSection = webContent.substring(startIdx + startMarker.length - 1, endIdx).trim().replace(/;$/, '');

  const products = JSON.parse(jsonSection);
  let webUpdatedCount = 0;

  for (const prod of products) {
    if (IMAGE_MAP[prod.product_id]) {
      if (prod.image !== IMAGE_MAP[prod.product_id]) {
        prod.image = IMAGE_MAP[prod.product_id];
        webUpdatedCount++;
      }
    }
  }

  const newJsonSection = JSON.stringify(products, null, 2);
  const newWebContent = `${prefix}${newJsonSection};\n\n${suffix}`;
  fs.writeFileSync(webPath, newWebContent, 'utf8');
  console.log(`[web/src/lib/data.ts] Successfully updated ${webUpdatedCount} product image URLs across ${products.length} products.`);

  // 2. Update backend/src/catalog/catalog.service.ts
  const backendPath = path.join(__dirname, '..', 'backend', 'src', 'catalog', 'catalog.service.ts');
  let backendContent = fs.readFileSync(backendPath, 'utf8');
  let backendUpdatedCount = 0;

  for (const [productId, newImage] of Object.entries(IMAGE_MAP)) {
    // Look for product_id: "P..." followed by image: "..."
    const prodRegex = new RegExp(`(product_id:\\s*["']${productId}["'][\\s\\S]*?image:\\s*["'])([^"']+)(["'])`, 'g');
    if (prodRegex.test(backendContent)) {
      backendContent = backendContent.replace(prodRegex, (match, p1, oldImg, p3) => {
        if (oldImg !== newImage) {
          backendUpdatedCount++;
          return `${p1}${newImage}${p3}`;
        }
        return match;
      });
    }
  }
  fs.writeFileSync(backendPath, backendContent, 'utf8');
  console.log(`[backend/src/catalog/catalog.service.ts] Updated ${backendUpdatedCount} product image URLs.`);

  // 3. Update MongoDB (ecommerce & khmercart databases)
  const client = new MongoClient('mongodb://127.0.0.1:27017');
  try {
    await client.connect();
    console.log('[MongoDB] Connected to mongodb://127.0.0.1:27017');

    // Update 'ecommerce' database
    const dbEcommerce = client.db('ecommerce');
    const ecomCol = dbEcommerce.collection('products');
    let ecomUpdated = 0;
    let ecomInserted = 0;

    for (const prod of products) {
      const existing = await ecomCol.findOne({ product_id: prod.product_id });
      const imgUrl = IMAGE_MAP[prod.product_id] || prod.image;
      if (existing) {
        if (existing.image !== imgUrl) {
          await ecomCol.updateOne({ product_id: prod.product_id }, { $set: { image: imgUrl, updated_at: new Date() } });
          ecomUpdated++;
        }
      } else {
        // Insert product into ecommerce catalog so all 51 products exist in DB
        const toInsert = { ...prod, image: imgUrl, updated_at: new Date() };
        await ecomCol.insertOne(toInsert);
        ecomInserted++;
      }
    }
    console.log(`[MongoDB - ecommerce.products] Updated: ${ecomUpdated}, Newly Inserted: ${ecomInserted}. Total in collection: ${await ecomCol.countDocuments()}`);

    // Update 'khmercart' database if collection exists
    const dbKhmercart = client.db('khmercart');
    const kcCol = dbKhmercart.collection('products');
    let kcUpdated = 0;
    for (const [productId, newImage] of Object.entries(IMAGE_MAP)) {
      const res = await kcCol.updateOne({ product_id: productId }, { $set: { image: newImage, updated_at: new Date() } });
      if (res.modifiedCount > 0) kcUpdated++;
    }
    console.log(`[MongoDB - khmercart.products] Updated: ${kcUpdated}. Total in collection: ${await kcCol.countDocuments()}`);

  } catch (err) {
    console.error('[MongoDB Error]', err.message);
  } finally {
    await client.close();
  }

  console.log('=== PRODUCT COVER IMAGE UPDATE COMPLETED SUCCESSFULLY ===');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
