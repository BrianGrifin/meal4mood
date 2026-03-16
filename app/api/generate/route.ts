import Anthropic from "@anthropic-ai/sdk"
import { NextResponse } from "next/server"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { mood, diet, time, ingredients } = await request.json()

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are a creative recipe assistant. Generate a recipe that strictly fits ALL of the following constraints:

- Mood: ${mood}
- Dietary preference: ${diet}
- Cook time: EXACTLY within ${time} minutes total (prep + cook). This is a hard limit — do not suggest a dish that takes longer.${ingredients?.length ? `\n- Fridge ingredients to use: ${ingredients.join(", ")} — prioritize these in the recipe` : ""}

The time constraint must determine the dish itself, not just the wording:
- 15 mins → very quick dishes only (smoothies, toast, scrambled eggs, wraps, simple salads)
- 30 mins → moderate dishes (stir-fries, pasta, soups, grain bowls)
- 45 mins → more involved dishes (roasted veggies, baked dishes, curries)
- 60+ mins → slow-cooked or complex dishes (stews, casseroles, roasts)

Pick a dish that is genuinely different and appropriate for the exact time given. Do not suggest the same dish for different time slots. Be creative and specific.

Respond in this exact JSON format with no extra text:
{
  "title": "Recipe Name",
  "description": "A short 1-2 sentence description",
  "cookTime": 30,
  "servings": 2,
  "ingredients": ["ingredient 1", "ingredient 2"],
  "steps": ["step 1", "step 2"],
  "imageQuery": "2-3 word dish name only, e.g. smoothie bowl or pasta carbonara"
}`
        }
      ]
    })

    const content = message.content[0]
    if (content.type === "text") {
      console.log("Claude response:", content.text)
      const clean = content.text.replace(/```json|```/g, "").trim()
      const recipe = JSON.parse(clean)

      // Fetch a food photo from Unsplash
      let imageUrl = null
      try {
        const searchQuery = (recipe.imageQuery || recipe.title) + " food dish"
        const unsplashRes = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=1&orientation=landscape`,
          { headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` } }
        )
        const unsplashData = await unsplashRes.json()
        console.log("Unsplash status:", unsplashRes.status)
        console.log("Unsplash result:", JSON.stringify(unsplashData).slice(0, 200))
        imageUrl = unsplashData.results?.[0]?.urls?.regular ?? null
      } catch (err) {
        console.error("Unsplash error:", err)
      }

      return NextResponse.json({ ...recipe, imageUrl })
    }

    return NextResponse.json({ error: "Failed to generate recipe" }, { status: 500 })

  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}