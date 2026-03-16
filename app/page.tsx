"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../lib/supabase"
import type { User } from "@supabase/supabase-js"

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

const tickerDishes = [
  { emoji: "🍜", name: "Spicy Ramen", rating: "4.9" },
  { emoji: "🥑", name: "Avocado Toast", rating: "4.7" },
  { emoji: "🍕", name: "Margherita Pizza", rating: "4.8" },
  { emoji: "🍣", name: "Salmon Sushi", rating: "4.9" },
  { emoji: "🥗", name: "Caesar Salad", rating: "4.6" },
  { emoji: "🍝", name: "Carbonara", rating: "4.8" },
  { emoji: "🌮", name: "Street Tacos", rating: "4.7" },
  { emoji: "🍛", name: "Chicken Tikka Masala", rating: "4.9" },
  { emoji: "🥩", name: "Ribeye Steak", rating: "4.8" },
  { emoji: "🍱", name: "Bento Bowl", rating: "4.7" },
  { emoji: "🫕", name: "Moroccan Tagine", rating: "4.8" },
  { emoji: "🥘", name: "Seafood Paella", rating: "4.9" },
  { emoji: "🍲", name: "Beef Bourguignon", rating: "4.8" },
  { emoji: "🧆", name: "Falafel Wrap", rating: "4.6" },
  { emoji: "🍤", name: "Tempura Shrimp", rating: "4.7" },
  { emoji: "🥞", name: "Blueberry Pancakes", rating: "4.8" },
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
  const [user, setUser] = useState<User | null>(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [quickEmoji, setQuickEmoji] = useState("🍕")
  const luckyBase = "Feeling Lucky?"
  const quickEmojis = ["🍕","🍜","🌮","🍣","🥗","🍛","🥩","🍝","🧆","🥞","🍱","🫕","🍤","🥑","🍲","🌯"]

  useEffect(() => {
    const emojiInterval = setInterval(() => {
      setQuickEmoji(prev => {
        const idx = quickEmojis.indexOf(prev)
        return quickEmojis[(idx + 1) % quickEmojis.length]
      })
    }, 300)
    return () => clearInterval(emojiInterval)
  }, [])

  function handleQuickPick() {
    const randomMood = moods[Math.floor(Math.random() * moods.length)].label
    const randomDiet = diets[Math.floor(Math.random() * diets.length)]
    const randomTime = times[Math.floor(Math.random() * times.length)].value
    setSelectedMood(randomMood)
    setSelectedDiet(randomDiet)
    setSelectedTime(randomTime)
    setSaved(false)
    setRecipe(null)
    setTimeout(() => {
      setLoading(true)
      fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: randomMood, diet: randomDiet, time: randomTime, ingredients: selectedIngredients }),
      })
        .then(r => r.json())
        .then(data => { setRecipe(data); setLoading(false) })
        .catch(() => setLoading(false))
    }, 100)
  }
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setAuthChecked(true)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleAuth() {
    setAuthError("")
    const { error } = authMode === "login"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })
    if (error) { setAuthError(error.message); return }
    setAuthOpen(false)
    setEmail("")
    setPassword("")
  }

  async function handleSave() {
    if (!user || !recipe) return
    setSaving(true)
    await supabase.from("saved_recipes").insert({
      user_id: user.id,
      title: recipe.title,
      description: recipe.description,
      cook_time: recipe.cookTime,
      servings: recipe.servings,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      image_url: recipe.imageUrl,
      mood: selectedMood,
      diet: selectedDiet,
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function toggleIngredient(item: string) {
    setSelectedIngredients(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    )
  }

  const d = dark

  if (!authChecked) return null

  if (!user) return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "48px" }}>
      {/* Ticker strip */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, overflow: "hidden", background: "#134e4a", padding: "10px 0", zIndex: 50 }}>
        <div className="ticker-track">
          {[...tickerDishes, ...tickerDishes].map((dish, i) => (
            <div className="ticker-item" key={i} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0 32px", borderRight: "1px solid rgba(255,255,255,0.15)", whiteSpace: "nowrap" }}>
              <span style={{ fontSize: "18px" }}>{dish.emoji}</span>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "white" }}>{dish.name}</span>
              <span style={{ fontSize: "12px", color: "#5eead4", fontWeight: "700" }}>⭐ {dish.rating}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>🍽️</div>
        <h1 style={{ fontSize: "36px", fontWeight: "800", color: "#134e4a", marginBottom: "8px" }}>Meal4Mood</h1>
        <p style={{ color: "#64748b", fontSize: "16px" }}>AI-powered recipes based on how you feel</p>
      </div>
      <div style={{ background: "white", borderRadius: "24px", padding: "36px", width: "340px", boxShadow: "0 4px 24px rgba(0,0,0,0.1)" }}>
        <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#134e4a", marginBottom: "6px" }}>
          {authMode === "login" ? "Welcome back 👋" : "Create account 🎉"}
        </h3>
        <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "24px" }}>
          {authMode === "login" ? "Sign in to get started" : "Join to save your favourite recipes"}
        </p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1.5px solid #e2e8f0", background: "#f8fafc", color: "#134e4a", fontSize: "14px", marginBottom: "10px", boxSizing: "border-box" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAuth()}
          style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1.5px solid #e2e8f0", background: "#f8fafc", color: "#134e4a", fontSize: "14px", marginBottom: "16px", boxSizing: "border-box" }}
        />
        {authError && <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>{authError}</p>}
        <button
          onClick={handleAuth}
          style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #0d9488, #0891b2)", color: "white", fontSize: "15px", fontWeight: "800", cursor: "pointer", marginBottom: "14px" }}
        >
          {authMode === "login" ? "Sign in" : "Sign up"}
        </button>
        <p style={{ textAlign: "center", fontSize: "13px", color: "#94a3b8" }}>
          {authMode === "login" ? "No account? " : "Already have one? "}
          <span
            onClick={() => { setAuthMode(authMode === "login" ? "signup" : "login"); setAuthError("") }}
            style={{ color: "#0d9488", fontWeight: "700", cursor: "pointer" }}
          >
            {authMode === "login" ? "Sign up" : "Sign in"}
          </span>
        </p>
      </div>

      {/* Bottom ticker strip */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, overflow: "hidden", background: "#134e4a", padding: "10px 0", zIndex: 50 }}>
        <div className="ticker-track" style={{ animationDirection: "reverse" }}>
          {[...tickerDishes, ...tickerDishes].map((dish, i) => (
            <div className="ticker-item" key={i} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0 32px", borderRight: "1px solid rgba(255,255,255,0.15)", whiteSpace: "nowrap" }}>
              <span style={{ fontSize: "18px" }}>{dish.emoji}</span>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "white" }}>{dish.name}</span>
              <span style={{ fontSize: "12px", color: "#5eead4", fontWeight: "700" }}>⭐ {dish.rating}</span>
            </div>
          ))}
        </div>
      </div>

    </main>
  )

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
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {user ? (
            <>
              <button
                onClick={() => router.push("/saved")}
                style={{ background: d ? "#334155" : "#f1f5f9", border: "none", borderRadius: "999px", padding: "8px 16px", cursor: "pointer", fontSize: "14px", fontWeight: "700", color: d ? "#f0fdfa" : "#475569" }}
              >
                📚 Saved
              </button>
              <button
                onClick={() => supabase.auth.signOut()}
                style={{ background: "none", border: `2px solid ${d ? "#334155" : "#e2e8f0"}`, borderRadius: "999px", padding: "8px 16px", cursor: "pointer", fontSize: "13px", fontWeight: "600", color: "#94a3b8" }}
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={() => { setAuthMode("login"); setAuthOpen(true) }}
              style={{ background: "linear-gradient(135deg, #0d9488, #0891b2)", border: "none", borderRadius: "999px", padding: "8px 20px", cursor: "pointer", fontSize: "14px", fontWeight: "700", color: "white" }}
            >
              Sign in
            </button>
          )}
          <button
            onClick={() => setDark(!d)}
            style={{ background: d ? "#334155" : "#f1f5f9", border: "none", borderRadius: "999px", padding: "8px 16px", cursor: "pointer", fontSize: "18px", transition: "background 0.2s" }}
          >
            {d ? "☀️" : "🌙"}
          </button>
        </div>
      </nav>

      {/* Quick Pick strip */}
      <div
        onClick={handleQuickPick}
        style={{
          background: "#134e4a",
          overflow: "hidden",
          cursor: "pointer",
          padding: "12px 0",
        }}
      >
        <div className="ticker-track-fast">
          {[...Array.from({ length: 20 }), ...Array.from({ length: 20 })].map((_, i) => (
            <div key={i} className="ticker-item" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0 28px", borderRight: "1px solid rgba(255,255,255,0.2)", whiteSpace: "nowrap" }}>
              <span style={{ fontSize: "14px", fontWeight: "800", color: "white", letterSpacing: "0.5px" }}>⚡ {luckyBase}</span>
              <span style={{ fontSize: "20px" }}>{quickEmoji}</span>
            </div>
          ))}
        </div>
      </div>

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
            cursor: loading ? "not-allowed" : selectedMood && selectedTime ? "pointer" : "not-allowed",
            background: loading ? (d ? "#1e293b" : "#1a1a1a") : selectedMood && selectedTime ? "linear-gradient(135deg, #0d9488, #0891b2)" : d ? "#1e293b" : "#e2e8f0",
            color: loading ? "#555" : selectedMood && selectedTime ? "white" : d ? "#475569" : "#94a3b8",
            boxShadow: loading ? "none" : selectedMood && selectedTime ? "0 8px 24px rgba(13,148,136,0.4)" : "none",
            opacity: loading ? 0.7 : 1,
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
              <h2 style={{ fontSize: "24px", fontWeight: "800", color: d ? "#f0fdfa" : "#134e4a", margin: 0, flex: 1 }}>
                {recipe.title}
              </h2>
              {user ? (
                <button
                  onClick={handleSave}
                  disabled={saving || saved}
                  style={{
                    background: saved ? "#0d9488" : "linear-gradient(135deg, #0d9488, #0891b2)",
                    border: "none",
                    borderRadius: "12px",
                    padding: "10px 18px",
                    cursor: saving || saved ? "default" : "pointer",
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "white",
                    marginLeft: "12px",
                    flexShrink: 0,
                    transition: "all 0.2s",
                  }}
                >
                  {saved ? "✓ Saved!" : saving ? "Saving..." : "💾 Save"}
                </button>
              ) : (
                <button
                  onClick={() => { setAuthMode("login"); setAuthOpen(true) }}
                  style={{ background: "none", border: "2px solid #e2e8f0", borderRadius: "12px", padding: "10px 18px", cursor: "pointer", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginLeft: "12px", flexShrink: 0 }}
                >
                  💾 Sign in to save
                </button>
              )}
            </div>
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

      {/* Auth modal */}
      {authOpen && (
        <>
          <div onClick={() => setAuthOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200 }} />
          <div style={{
            position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            background: d ? "#1e293b" : "white", borderRadius: "24px", padding: "36px",
            width: "340px", zIndex: 201, boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}>
            <h3 style={{ fontSize: "22px", fontWeight: "800", color: d ? "#f0fdfa" : "#134e4a", marginBottom: "6px" }}>
              {authMode === "login" ? "Welcome back 👋" : "Create account 🎉"}
            </h3>
            <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "24px" }}>
              {authMode === "login" ? "Sign in to save your recipes" : "Start saving your favourite recipes"}
            </p>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: `1.5px solid ${d ? "#334155" : "#e2e8f0"}`, background: d ? "#0f172a" : "#f8fafc", color: d ? "#f0fdfa" : "#134e4a", fontSize: "14px", marginBottom: "10px", boxSizing: "border-box" }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAuth()}
              style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: `1.5px solid ${d ? "#334155" : "#e2e8f0"}`, background: d ? "#0f172a" : "#f8fafc", color: d ? "#f0fdfa" : "#134e4a", fontSize: "14px", marginBottom: "16px", boxSizing: "border-box" }}
            />
            {authError && <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>{authError}</p>}
            <button
              onClick={handleAuth}
              style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #0d9488, #0891b2)", color: "white", fontSize: "15px", fontWeight: "800", cursor: "pointer", marginBottom: "14px" }}
            >
              {authMode === "login" ? "Sign in" : "Sign up"}
            </button>
            <p style={{ textAlign: "center", fontSize: "13px", color: "#94a3b8" }}>
              {authMode === "login" ? "No account? " : "Already have one? "}
              <span
                onClick={() => { setAuthMode(authMode === "login" ? "signup" : "login"); setAuthError("") }}
                style={{ color: "#0d9488", fontWeight: "700", cursor: "pointer" }}
              >
                {authMode === "login" ? "Sign up" : "Sign in"}
              </span>
            </p>
          </div>
        </>
      )}

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
