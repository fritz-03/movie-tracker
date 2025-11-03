'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AddMovieModal from '@/components/AddMovieModal';

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

interface Movie {
  id: number;
  title: string;
  genre: string;
  rating: number;
  watchDate: string;
  createdAt: string;
}

interface Stats {
  totalMovies: number;
  averageRating: number;
  favoriteGenre: {
    name: string;
    count: number;
  } | null;
  moviesThisMonth: number;
  highestRatedMovie: Movie | null;
  genreDistribution: { genre: string; count: number }[];
}

const StatCard = ({ title, value, subtitle, icon, color = "blue" }: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  color?: string;
}) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
    red: "bg-red-50 text-red-600 border-red-200"
  };

  return (
    <div className={`${colorClasses[color as keyof typeof colorClasses]} p-6 rounded-lg border`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-body font-medium opacity-75">{title}</p>
          <p className="text-2xl font-display font-bold">{value}</p>
          {subtitle && <p className="text-sm font-body opacity-60">{subtitle}</p>}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentMovies, setRecentMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchStats(parsedUser.id);
    } else {
      router.push('/login');
    }
  }, [router]);

  const fetchStats = async (userId: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/stats?userId=${userId}`);
      const data = await response.json();

      if (response.ok) {
        setStats(data.stats);
        setRecentMovies(data.recentMovies);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-display font-semibold">Movie Tracker</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}!</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">
              🎬 Your Movie Dashboard
            </h2>
            <p className="text-gray-600 font-body">
              Welcome back! Here's an overview of your movie collection.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Total Movies"
                  value={stats?.totalMovies || 0}
                  subtitle="in your collection"
                  icon="🎬"
                  color="blue"
                />
                <StatCard
                  title="Average Rating"
                  value={stats?.averageRating ? `${stats.averageRating}/10` : "N/A"}
                  subtitle="across all movies"
                  icon="⭐"
                  color="yellow"
                />
                <StatCard
                  title="Favorite Genre"
                  value={stats?.favoriteGenre?.name || "None yet"}
                  subtitle={stats?.favoriteGenre ? `${stats.favoriteGenre.count} movies` : ""}
                  icon="🎭"
                  color="purple"
                />
                <StatCard
                  title="This Month"
                  value={stats?.moviesThisMonth || 0}
                  subtitle="movies watched"
                  icon="📅"
                  color="green"
                />
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Quick Actions Card */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="block w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-md text-center font-medium transition-colors"
                    >
                      ➕ Add New Movie
                    </button>
                    <Link
                      href="/movies"
                      className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md text-center font-medium transition-colors"
                    >
                      📚 View All Movies
                    </Link>
                  </div>
                </div>

                {/* Top Rated Movie */}
                {stats?.highestRatedMovie && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">🏆 Highest Rated Movie</h3>
                    <div className="border-l-4 border-yellow-400 pl-4">
                      <h4 className="font-medium text-gray-900">{stats.highestRatedMovie.title}</h4>
                      <p className="text-sm text-gray-600">{stats.highestRatedMovie.genre}</p>
                      <div className="flex items-center mt-2">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm font-medium ml-1">{stats.highestRatedMovie.rating}/10</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Recent Movies */}
              {recentMovies.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-display font-semibold text-gray-900">📽️ Recently Added</h3>
                    <Link href="/movies" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View all →
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {recentMovies.slice(0, 5).map((movie) => (
                      <div key={movie.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div>
                          <h4 className="font-medium text-gray-900">{movie.title}</h4>
                          <p className="text-sm text-gray-600">{movie.genre}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-yellow-500">⭐</span>
                          <span className="text-sm font-medium">{movie.rating}/10</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!loading && stats?.totalMovies === 0 && (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <div className="text-6xl mb-4">🍿</div>
                  <h3 className="text-2xl font-display font-semibold text-gray-900 mb-2">
                    Start Your Movie Journey!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Track your favorite movies and build your personal collection.
                  </p>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-lg font-medium"
                  >
                    Add Your First Movie
                  </button>
                </div>
              )}
            </>
          )}
        </div>
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
  );
}