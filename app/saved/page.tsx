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
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/"); return }
      const { data } = await supabase
        .from("saved_recipes")
        .select("*")
        .order("created_at", { ascending: false })
      setRecipes(data ?? [])
      setLoading(false)
    }
    load()
  }, [router])

  async function deleteRecipe(id: string) {
    await supabase.from("saved_recipes").delete().eq("id", id)
    setRecipes(prev => prev.filter(r => r.id !== id))
  }

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)" }}>
      <nav style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          onClick={() => router.push("/")}
          style={{ fontSize: "28px", fontWeight: "800", color: "#0d9488", letterSpacing: "-0.5px", cursor: "pointer" }}
        >
          🍽️ Meal4Mood
        </span>
        <button
          onClick={() => router.push("/")}
          style={{ background: "#f1f5f9", border: "none", borderRadius: "12px", padding: "8px 18px", fontWeight: "700", color: "#475569", cursor: "pointer", fontSize: "14px" }}
        >
          ← Back
        </button>
      </nav>

      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "48px 24px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#134e4a", marginBottom: "8px" }}>
          📚 Saved Recipes
        </h2>
        <p style={{ color: "#64748b", marginBottom: "32px" }}>
          {recipes.length} recipe{recipes.length !== 1 ? "s" : ""} saved
        </p>

        {loading && <p style={{ color: "#94a3b8", textAlign: "center" }}>Loading...</p>}

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
              style={{ background: "white", borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
            >
              {recipe.image_url && (
                <img src={recipe.image_url} alt={recipe.title} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
              )}
              <div style={{ padding: "20px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                  <h3 style={{ fontSize: "17px", fontWeight: "800", color: "#134e4a", margin: 0, flex: 1 }}>{recipe.title}</h3>
                  <button
                    onClick={() => deleteRecipe(recipe.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#94a3b8", marginLeft: "12px", flexShrink: 0 }}
                  >
                    🗑️
                  </button>
                </div>
                <div style={{ display: "flex", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
                  <span style={{ background: "#f0fdfa", color: "#0d9488", padding: "3px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: "600" }}>⏱️ {recipe.cook_time} mins</span>
                  <span style={{ background: "#f0fdfa", color: "#0d9488", padding: "3px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: "600" }}>😊 {recipe.mood}</span>
                  <span style={{ background: "#f0fdfa", color: "#0d9488", padding: "3px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: "600" }}>🥗 {recipe.diet}</span>
                </div>
                <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "12px" }}>{recipe.description}</p>
                <button
                  onClick={() => setExpanded(expanded === recipe.id ? null : recipe.id)}
                  style={{ fontSize: "13px", fontWeight: "700", color: "#0d9488", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  {expanded === recipe.id ? "Hide recipe ▲" : "View recipe ▼"}
                </button>

                {expanded === recipe.id && (
                  <div style={{ marginTop: "16px" }}>
                    <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#134e4a", marginBottom: "8px" }}>🛒 Ingredients</h4>
                    <ul style={{ listStyle: "none", padding: 0, marginBottom: "16px" }}>
                      {recipe.ingredients.map((ing, i) => (
                        <li key={i} style={{ padding: "6px 0", borderBottom: "1px solid #f1f5f9", color: "#475569", fontSize: "13px" }}>• {ing}</li>
                      ))}
                    </ul>
                    <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#134e4a", marginBottom: "8px" }}>👨‍🍳 Instructions</h4>
                    <ol style={{ listStyle: "none", padding: 0 }}>
                      {recipe.steps.map((step, i) => (
                        <li key={i} style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                          <span style={{ background: "linear-gradient(135deg, #0d9488, #0891b2)", color: "white", borderRadius: "50%", width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", flexShrink: 0 }}>{i + 1}</span>
                          <span style={{ color: "#475569", fontSize: "13px" }}>{step}</span>
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
