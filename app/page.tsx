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

const fridgeItems = [
  { category: "Protein", items: [{ label: "Eggs", icon: "🥚" }, { label: "Chicken", icon: "🍗" }, { label: "Beef", icon: "🥩" }, { label: "Tofu", icon: "🧆" }, { label: "Shrimp", icon: "🍤" }, { label: "Canned Tuna", icon: "🐟" }, { label: "Bacon", icon: "🥓" }] },
  { category: "Dairy", items: [{ label: "Milk", icon: "🥛" }, { label: "Butter", icon: "🧈" }, { label: "Cheese", icon: "🧀" }, { label: "Yogurt", icon: "🫙" }, { label: "Cream", icon: "🍶" }, { label: "Sour Cream", icon: "🥄" }] },
  { category: "Veggies", items: [{ label: "Onion", icon: "🧅" }, { label: "Garlic", icon: "🧄" }, { label: "Tomato", icon: "🍅" }, { label: "Spinach", icon: "🥬" }, { label: "Carrot", icon: "🥕" }, { label: "Bell Pepper", icon: "🫑" }, { label: "Broccoli", icon: "🥦" }, { label: "Potato", icon: "🥔" }, { label: "Mushrooms", icon: "🍄" }, { label: "Zucchini", icon: "🥒" }] },
  { category: "Pantry", items: [{ label: "Rice", icon: "🍚" }, { label: "Pasta", icon: "🍝" }, { label: "Bread", icon: "🍞" }, { label: "Oats", icon: "🌾" }, { label: "Canned Beans", icon: "🫘" }, { label: "Lentils", icon: "🟤" }] },
  { category: "Condiments", items: [{ label: "Soy Sauce", icon: "🫙" }, { label: "Olive Oil", icon: "🫒" }, { label: "Lemon", icon: "🍋" }, { label: "Hot Sauce", icon: "🌶️" }, { label: "Honey", icon: "🍯" }, { label: "Mustard", icon: "💛" }] },
]

const dietRestrictions: Record<string, string[]> = {
  "Vegetarian": ["Chicken", "Beef", "Shrimp", "Canned Tuna", "Bacon"],
  "Vegan": ["Chicken", "Beef", "Shrimp", "Canned Tuna", "Bacon", "Eggs", "Milk", "Butter", "Cheese", "Yogurt", "Cream", "Sour Cream", "Honey"],
  "Dairy-Free": ["Milk", "Butter", "Cheese", "Yogurt", "Cream", "Sour Cream"],
  "Gluten-Free": ["Pasta", "Bread", "Oats", "Soy Sauce"],
  "Keto": ["Rice", "Pasta", "Bread", "Oats", "Canned Beans", "Lentils", "Honey"],
}

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
  imageUrl: string | null
  imageQuery?: string
}

