"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import AddMovieModal from "@/components/AddMovieModal"
import { Film, LogOut, Plus, Trash2 } from "lucide-react"

interface User {
  id: number
  name: string
  email: string
}

interface Movie {
  id: number
  title: string
  genre: string
  rating: number
  watchDate: string
  imageUrl: string | null
  notes: string | null
  createdAt: string
}

const MovieCard = ({ movie, onDelete }: { movie: Movie; onDelete: (id: number) => void }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const stars = "★".repeat(fullStars) + "☆".repeat(10 - fullStars)
    return stars
  }

  const getGenreColor = (genre: string) => {
    const colors: { [key: string]: string } = {
      Action: "bg-red-500/20 text-red-300 border-red-500/30",
      Adventure: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      Animation: "bg-pink-500/20 text-pink-300 border-pink-500/30",
      Comedy: "bg-green-500/20 text-green-300 border-green-500/30",
      Crime: "bg-gray-500/20 text-gray-300 border-gray-500/30",
      Documentary: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      Drama: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      Fantasy: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      Horror: "bg-red-600/20 text-red-400 border-red-600/30",
      Mystery: "bg-gray-600/20 text-gray-400 border-gray-600/30",
      Romance: "bg-pink-600/20 text-pink-400 border-pink-600/30",
      "Sci-Fi": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
      Thriller: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
      Western: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    }
    return colors[genre] || "bg-gray-500/20 text-gray-300 border-gray-500/30"
  }

  return (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 group">
      {/* Movie Poster */}
      <div className="h-64 bg-[#0f0f0f] flex items-center justify-center relative overflow-hidden">
        {movie.imageUrl ? (
          <img
            src={movie.imageUrl || "/placeholder.svg"}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = "none"
              target.parentElement!.innerHTML =
                '<div class="text-gray-600 text-5xl"><svg class="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path></svg></div>'
            }}
          />
        ) : (
          <Film className="w-16 h-16 text-gray-600" />
        )}
      </div>

      {/* Movie Info */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
          {movie.title}
        </h3>

        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getGenreColor(movie.genre)}`}>
            {movie.genre}
          </span>
          <div className="text-yellow-400 text-sm" title={`${movie.rating}/10`}>
            {getRatingStars(movie.rating)}
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-400 mb-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-500">Rating:</span>
            <span className="text-white font-semibold">{movie.rating}/10</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-500">Watched:</span>
            <span className="text-gray-300">{formatDate(movie.watchDate)}</span>
          </div>
        </div>

        {movie.notes && (
          <div className="mt-3 pt-3 border-t border-gray-800">
            <p className="text-sm text-gray-400 line-clamp-3">{movie.notes}</p>
          </div>
        )}

        {/* Delete Button */}
        <div className="mt-4 pt-3 border-t border-gray-800">
          <button
            onClick={() => onDelete(movie.id)}
            className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Movie
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MoviesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; movie: Movie | null }>({
    isOpen: false,
    movie: null,
  })
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      fetchMovies(parsedUser.id)
    } else {
      router.push("/login")
    }
  }, [router])

  const fetchMovies = async (userId: number) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/movies?userId=${userId}`)
      const data = await response.json()

      if (response.ok) {
        setMovies(data.movies)
      } else {
        setError(data.error || "Failed to fetch movies")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMovie = (movie: Movie) => {
    setDeleteConfirm({ isOpen: true, movie })
  }

  const confirmDelete = async () => {
    if (!deleteConfirm.movie || !user) return

    try {
      const response = await fetch(`/api/movies/${deleteConfirm.movie.id}?userId=${user.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setMovies(movies.filter((movie) => movie.id !== deleteConfirm.movie!.id))
        setDeleteConfirm({ isOpen: false, movie: null })
      } else {
        const data = await response.json()
        setError(data.error || "Failed to delete movie")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    }
  }

  const cancelDelete = () => {
    setDeleteConfirm({ isOpen: false, movie: null })
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
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
              
              <Link href="/dashboard" className="text-xl font-semibold text-white hover:text-blue-300 transition-colors">
                Personal Movie Tracker
              </Link>
            </div>

            <div className="flex items-center gap-4">
            <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg shadow-blue-500/20"
              >
                <Plus className="w-4 h-4" />
                Add Movie
              </button>
              <span className="text-gray-300">
                Welcome, <span className="text-white font-medium">{user.name}</span>
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600/10 hover:bg-red-600/20 border border-red-600/30 text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Film className="w-10 h-10 text-blue-400" />
            Your Movie Collection
          </h1>
          <p className="text-gray-400">
            {loading
              ? "Loading your movies..."
              : `You have watched ${movies.length} movie${movies.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading your movies...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-400 text-lg mb-4 bg-red-950/30 border border-red-900/50 rounded-lg p-4 inline-block">
              {error}
            </div>
            <button
              onClick={() => fetchMovies(user.id)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-blue-500/20"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && movies.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-12 max-w-md mx-auto">
              <Film className="w-20 h-20 text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-white mb-2">No movies yet!</h2>
              <p className="text-gray-400 mb-6">Start building your movie collection by adding your first movie.</p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition-all duration-200 shadow-lg shadow-blue-500/20 flex items-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                Add Your First Movie
              </button>
            </div>
          </div>
        )}

        {/* Movies Grid */}
        {!loading && !error && movies.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onDelete={() => handleDeleteMovie(movie)} />
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && deleteConfirm.movie && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl shadow-2xl max-w-md w-full">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600" />

            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="text-red-500 text-3xl mr-3">⚠️</div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Delete Movie</h3>
                  <p className="text-sm text-gray-400">This action cannot be undone.</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-300">
                  Are you sure you want to delete <strong className="text-white">"{deleteConfirm.movie.title}"</strong>?
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-3 bg-[#0f0f0f] hover:bg-[#252525] border border-gray-800 hover:border-gray-700 text-white rounded-lg font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg shadow-red-500/20"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Movie Modal */}
      {user && (
        <AddMovieModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onMovieAdded={() => fetchMovies(user.id)}
          userId={user.id}
        />
      )}
    </div>
  )
}
