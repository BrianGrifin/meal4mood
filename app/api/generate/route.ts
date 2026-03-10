import Anthropic from "@anthropic-ai/sdk"
import { NextResponse } from "next/server"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { mood, diet, time } = await request.json()

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are a friendly recipe assistant. Generate a personalized recipe based on:
- Mood: ${mood}
- Dietary preference: ${diet}
- Available time: ${time} minutes

Respond in this exact JSON format with no extra text:
{
  "title": "Recipe Name",
  "description": "A short 1-2 sentence description",
  "cookTime": 30,
  "servings": 2,
  "ingredients": ["ingredient 1", "ingredient 2"],
  "steps": ["step 1", "step 2"]
}`
        }
      ]
    })

    const content = message.content[0]
    if (content.type === "text") {
      console.log("Claude response:", content.text)
      const clean = content.text.replace(/```json|```/g, "").trim()
      const recipe = JSON.parse(clean)
      return NextResponse.json(recipe)
    }

    return NextResponse.json({ error: "Failed to generate recipe" }, { status: 500 })

  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}