"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"

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

interface AddMovieModalProps {
  isOpen: boolean
  onClose: () => void
  onMovieAdded: () => void
  userId: number
}

export default function AddMovieModal({ isOpen, onClose, onMovieAdded, userId }: AddMovieModalProps) {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId,
          rating: Number.parseFloat(formData.rating),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setFormData({ title: "", genre: "", rating: "", watchDate: "", imageUrl: "", notes: "" })
        onMovieAdded()
        onClose()
      } else {
        setError(data.error || "Failed to add movie")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({ title: "", genre: "", rating: "", watchDate: "", imageUrl: "", notes: "" })
    setError("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal - Increased max-width for more content */}
      <div className="relative bg-[#1a1a1a] border border-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600" />

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">Add New Movie</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-800 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="border-b border-gray-800 pb-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Movie Details (Required)</h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                  Movie Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter movie title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="genre" className="block text-sm font-medium text-gray-300 mb-2">
                    Genre
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

                <div>
                  <label htmlFor="rating" className="block text-sm font-medium text-gray-300 mb-2">
                    Your Rating (1-10)
                  </label>
                  <input
                    id="rating"
                    name="rating"
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    required
                    className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="8.5"
                    value={formData.rating}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="watchDate" className="block text-sm font-medium text-gray-300 mb-2">
                  Watch Date
                </label>
                <input
                  id="watchDate"
                  name="watchDate"
                  type="date"
                  required
                  className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={formData.watchDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Optional Details</h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-300 mb-2">
                  Movie Poster URL
                </label>
                <input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="https://example.com/poster.jpg"
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
                  Personal Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Share your thoughts about the movie..."
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-950/30 border border-red-900/50 rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-[#0f0f0f] hover:bg-[#252525] border border-gray-800 hover:border-gray-700 text-white rounded-lg font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
            >
              {loading ? "Adding..." : "Add Movie"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
