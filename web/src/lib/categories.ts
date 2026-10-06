export interface Subcategory {
  slug: string;
  name: string;
  count?: number;
}

export interface CategoryData {
  slug: string;
  name: string;
  shortName?: string;
  description: string;
  tagline: string;
  icon: string;
  bannerImage: string;
  subcategories: Subcategory[];
}

export const CATEGORIES_DATA: CategoryData[] = [
  {
    slug: "food-groceries",
    name: "Food & Groceries",
    shortName: "Food",
    description: "Farm-fresh produce, jasmine rice, Kampot spices, coffee and artisan pantry goods",
    tagline: "Farm-fresh produce and the ingredients that make Cambodian kitchens work.",
    icon: "store",
    bannerImage: "/categories/food-groceries.png",
    subcategories: [
      { slug: "fresh-produce", name: "Fresh Produce" },
      { slug: "rice-grains", name: "Rice & Grains" },
      { slug: "pantry-spices", name: "Pantry & Spices" },
      { slug: "coffee-tea", name: "Coffee & Tea" },
      { slug: "snacks-dried-fruit", name: "Snacks & Dried Fruit" },
      { slug: "cooking-oil-sauces", name: "Cooking Oil & Sauces" },
      { slug: "palm-sugar-sweeteners", name: "Palm Sugar & Sweeteners" },
    ],
  },
  {
    slug: "fashion",
    name: "Fashion & Accessories",
    shortName: "Fashion",
    description: "Linen clothing, traditional handwoven silk kramas, commuter bags and footwear",
    tagline: "Everyday fashion and Cambodian design, from independent labels to heritage textiles.",
    icon: "tag",
    bannerImage: "/categories/fashion.png",
    subcategories: [
      { slug: "mens-clothing", name: "Men's Clothing" },
      { slug: "womens-clothing", name: "Women's Clothing" },
      { slug: "traditional-wear", name: "Traditional Wear (Krama & Silk)" },
      { slug: "bags-luggage", name: "Bags & Luggage" },
      { slug: "shoes", name: "Shoes & Footwear" },
    ],
  },
  {
    slug: "home-living",
    name: "Home & Living",
    shortName: "Home",
    description: "Kampong Chhnang terracotta pottery, woven rattan organizers and kitchenware",
    tagline: "Useful, handcrafted and authentic pieces for every Cambodian home.",
    icon: "home",
    bannerImage: "/categories/home-living.png",
    subcategories: [
      { slug: "pottery-ceramics", name: "Pottery & Ceramics" },
      { slug: "bamboo-rattan", name: "Bamboo & Rattan Crafts" },
      { slug: "kitchen-dining", name: "Kitchen & Dining" },
      { slug: "home-decor", name: "Home Décor & Accents" },
    ],
  },
  {
    slug: "beauty-wellness",
    name: "Beauty & Wellness",
    shortName: "Beauty",
    description: "Cold-pressed Moringa face oils, turmeric herbal soaps and natural remedies",
    tagline: "Daily care and wellbeing using pure Cambodian botanicals.",
    icon: "heart",
    bannerImage: "/categories/beauty-wellness.png",
    subcategories: [
      { slug: "skincare", name: "Natural Skincare" },
      { slug: "bath-body", name: "Bath & Body Care" },
      { slug: "herbal-wellness", name: "Herbal Remedies & Balms" },
    ],
  },
  {
    slug: "electronics",
    name: "Electronics",
    description: "Smartphones, 4K monitors, ANC earbuds, smartwatches and mobile gear",
    tagline: "Technology and gear for everyday productivity and connectivity.",
    icon: "smartphone",
    bannerImage: "/categories/electronics.png",
    subcategories: [
      { slug: "phones-tablets", name: "Phones & Tablets" },
      { slug: "computers", name: "Computers & Monitors" },
      { slug: "tv-audio", name: "Audio & Earbuds" },
      { slug: "wearable-technology", name: "Wearables & Smartwatches" },
      { slug: "electronic-accessories", name: "Power & Accessories" },
      { slug: "cameras-drones", name: "Cameras & Drones" },
    ],
  },
  {
    slug: "arts-culture",
    name: "Arts & Culture",
    shortName: "Arts",
    description: "Silver betel boxes, stone Apsara carvings, lacquerware and Cambodian gifts",
    tagline: "Creative work that carries Cambodian skill, identity and heritage forward.",
    icon: "sparkles",
    bannerImage: "/categories/arts-culture.png",
    subcategories: [
      { slug: "handmade-crafts", name: "Handmade Crafts & Carvings" },
      { slug: "souvenirs-gifts", name: "Heritage Souvenirs & Gifts" },
    ],
  },
];
