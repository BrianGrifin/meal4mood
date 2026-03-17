import { describe, it, expect, vi, beforeEach } from "vitest"

const mockCreate = vi.fn()

vi.mock("@anthropic-ai/sdk", () => {
  return {
    default: class MockAnthropic {
      messages = { create: mockCreate }
    },
  }
})

global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  status: 200,
  json: async () => ({ results: [{ urls: { regular: "https://example.com/pasta.jpg" } }] }),
} as Response)

describe("POST /api/generate (smoke test)", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.ANTHROPIC_API_KEY = "test-key"
    process.env.UNSPLASH_ACCESS_KEY = "test-unsplash-key"
  })

  it("returns a recipe with imageUrl on success", async () => {
    mockCreate.mockResolvedValue({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            title: "Quick Pasta",
            description: "A simple pasta dish",
            cookTime: 20,
            servings: 2,
            ingredients: ["pasta", "olive oil", "garlic"],
            steps: ["Boil pasta", "Sauté garlic in oil", "Combine"],
            imageQuery: "pasta dish",
          }),
        },
      ],
    })

    const { POST } = await import("../app/api/generate/route")
    const request = new Request("http://localhost/api/generate", {
      method: "POST",
      body: JSON.stringify({ mood: "happy", diet: "None", time: 20, ingredients: [] }),
      headers: { "Content-Type": "application/json" },
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.title).toBe("Quick Pasta")
    expect(data.cookTime).toBe(20)
    expect(data.imageUrl).toBe("https://example.com/pasta.jpg")
  })

  it("returns 500 when Claude returns non-text content", async () => {
    mockCreate.mockResolvedValue({ content: [{ type: "image" }] })

    const { POST } = await import("../app/api/generate/route")
    const request = new Request("http://localhost/api/generate", {
      method: "POST",
      body: JSON.stringify({ mood: "sad", diet: "Vegan", time: 30, ingredients: [] }),
      headers: { "Content-Type": "application/json" },
    })
    const response = await POST(request)
    expect(response.status).toBe(500)
  })
})
