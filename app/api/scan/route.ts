import Anthropic from "@anthropic-ai/sdk"
import { NextResponse } from "next/server"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { image } = await request.json()

    // image is a base64 data URL like "data:image/jpeg;base64,..."
    const base64 = image.split(",")[1]
    const mediaType = image.split(";")[0].split(":")[1] as "image/jpeg" | "image/png" | "image/webp"

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: base64,
              },
            },
            {
              type: "text",
              text: `Look at this fridge or pantry photo. List all the food ingredients you can identify.
Respond with ONLY a JSON array of ingredient names as plain strings, no extra text.
Example: ["eggs", "milk", "cheese", "tomatoes", "chicken"]
Keep names short and simple (1-2 words max each).`,
            },
          ],
        },
      ],
    })

    const content = message.content[0]
    if (content.type === "text") {
      try {
        const clean = content.text.replace(/```json|```/g, "").trim()
        const ingredients = JSON.parse(clean)
        return NextResponse.json({ ingredients })
      } catch {
        return NextResponse.json({ error: "Failed to parse ingredients from AI response" }, { status: 500 })
      }
    }

    return NextResponse.json({ error: "Failed to scan image" }, { status: 500 })
  } catch (error) {
    console.error("Scan error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
