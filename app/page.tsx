"use client"

import { useState } from "react"

const moods = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😤", label: "Stressed" },
  { emoji: "😴", label: "Tired" },
  { emoji: "🤒", label: "Sick" },
  { emoji: "🥳", label: "Celebratory" },
]

const diets = ["None", "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Keto"]

const times = [
  { label: "15 mins", value: 15 },
  { label: "30 mins", value: 30 },
  { label: "45 mins", value: 45 },
  { label: "1 hour+", value: 60 },
]

interface Recipe {
  title: string
  description: string
  cookTime: number
  servings: number
  ingredients: string[]
  steps: string[]
}

export default function Home() {
  const [selectedMood, setSelectedMood] = useState("")
  const [selectedDiet, setSelectedDiet] = useState("None")
  const [selectedTime, setSelectedTime] = useState(0)
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleGenerate() {
    setLoading(true)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood: selectedMood,
          diet: selectedDiet,
          time: selectedTime,
        }),
      })
      const data = await response.json()
      setRecipe(data)
    } catch (error) {
      console.error("Error generating recipe:", error)
    }
    setLoading(false)
  }

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)" }}>

      {/* Navbar */}
      <nav style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", padding: "16px 32px", display: "flex", alignItems: "center" }}>
        <span style={{ fontSize: "28px", fontWeight: "800", color: "#0d9488", letterSpacing: "-0.5px" }}>🍽️ Meal4Mood</span>
      </nav>

      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "48px 24px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "800", color: "#134e4a", marginBottom: "10px" }}>
            What are you feeling today?
          </h2>
          <p style={{ color: "#64748b", fontSize: "16px" }}>
            Tell us your mood and we'll cook up the perfect recipe for you ✨
          </p>
        </div>

        {/* Mood Selector */}
        <div style={{ background: "white", borderRadius: "24px", padding: "28px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#134e4a", marginBottom: "20px", textAlign: "center" }}>
            😌 How are you feeling?
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            {moods.map((mood) => (
              <button
                key={mood.label}
                onClick={() => setSelectedMood(mood.label)}
                style={{
                  background: selectedMood === mood.label ? "linear-gradient(135deg, #0d9488, #0891b2)" : "#f8fafc",
                  border: selectedMood === mood.label ? "2px solid #0d9488" : "2px solid #e2e8f0",
                  borderRadius: "16px",
                  padding: "18px 8px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: selectedMood === mood.label ? "0 4px 12px rgba(13,148,136,0.3)" : "none",
                  transform: selectedMood === mood.label ? "scale(1.05)" : "scale(1)",
                }}
              >
                <div style={{ fontSize: "36px", marginBottom: "8px" }}>{mood.emoji}</div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: selectedMood === mood.label ? "white" : "#475569" }}>
                  {mood.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Dietary Preferences */}
        <div style={{ background: "white", borderRadius: "24px", padding: "28px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#134e4a", marginBottom: "20px", textAlign: "center" }}>
            🥗 Any dietary preferences?
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
            {diets.map((diet) => (
              <button
                key={diet}
                onClick={() => setSelectedDiet(diet)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "999px",
                  border: "2px solid",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: selectedDiet === diet ? "linear-gradient(135deg, #0d9488, #0891b2)" : "white",
                  color: selectedDiet === diet ? "white" : "#475569",
                  borderColor: selectedDiet === diet ? "#0d9488" : "#e2e8f0",
                  boxShadow: selectedDiet === diet ? "0 4px 12px rgba(13,148,136,0.3)" : "none",
                }}
              >
                {diet}
              </button>
            ))}
          </div>
        </div>

        {/* Time Availability */}
        <div style={{ background: "white", borderRadius: "24px", padding: "28px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", marginBottom: "28px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#134e4a", marginBottom: "20px", textAlign: "center" }}>
            ⏱️ How much time do you have?
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
            {times.map((time) => (
              <button
                key={time.value}
                onClick={() => setSelectedTime(time.value)}
                style={{
                  padding: "10px 28px",
                  borderRadius: "999px",
                  border: "2px solid",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: selectedTime === time.value ? "linear-gradient(135deg, #0d9488, #0891b2)" : "white",
                  color: selectedTime === time.value ? "white" : "#475569",
                  borderColor: selectedTime === time.value ? "#0d9488" : "#e2e8f0",
                  boxShadow: selectedTime === time.value ? "0 4px 12px rgba(13,148,136,0.3)" : "none",
                }}
              >
                {time.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleGenerate}
          disabled={!selectedMood || !selectedTime || loading}
          style={{
            width: "100%",
            padding: "18px",
            borderRadius: "16px",
            border: "none",
            fontSize: "18px",
            fontWeight: "800",
            cursor: selectedMood && selectedTime ? "pointer" : "not-allowed",
            background: selectedMood && selectedTime ? "linear-gradient(135deg, #0d9488, #0891b2)" : "#e2e8f0",
            color: selectedMood && selectedTime ? "white" : "#94a3b8",
            boxShadow: selectedMood && selectedTime ? "0 8px 24px rgba(13,148,136,0.4)" : "none",
            transition: "all 0.2s",
          }}
        >
          {loading ? "🍳 Cooking up your recipe..." : "🍽️ Find My Recipe"}
        </button>

        {(!selectedMood || !selectedTime) && (
          <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "13px", marginTop: "12px" }}>
            Please select a mood and time to continue
          </p>
        )}

        {/* Recipe Result */}
        {recipe && (
          <div style={{ background: "white", borderRadius: "24px", padding: "32px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", marginTop: "28px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#134e4a", marginBottom: "8px" }}>
              {recipe.title}
            </h2>
            <p style={{ color: "#64748b", marginBottom: "20px" }}>{recipe.description}</p>

            <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
              <span style={{ background: "#f0fdfa", color: "#0d9488", padding: "6px 14px", borderRadius: "999px", fontSize: "13px", fontWeight: "600" }}>
                ⏱️ {recipe.cookTime} mins
              </span>
              <span style={{ background: "#f0fdfa", color: "#0d9488", padding: "6px 14px", borderRadius: "999px", fontSize: "13px", fontWeight: "600" }}>
                🍽️ {recipe.servings} servings
              </span>
            </div>

            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#134e4a", marginBottom: "12px" }}>
              🛒 Ingredients
            </h3>
            <ul style={{ listStyle: "none", padding: 0, marginBottom: "24px" }}>
              {recipe.ingredients.map((ing, i) => (
                <li key={i} style={{ padding: "8px 0", borderBottom: "1px solid #f1f5f9", color: "#475569", fontSize: "14px" }}>
                  • {ing}
                </li>
              ))}
            </ul>

            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#134e4a", marginBottom: "12px" }}>
              👨‍🍳 Instructions
            </h3>
            <ol style={{ listStyle: "none", padding: 0 }}>
              {recipe.steps.map((step, i) => (
                <li key={i} style={{ display: "flex", gap: "12px", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ background: "linear-gradient(135deg, #0d9488, #0891b2)", color: "white", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", flexShrink: 0 }}>
                    {i + 1}
                  </span>
                  <span style={{ color: "#475569", fontSize: "14px" }}>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

      </div>
    </main>
  )
}