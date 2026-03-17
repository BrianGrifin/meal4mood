"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../../lib/supabase"

interface SavedRecipe {
  id: string
  title: string
  description: string
  cook_time: number
  servings: number
  ingredients: string[]
  steps: string[]
  image_url: string | null
  mood: string
  diet: string
  created_at: string
}

export default function SavedPage() {
  const [recipes, setRecipes] = useState<SavedRecipe[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [dark, setDark] = useState(false)
  const router = useRouter()
  const d = dark

  useEffect(() => {
    const stored = localStorage.getItem("meal4mood-dark")
    if (stored === "true") setDark(true)
  }, [])

  useEffect(() => {
    localStorage.setItem("meal4mood-dark", String(dark))
  }, [dark])

  useEffect(() => {
    async function load() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { router.push("/"); return }
        const { data, error: fetchError } = await supabase
          .from("saved_recipes")
          .select("*")
          .order("created_at", { ascending: false })
        if (fetchError) throw fetchError
        setRecipes(data ?? [])
      } catch {
        setError("Failed to load recipes. Please refresh the page.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router])

  async function deleteRecipe(id: string) {
    if (!confirm("Delete this recipe?")) return
    setDeleting(id)
    const { error: deleteError } = await supabase.from("saved_recipes").delete().eq("id", id)
    if (deleteError) {
      setError("Failed to delete recipe. Please try again.")
    } else {
      setRecipes(prev => prev.filter(r => r.id !== id))
    }
    setDeleting(null)
  }

  return (
    <main style={{ minHeight: "100vh", background: d ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" : "linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)", transition: "background 0.3s" }}>
      <nav style={{ background: d ? "#1e293b" : "white", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "background 0.3s" }}>
        <span
          onClick={() => router.push("/")}
          style={{ fontSize: "28px", fontWeight: "800", color: "#0d9488", letterSpacing: "-0.5px", cursor: "pointer" }}
        >
          🍽️ Meal4Mood
        </span>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            onClick={() => setDark(!d)}
            aria-label={d ? "Switch to light mode" : "Switch to dark mode"}
            style={{ background: d ? "#334155" : "#f1f5f9", border: "none", borderRadius: "999px", padding: "8px 16px", cursor: "pointer", fontSize: "18px", transition: "background 0.2s" }}
          >
            {d ? "☀️" : "🌙"}
          </button>
          <button
            onClick={() => router.push("/")}
            aria-label="Go back to home"
            style={{ background: d ? "#334155" : "#f1f5f9", border: "none", borderRadius: "12px", padding: "8px 18px", fontWeight: "700", color: d ? "#cbd5e1" : "#475569", cursor: "pointer", fontSize: "14px" }}
          >
            ← Back
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "48px 24px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "800", color: d ? "#f0fdfa" : "#134e4a", marginBottom: "8px" }}>
          📚 Saved Recipes
        </h2>
        <p style={{ color: d ? "#94a3b8" : "#64748b", marginBottom: "32px" }}>
          {recipes.length} recipe{recipes.length !== 1 ? "s" : ""} saved
        </p>

        {error && (
          <div role="alert" style={{ marginBottom: "16px", padding: "14px 18px", borderRadius: "12px", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "14px", fontWeight: "600", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)} aria-label="Dismiss error" style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", fontSize: "16px" }}>✕</button>
          </div>
        )}

        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: d ? "#1e293b" : "white", borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                <div className="skeleton" style={{ width: "100%", height: "180px" }} />
                <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div className="skeleton" style={{ height: "20px", width: "55%", borderRadius: "6px" }} />
                  <div className="skeleton" style={{ height: "14px", width: "80%", borderRadius: "6px" }} />
                  <div className="skeleton" style={{ height: "14px", width: "65%", borderRadius: "6px" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && recipes.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🍽️</div>
            <p style={{ fontWeight: "600" }}>No saved recipes yet</p>
            <p style={{ fontSize: "14px" }}>Generate a recipe and hit Save!</p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              style={{ background: d ? "#1e293b" : "white", borderRadius: "20px", overflow: "hidden", boxShadow: d ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.08)", transition: "background 0.3s" }}
            >
              {recipe.image_url && (
                <img src={recipe.image_url} alt={recipe.title} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
              )}
              <div style={{ padding: "20px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                  <h3 style={{ fontSize: "17px", fontWeight: "800", color: d ? "#f0fdfa" : "#134e4a", margin: 0, flex: 1 }}>{recipe.title}</h3>
                  <button
                    onClick={() => deleteRecipe(recipe.id)}
                    disabled={deleting === recipe.id}
                    aria-label="Delete recipe"
                    style={{ background: "none", border: "none", cursor: deleting === recipe.id ? "not-allowed" : "pointer", fontSize: "16px", color: "#94a3b8", marginLeft: "12px", flexShrink: 0, opacity: deleting === recipe.id ? 0.5 : 1 }}
                  >
                    {deleting === recipe.id ? "⏳" : "🗑️"}
                  </button>
                </div>
                <div style={{ display: "flex", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
                  <span style={{ background: d ? "#0f3d3a" : "#f0fdfa", color: "#0d9488", padding: "3px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: "600" }}>⏱️ {recipe.cook_time} mins</span>
                  <span style={{ background: d ? "#0f3d3a" : "#f0fdfa", color: "#0d9488", padding: "3px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: "600" }}>😊 {recipe.mood}</span>
                  <span style={{ background: d ? "#0f3d3a" : "#f0fdfa", color: "#0d9488", padding: "3px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: "600" }}>🥗 {recipe.diet}</span>
                </div>
                <p style={{ color: d ? "#94a3b8" : "#64748b", fontSize: "13px", marginBottom: "12px" }}>{recipe.description}</p>
                <button
                  onClick={() => setExpanded(expanded === recipe.id ? null : recipe.id)}
                  aria-expanded={expanded === recipe.id}
                  aria-label={expanded === recipe.id ? "Hide recipe details" : "View recipe details"}
                  style={{ fontSize: "13px", fontWeight: "700", color: "#0d9488", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  {expanded === recipe.id ? "Hide recipe ▲" : "View recipe ▼"}
                </button>

                {expanded === recipe.id && (
                  <div style={{ marginTop: "16px" }}>
                    <h4 style={{ fontSize: "14px", fontWeight: "700", color: d ? "#f0fdfa" : "#134e4a", marginBottom: "8px" }}>🛒 Ingredients</h4>
                    <ul style={{ listStyle: "none", padding: 0, marginBottom: "16px" }}>
                      {recipe.ingredients.map((ing, i) => (
                        <li key={i} style={{ padding: "6px 0", borderBottom: `1px solid ${d ? "#334155" : "#f1f5f9"}`, color: d ? "#94a3b8" : "#475569", fontSize: "13px" }}>• {ing}</li>
                      ))}
                    </ul>
                    <h4 style={{ fontSize: "14px", fontWeight: "700", color: d ? "#f0fdfa" : "#134e4a", marginBottom: "8px" }}>👨‍🍳 Instructions</h4>
                    <ol style={{ listStyle: "none", padding: 0 }}>
                      {recipe.steps.map((step, i) => (
                        <li key={i} style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: `1px solid ${d ? "#334155" : "#f1f5f9"}` }}>
                          <span style={{ background: "linear-gradient(135deg, #0d9488, #0891b2)", color: "white", borderRadius: "50%", width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", flexShrink: 0 }}>{i + 1}</span>
                          <span style={{ color: d ? "#94a3b8" : "#475569", fontSize: "13px" }}>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
