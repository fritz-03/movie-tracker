"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import AddMovieModal from "@/components/AddMovieModal"
import { Film, Star, Calendar, TrendingUp, LogOut, Plus } from "lucide-react"

interface User {
  id: number
  name: string
  email: string
  createdAt: string
}

interface Movie {
  id: number
  title: string
  genre: string
  rating: number
  watchDate: string
  createdAt: string
}

interface Stats {
  totalMovies: number
  averageRating: number
  favoriteGenre: {
    name: string
    count: number
  } | null
  moviesThisMonth: number
  highestRatedMovie: Movie | null
  genreDistribution: { genre: string; count: number }[]
}

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
}: {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ElementType
  gradient: string
}) => {
  return (
    <div className="relative group">
      <div
        className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-xl"
        style={{ background: gradient }}
      />
      <div className="relative bg-[#1a1a1a] border border-gray-800 p-6 rounded-xl hover:border-gray-700 transition-all duration-300">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
            <p className="text-3xl font-bold text-white mb-1">{value}</p>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-lg bg-gradient-to-br ${gradient}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentMovies, setRecentMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      fetchStats(parsedUser.id)
    } else {
      router.push("/login")
    }
  }, [router])

  const fetchStats = async (userId: number) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/stats?userId=${userId}`)
      const data = await response.json()

      if (response.ok) {
        setStats(data.stats)
        setRecentMovies(data.recentMovies)
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[60%] bg-gradient-to-br from-blue-500/20 via-cyan-400/10 to-sky-400/10 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[60%] bg-gradient-to-tr from-blue-600/15 via-blue-500/10 to-indigo-400/10 rounded-full blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[50%] bg-gradient-to-bl from-blue-400/10 via-cyan-300/5 to-sky-300/5 rounded-full blur-[110px] animate-blob animation-delay-4000" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-gray-800 bg-[#0f0f0f]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg" />
              <h1 className="text-xl font-semibold text-white">Personal Movie Tracker</h1>
            </div>
            <div className="flex items-center gap-4">
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

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white mb-2 text-balance">
            Your Movie Dashboard<span className="text-blue-500">_</span>
          </h2>
          <p className="text-gray-400 text-lg">Track, rate, and manage your personal cinema collection</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Movies"
                value={stats?.totalMovies || 0}
                subtitle="in your collection"
                icon={Film}
                gradient="from-blue-500 to-blue-600"
              />
              <StatCard
                title="Average Rating"
                value={stats?.averageRating ? `${stats.averageRating}/10` : "N/A"}
                subtitle="across all movies"
                icon={Star}
                gradient="from-cyan-500 to-blue-500"
              />
              <StatCard
                title="Favorite Genre"
                value={stats?.favoriteGenre?.name || "None yet"}
                subtitle={stats?.favoriteGenre ? `${stats.favoriteGenre.count} movies` : "Start adding movies"}
                icon={TrendingUp}
                gradient="from-blue-600 to-indigo-600"
              />
              <StatCard
                title="This Month"
                value={stats?.moviesThisMonth || 0}
                subtitle="movies watched"
                icon={Calendar}
                gradient="from-sky-500 to-blue-500"
              />
            </div>

            {/* Quick Actions & Top Rated */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Quick Actions Card */}
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-blue-500/20"
                  >
                    <Plus className="w-5 h-5" />
                    Add New Movie
                  </button>
                  <Link
                    href="/movies"
                    className="flex items-center justify-center gap-2 w-full bg-[#0f0f0f] hover:bg-[#252525] border border-gray-800 hover:border-gray-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200"
                  >
                    <Film className="w-5 h-5" />
                    View All Movies
                  </Link>
                </div>
              </div>

              {/* Top Rated Movie */}
              {stats?.highestRatedMovie ? (
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Highest Rated Movie
                  </h3>
                  <div className="border-l-4 border-blue-500 pl-4 bg-[#0f0f0f] p-4 rounded-r-lg">
                    <h4 className="font-semibold text-white text-lg">{stats.highestRatedMovie.title}</h4>
                    <p className="text-gray-400 text-sm mt-1">{stats.highestRatedMovie.genre}</p>
                    <div className="flex items-center mt-3 gap-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="text-white font-semibold">{stats.highestRatedMovie.rating}/10</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 flex items-center justify-center">
                  <div className="text-center">
                    <Star className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No movies rated yet</p>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Movies */}
            {recentMovies.length > 0 ? (
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Film className="w-5 h-5 text-blue-500" />
                    Recently Added
                  </h3>
                  <Link
                    href="/movies"
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    View all →
                  </Link>
                </div>
                <div className="space-y-3">
                  {recentMovies.slice(0, 5).map((movie) => (
                    <div
                      key={movie.id}
                      className="flex items-center justify-between p-4 bg-[#0f0f0f] border border-gray-800 rounded-lg hover:border-gray-700 transition-all"
                    >
                      <div>
                        <h4 className="font-medium text-white">{movie.title}</h4>
                        <p className="text-sm text-gray-400">{movie.genre}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-white font-medium">{movie.rating}/10</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-16 bg-[#1a1a1a] border border-gray-800 rounded-xl">
                <div className="text-6xl mb-4">🎬</div>
                <h3 className="text-2xl font-bold text-white mb-2">Start Your Movie Journey!</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Track your favorite movies and build your personal collection.
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition-all duration-200 shadow-lg shadow-blue-500/20"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Movie
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Add Movie Modal */}
      {user && (
        <AddMovieModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onMovieAdded={() => fetchStats(user.id)}
          userId={user.id}
        />
      )}
    </div>
  )
}
