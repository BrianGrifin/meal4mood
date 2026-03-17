import { describe, it, expect } from "vitest"
import { getIngredientEmoji, parseClaudeRecipe, matchScannedIngredients } from "../lib/utils"

describe("getIngredientEmoji", () => {
  it("returns the correct emoji for known ingredients", () => {
    expect(getIngredientEmoji("Eggs")).toBe("🥚")
    expect(getIngredientEmoji("chicken breast")).toBe("🍗")
    expect(getIngredientEmoji("cheddar cheese")).toBe("🧀")
    expect(getIngredientEmoji("olive oil")).toBe("🫒")
    expect(getIngredientEmoji("garlic cloves")).toBe("🧄")
  })

  it("is case-insensitive", () => {
    expect(getIngredientEmoji("MILK")).toBe("🥛")
    expect(getIngredientEmoji("Butter")).toBe("🧈")
  })

  it("returns 🧾 for unknown ingredients", () => {
    expect(getIngredientEmoji("dragon fruit")).toBe("🧾")
    expect(getIngredientEmoji("xylitol")).toBe("🧾")
  })
})

describe("parseClaudeRecipe", () => {
  it("parses plain JSON", () => {
    const input = `{"title":"Pasta","cookTime":20}`
    const result = parseClaudeRecipe(input) as { title: string; cookTime: number }
    expect(result.title).toBe("Pasta")
    expect(result.cookTime).toBe(20)
  })

  it("strips markdown code fences", () => {
    const input = "```json\n{\"title\":\"Salad\"}\n```"
    const result = parseClaudeRecipe(input) as { title: string }
    expect(result.title).toBe("Salad")
  })

  it("throws on invalid JSON", () => {
    expect(() => parseClaudeRecipe("not json")).toThrow()
  })
})

describe("matchScannedIngredients", () => {
  const knownLabels = ["Eggs", "Chicken", "Bell Pepper", "Tomato", "Spinach", "Milk"]

  it("matches exact labels case-insensitively", () => {
    expect(matchScannedIngredients(["eggs", "milk"], knownLabels)).toEqual(["Eggs", "Milk"])
  })

  it("matches plural forms", () => {
    expect(matchScannedIngredients(["tomatoes", "bell peppers"], knownLabels)).toEqual(["Tomato", "Bell Pepper"])
  })

  it("ignores ingredients not in the known list", () => {
    expect(matchScannedIngredients(["dragon fruit", "quinoa"], knownLabels)).toEqual([])
  })

  it("deduplicates via Set in calling code (returns all matches)", () => {
    const result = matchScannedIngredients(["eggs", "chicken"], knownLabels)
    expect(result).toHaveLength(2)
    expect(result).toContain("Eggs")
    expect(result).toContain("Chicken")
  })
})
