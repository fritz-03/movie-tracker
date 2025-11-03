"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Film, Calendar, Star, ImageIcon, FileText } from "lucide-react"

const GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Western",
]

interface User {
  id: number
  name: string
  email: string
}

export default function AddMoviePage() {
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    rating: "",
    watchDate: "",
    imageUrl: "",
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      router.push("/login")
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId: user.id,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Movie added successfully!")
        setFormData({
          title: "",
          genre: "",
          rating: "",
          watchDate: "",
          imageUrl: "",
          notes: "",
        })
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } else {
        setError(data.error || "Something went wrong")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[60%] bg-gradient-to-br from-blue-500/20 via-cyan-400/10 to-sky-400/10 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[60%] bg-gradient-to-tr from-blue-600/15 via-blue-500/10 to-indigo-400/10 rounded-full blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[50%] bg-gradient-to-bl from-blue-400/10 via-cyan-300/5 to-sky-300/5 rounded-full blur-[110px] animate-blob animation-delay-4000" />
      </div>

      <nav className="relative z-10 border-b border-gray-800 bg-[#0f0f0f]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg" />
              <h1 className="text-xl font-semibold text-white">Personal Movie Tracker</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              <span className="text-gray-300">
                Welcome, <span className="text-white font-medium">{user.name}</span>
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Film className="w-10 h-10 text-blue-400" />
              <h1 className="text-3xl font-bold text-white">Add a Movie</h1>
            </div>
            <p className="text-gray-400">Track the movies you've watched and build your personal movie database!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Required Fields Section */}
            <div className="border-b border-gray-800 pb-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Film className="w-5 h-5 text-blue-400" />
                Movie Details (Required)
              </h2>

              {/* Title */}
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                  Movie Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter the movie title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              {/* Genre */}
              <div className="mb-4">
                <label htmlFor="genre" className="block text-sm font-medium text-gray-300 mb-2">
                  Genre *
                </label>
                <select
                  id="genre"
                  name="genre"
                  required
                  className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={formData.genre}
                  onChange={handleChange}
                >
                  <option value="">Select a genre</option>
                  {GENRES.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating */}
              <div className="mb-4">
                <label
                  htmlFor="rating"
                  className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2"
                >
                  <Star className="w-4 h-4 text-yellow-400" />
                  Your Rating (1-10) *
                </label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  min="1"
                  max="10"
                  required
                  className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Rate from 1-10"
                  value={formData.rating}
                  onChange={handleChange}
                />
              </div>

              {/* Watch Date */}
              <div className="mb-4">
                <label
                  htmlFor="watchDate"
                  className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-blue-400" />
                  Watch Date *
                </label>
                <input
                  type="date"
                  id="watchDate"
                  name="watchDate"
                  required
                  className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={formData.watchDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Optional Fields Section */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Optional Details</h2>

              {/* Image URL */}
              <div className="mb-4">
                <label
                  htmlFor="imageUrl"
                  className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2"
                >
                  <ImageIcon className="w-4 h-4 text-blue-400" />
                  Movie Poster URL
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="https://example.com/poster.jpg"
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Add an image URL to make your collection visually appealing
                </p>
              </div>

              {/* Notes */}
              <div className="mb-4">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  Personal Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Share your thoughts, favorite scenes, or what you liked/disliked about the movie..."
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="text-red-400 text-sm bg-red-950/30 border border-red-900/50 rounded-lg p-3">{error}</div>
            )}
            {success && (
              <div className="text-green-400 text-sm bg-green-950/30 border border-green-900/50 rounded-lg p-3">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
              >
                {loading ? "Adding Movie..." : "Add Movie to Collection"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
