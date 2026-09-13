const BRAND_TIERS = {
  luxury: {
    multiplier: 1.8,
    brands: ["gucci", "balenciaga", "prada", "saint laurent", "dior", "supreme"],
  },
  premium: {
    multiplier: 1.3,
    brands: [
      "levi's",
      "levis",
      "carhartt",
      "stussy",
      "champion",
      "patagonia",
      "the north face",
      "diesel",
      "ralph lauren",
    ],
  },
  highstreet: {
    multiplier: 1.0,
    brands: [
      "nike",
      "adidas",
      "zara",
      "uniqlo",
      "puma",
      "h&m",
      "vans",
      "converse",
      "asos",
      "urban outfitters",
    ],
  },
  standard: {
    multiplier: 0.75,
    brands: ["unbranded", "generic", "basics"],
  },
};

const CATEGORY_WEIGHTS = {
  Outerwear: 1.25,
  Vintage: 1.2,
  Streetwear: 1.1,
  Unisex: 1.0,
  Women: 1.0,
  Sportswear: 0.95,
  Tops: 0.9,
  Bottoms: 1.0,
};

const CONDITION_FACTORS = {
  "Brand new": 0.95,
  "Like new": 0.85,
  Excellent: 0.75,
  Good: 0.6,
  Fair: 0.4,
};

const BASE_CATEGORY_PRICES = {
  Outerwear: 3600,
  Streetwear: 2800,
  Vintage: 3000,
  Women: 2200,
  Unisex: 2400,
  Sportswear: 2400,
  Tops: 1800,
  Bottoms: 2500,
};

export function calculateEstimatedSwapValue({
  category = "Streetwear",
  brand = "Unbranded",
  condition = "Good",
  ageMonths = 6,
  originalPrice = null,
}) {
  const normBrand = (brand || "").toLowerCase().trim();
  let brandMultiplier = BRAND_TIERS.standard.multiplier;

  for (const tier of Object.values(BRAND_TIERS)) {
    if (tier.brands.some((b) => normBrand.includes(b))) {
      brandMultiplier = tier.multiplier;
      break;
    }
  }

  const categoryWeight = CATEGORY_WEIGHTS[category] || 1.0;
  const conditionFactor = CONDITION_FACTORS[condition] || 0.6;
  const basePrice = BASE_CATEGORY_PRICES[category] || 2400;

  // If user supplied original retail price, use that as base anchor
  const startingAnchor =
    originalPrice && Number(originalPrice) > 0
      ? Number(originalPrice)
      : basePrice * brandMultiplier;

  // Age depreciation: slight decay over time (max 30% reduction from age)
  const ageFactor = Math.max(0.7, 1 - (ageMonths / 48) * 0.3);

  const rawValue = startingAnchor * conditionFactor * categoryWeight * ageFactor;
  // Round to nearest 50 for clean aesthetic currency
  const estimatedValue = Math.max(300, Math.round(rawValue / 50) * 50);

  return {
    label: "Estimated swap value",
    estimatedValue,
    disclaimer:
      "Values are a friendly guide to support fair exchanges, not a retail price tag.",
    factors: {
      category,
      brand,
      condition,
      conditionFactor,
      brandMultiplier,
    },
  };
}
