export const ingredientEmojis: Record<string, string> = {
  egg: "🥚", chicken: "🍗", beef: "🥩", pork: "🐷", bacon: "🥓", shrimp: "🍤", salmon: "🐟", tuna: "🐟", fish: "🐠", tofu: "🧆", turkey: "🦃",
  milk: "🥛", butter: "🧈", cheese: "🧀", yogurt: "🫙", cream: "🍶", "sour cream": "🥄",
  tomato: "🍅", onion: "🧅", garlic: "🧄", spinach: "🥬", carrot: "🥕", pepper: "🫑", broccoli: "🥦", potato: "🥔", mushroom: "🍄", zucchini: "🥒", lettuce: "🥬", avocado: "🥑", corn: "🌽", cucumber: "🥒", celery: "🌿", kale: "🥬", lemon: "🍋", lime: "🍋", orange: "🍊", apple: "🍎",
  rice: "🍚", pasta: "🍝", bread: "🍞", oat: "🌾", bean: "🫘", lentil: "🟤", flour: "🌾", noodle: "🍜", tortilla: "🫓",
  "soy sauce": "🫙", "olive oil": "🫒", oil: "🫒", honey: "🍯", "hot sauce": "🌶️", chili: "🌶️", mustard: "💛", vinegar: "🍶", salt: "🧂", sugar: "🍬",
  ginger: "🫚", cumin: "🌿", paprika: "🌶️", cinnamon: "🍂", basil: "🌿", oregano: "🌿", thyme: "🌿", herb: "🌿", spice: "🌶️",
  water: "💧", stock: "🍲", broth: "🍲", coconut: "🥥", "peanut butter": "🥜", peanut: "🥜", almond: "🌰", walnut: "🌰", nut: "🌰",
  chocolate: "🍫", vanilla: "🍦", berr: "🍓", strawberr: "🍓", blueberr: "🫐", banana: "🍌",
}

export function getIngredientEmoji(ingredient: string): string {
  const lower = ingredient.toLowerCase()
  for (const [key, emoji] of Object.entries(ingredientEmojis)) {
    if (lower.includes(key)) return emoji
  }
  return "🧾"
}

export function parseClaudeRecipe(text: string): object {
  const clean = text.replace(/```json|```/g, "").trim()
  return JSON.parse(clean)
}

export function matchScannedIngredients(
  scanned: string[],
  knownLabels: string[]
): string[] {
  return scanned
    .map((ing) => {
      const ingLower = ing.toLowerCase()
      return knownLabels.find((label) => {
        const labelLower = label.toLowerCase()
        return (
          ingLower === labelLower ||
          ingLower.includes(labelLower) ||
          labelLower.includes(ingLower)
        )
      })
    })
    .filter(Boolean) as string[]
}