export default function Home() {
  const [selectedMood, setSelectedMood] = useState("")
  const [selectedDiet, setSelectedDiet] = useState("None")
  const [selectedTime, setSelectedTime] = useState(0)
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(false)
  const [dark, setDark] = useState(false)
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [fridgeOpen, setFridgeOpen] = useState(false)

  function toggleIngredient(item: string) {
    setSelectedIngredients(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    )
  }

  const d = dark

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
          ingredients: selectedIngredients,
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
    <main style={{
      minHeight: "100vh",
      background: d
        ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
        : "linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)",
      transition: "background 0.3s",
    }}>

      {/* Navbar */}
      <nav style={{
        background: d ? "#1e293b" : "white",
        boxShadow: d ? "0 2px 12px rgba(0,0,0,0.4)" : "0 2px 12px rgba(0,0,0,0.08)",
        padding: "16px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "background 0.3s",
      }}>
        <span style={{ fontSize: "28px", fontWeight: "800", color: "#0d9488", letterSpacing: "-0.5px" }}>🍽️ Meal4Mood</span>
        <button
          onClick={() => setDark(!d)}
          style={{
            background: d ? "#334155" : "#f1f5f9",
            border: "none",
            borderRadius: "999px",
            padding: "8px 16px",
            cursor: "pointer",
            fontSize: "18px",
            transition: "background 0.2s",
          }}
        >
          {d ? "☀️" : "🌙"}
        </button>
      </nav>

      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "48px 24px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "800", color: d ? "#f0fdfa" : "#134e4a", marginBottom: "10px" }}>
            What are you feeling today?
          </h2>
          <p style={{ color: d ? "#94a3b8" : "#64748b", fontSize: "16px" }}>
            Tell us your mood and we'll cook up the perfect recipe for you ✨
          </p>
        </div>

        {/* Mood Selector */}
        <div style={{
          background: d ? "#1e293b" : "white",
          borderRadius: "24px",
          padding: "28px",
          boxShadow: d ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.08)",
          marginBottom: "20px",
          transition: "background 0.3s",
        }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: d ? "#f0fdfa" : "#134e4a", marginBottom: "20px", textAlign: "center" }}>
            😌 How are you feeling?
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            {moods.map((mood) => (
              <button
                key={mood.label}
                onClick={() => setSelectedMood(mood.label)}
                style={{
                  background: selectedMood === mood.label
                    ? "linear-gradient(135deg, #0d9488, #0891b2)"
                    : d ? "#0f172a" : "#f8fafc",
                  border: selectedMood === mood.label ? "2px solid #0d9488" : `2px solid ${d ? "#334155" : "#e2e8f0"}`,
                  borderRadius: "16px",
                  padding: "18px 8px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: selectedMood === mood.label ? "0 4px 12px rgba(13,148,136,0.3)" : "none",
                  transform: selectedMood === mood.label ? "scale(1.05)" : "scale(1)",
                }}
              >
                <div style={{ fontSize: "36px", marginBottom: "8px" }}>{mood.emoji}</div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: selectedMood === mood.label ? "white" : d ? "#94a3b8" : "#475569" }}>
                  {mood.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Dietary Preferences */}
        <div style={{
          background: d ? "#1e293b" : "white",
          borderRadius: "24px",
          padding: "28px",
          boxShadow: d ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.08)",
          marginBottom: "20px",
          transition: "background 0.3s",
        }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: d ? "#f0fdfa" : "#134e4a", marginBottom: "20px", textAlign: "center" }}>
            🥗 Any dietary preferences?
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
            {diets.map((diet) => (
              <button
                key={diet}
                onClick={() => {
                  setSelectedDiet(diet)
                  const restricted = dietRestrictions[diet] ?? []
                  setSelectedIngredients(prev => prev.filter(i => !restricted.includes(i)))
                }}
                style={{
                  padding: "10px 20px",
                  borderRadius: "999px",
                  border: "2px solid",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: selectedDiet === diet ? "linear-gradient(135deg, #0d9488, #0891b2)" : d ? "#0f172a" : "white",
                  color: selectedDiet === diet ? "white" : d ? "#94a3b8" : "#475569",
                  borderColor: selectedDiet === diet ? "#0d9488" : d ? "#334155" : "#e2e8f0",
                  boxShadow: selectedDiet === diet ? "0 4px 12px rgba(13,148,136,0.3)" : "none",
                }}
              >
                {diet}
              </button>
            ))}
          </div>
        </div>

        {/* Time Availability */}
        <div style={{
          background: d ? "#1e293b" : "white",
          borderRadius: "24px",
          padding: "28px",
          boxShadow: d ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.08)",
          marginBottom: "28px",
          transition: "background 0.3s",
        }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: d ? "#f0fdfa" : "#134e4a", marginBottom: "20px", textAlign: "center" }}>
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
                  background: selectedTime === time.value ? "linear-gradient(135deg, #0d9488, #0891b2)" : d ? "#0f172a" : "white",
                  color: selectedTime === time.value ? "white" : d ? "#94a3b8" : "#475569",
                  borderColor: selectedTime === time.value ? "#0d9488" : d ? "#334155" : "#e2e8f0",
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
            background: selectedMood && selectedTime ? "linear-gradient(135deg, #0d9488, #0891b2)" : d ? "#1e293b" : "#e2e8f0",
            color: selectedMood && selectedTime ? "white" : d ? "#475569" : "#94a3b8",
            boxShadow: selectedMood && selectedTime ? "0 8px 24px rgba(13,148,136,0.4)" : "none",
            transition: "all 0.2s",
          }}
        >
          {loading ? "🍳 Cooking up your recipe..." : "🍽️ Find My Recipe"}
        </button>

        {(!selectedMood || !selectedTime) && (
          <p style={{ textAlign: "center", color: d ? "#475569" : "#94a3b8", fontSize: "13px", marginTop: "12px" }}>
            Please select a mood and time to continue
          </p>
        )}

        {/* Recipe Result */}
        {recipe && (
          <div style={{
            background: d ? "#1e293b" : "white",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: d ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.08)",
            marginTop: "28px",
            transition: "background 0.3s",
          }}>
            {recipe.imageUrl && (
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                style={{ width: "100%", height: "220px", objectFit: "cover", display: "block" }}
              />
            )}
            <div style={{ padding: "32px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "800", color: d ? "#f0fdfa" : "#134e4a", marginBottom: "8px" }}>
              {recipe.title}
            </h2>
            <p style={{ color: d ? "#94a3b8" : "#64748b", marginBottom: "20px" }}>{recipe.description}</p>

            <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
              <span style={{ background: d ? "#0f172a" : "#f0fdfa", color: "#0d9488", padding: "6px 14px", borderRadius: "999px", fontSize: "13px", fontWeight: "600" }}>
                ⏱️ {recipe.cookTime} mins
              </span>
              <span style={{ background: d ? "#0f172a" : "#f0fdfa", color: "#0d9488", padding: "6px 14px", borderRadius: "999px", fontSize: "13px", fontWeight: "600" }}>
                🍽️ {recipe.servings} servings
              </span>
            </div>

            <h3 style={{ fontSize: "16px", fontWeight: "700", color: d ? "#f0fdfa" : "#134e4a", marginBottom: "12px" }}>
              🛒 Ingredients
            </h3>
            <ul style={{ listStyle: "none", padding: 0, marginBottom: "24px" }}>
              {recipe.ingredients.map((ing, i) => (
                <li key={i} style={{ padding: "8px 0", borderBottom: `1px solid ${d ? "#334155" : "#f1f5f9"}`, color: d ? "#94a3b8" : "#475569", fontSize: "14px" }}>
                  • {ing}
                </li>
              ))}
            </ul>

            <h3 style={{ fontSize: "16px", fontWeight: "700", color: d ? "#f0fdfa" : "#134e4a", marginBottom: "12px" }}>
              👨‍🍳 Instructions
            </h3>
            <ol style={{ listStyle: "none", padding: 0 }}>
              {recipe.steps.map((step, i) => (
                <li key={i} style={{ display: "flex", gap: "12px", padding: "10px 0", borderBottom: `1px solid ${d ? "#334155" : "#f1f5f9"}` }}>
                  <span style={{ background: "linear-gradient(135deg, #0d9488, #0891b2)", color: "white", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", flexShrink: 0 }}>
                    {i + 1}
                  </span>
                  <span style={{ color: d ? "#94a3b8" : "#475569", fontSize: "14px" }}>{step}</span>
                </li>
              ))}
            </ol>
            </div>
          </div>
        )}

      </div>

      {/* Fridge toggle button */}
      <button
        onClick={() => setFridgeOpen(!fridgeOpen)}
        style={{
          position: "fixed",
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          background: "linear-gradient(135deg, #0d9488, #0891b2)",
          color: "white",
          border: "none",
          borderRadius: "12px 0 0 12px",
          padding: "16px 10px",
          cursor: "pointer",
          fontSize: "20px",
          boxShadow: "-4px 0 16px rgba(13,148,136,0.3)",
          writingMode: "vertical-rl",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          zIndex: 100,
        }}
      >
        🧊
        {selectedIngredients.length > 0 && (
          <span style={{ fontSize: "11px", fontWeight: "800", background: "white", color: "#0d9488", borderRadius: "999px", padding: "2px 6px", writingMode: "horizontal-tb" }}>
            {selectedIngredients.length}
          </span>
        )}
      </button>

      {/* Fridge panel */}
      {fridgeOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setFridgeOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 101 }}
          />
          {/* Panel */}
          <div style={{
            position: "fixed",
            right: 0,
            top: 0,
            bottom: 0,
            width: "320px",
            background: d ? "#1e293b" : "white",
            boxShadow: "-8px 0 32px rgba(0,0,0,0.2)",
            zIndex: 102,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}>
            {/* Panel header */}
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${d ? "#334155" : "#f1f5f9"}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: "800", color: d ? "#f0fdfa" : "#134e4a", margin: 0 }}>🧊 My Fridge</h3>
                <p style={{ fontSize: "12px", color: "#94a3b8", margin: "4px 0 0" }}>Check what you have</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {selectedIngredients.length > 0 && (
                  <button onClick={() => setSelectedIngredients([])} style={{ fontSize: "12px", color: "#94a3b8", background: "none", border: "none", cursor: "pointer" }}>
                    Clear all
                  </button>
                )}
                <button onClick={() => setFridgeOpen(false)} style={{ background: d ? "#334155" : "#f1f5f9", border: "none", borderRadius: "8px", width: "32px", height: "32px", cursor: "pointer", fontSize: "16px" }}>
                  ✕
                </button>
              </div>
            </div>
            {/* Panel body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
              {fridgeItems.map((group) => (
                <div key={group.category} style={{ marginBottom: "20px" }}>
                  <p style={{ fontSize: "11px", fontWeight: "700", color: "#0d9488", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "10px" }}>
                    {group.category}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {group.items.map((item) => {
                      const checked = selectedIngredients.includes(item.label)
                      const restricted = dietRestrictions[selectedDiet]?.includes(item.label) ?? false
                      return (
                        <label
                          key={item.label}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "9px 12px",
                            borderRadius: "12px",
                            cursor: restricted ? "not-allowed" : "pointer",
                            background: restricted ? (d ? "#1a1a2e" : "#f8f8f8") : checked ? (d ? "#0f3d3a" : "#f0fdfa") : "transparent",
                            border: `1.5px solid ${restricted ? (d ? "#2a2a3e" : "#e8e8e8") : checked ? "#0d9488" : d ? "#334155" : "#e2e8f0"}`,
                            opacity: restricted ? 0.45 : 1,
                            transition: "all 0.15s",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={restricted}
                            onChange={() => toggleIngredient(item.label)}
                            style={{ accentColor: "#0d9488", width: "16px", height: "16px", cursor: restricted ? "not-allowed" : "pointer" }}
                          />
                          <span style={{ fontSize: "18px" }}>{item.icon}</span>
                          <span style={{ fontSize: "13px", fontWeight: "600", color: restricted ? (d ? "#3a3a5a" : "#c0c0c0") : checked ? "#0d9488" : d ? "#94a3b8" : "#475569" }}>
                            {item.label}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </main>
  )
}
