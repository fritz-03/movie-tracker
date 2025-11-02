'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AddMovieModal from '@/components/AddMovieModal';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Movie {
  id: number;
  title: string;
  genre: string;
  rating: number;
  watchDate: string;
  imageUrl: string | null;
  notes: string | null;
  createdAt: string;
}

const MovieCard = ({ movie, onDelete }: { movie: Movie; onDelete: (id: number) => void }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRatingStars = (rating: number) => {
    const stars = '★'.repeat(rating) + '☆'.repeat(10 - rating);
    return stars;
  };

  const getGenreColor = (genre: string) => {
    const colors: { [key: string]: string } = {
      'Action': 'bg-red-100 text-red-800',
      'Adventure': 'bg-yellow-100 text-yellow-800',
      'Animation': 'bg-pink-100 text-pink-800',
      'Comedy': 'bg-green-100 text-green-800',
      'Crime': 'bg-gray-100 text-gray-800',
      'Documentary': 'bg-blue-100 text-blue-800',
      'Drama': 'bg-purple-100 text-purple-800',
      'Fantasy': 'bg-indigo-100 text-indigo-800',
      'Horror': 'bg-red-100 text-red-900',
      'Mystery': 'bg-gray-100 text-gray-900',
      'Romance': 'bg-pink-100 text-pink-900',
      'Sci-Fi': 'bg-blue-100 text-blue-900',
      'Thriller': 'bg-yellow-100 text-yellow-900',
      'Western': 'bg-yellow-100 text-yellow-800'
    };
    return colors[genre] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Movie Poster */}
      <div className="h-64 bg-gray-200 flex items-center justify-center">
        {movie.imageUrl ? (
          <img
            src={movie.imageUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.innerHTML = '<div class="text-gray-500 text-4xl">🎬</div>';
            }}
          />
        ) : (
          <div className="text-gray-500 text-4xl">🎬</div>
        )}
      </div>

      {/* Movie Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {movie.title}
        </h3>

        <div className="flex items-center justify-between mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGenreColor(movie.genre)}`}>
            {movie.genre}
          </span>
          <div className="text-yellow-500 text-sm" title={`${movie.rating}/10`}>
            {getRatingStars(movie.rating)}
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <span className="font-medium">Rating:</span>
            <span className="ml-2">{movie.rating}/10</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium">Watched:</span>
            <span className="ml-2">{formatDate(movie.watchDate)}</span>
          </div>
        </div>

        {movie.notes && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-700 line-clamp-3">
              {movie.notes}
            </p>
          </div>
        )}

        {/* Delete Button */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <button
            onClick={() => onDelete(movie.id)}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            🗑️ Delete Movie
          </button>
        </div>
      </div>
    </div>
  );
};

export default function MoviesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; movie: Movie | null }>({
    isOpen: false,
    movie: null
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchMovies(parsedUser.id);
    } else {
      router.push('/login');
    }
  }, [router]);

  const fetchMovies = async (userId: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/movies?userId=${userId}`);
      const data = await response.json();

      if (response.ok) {
        setMovies(data.movies);
      } else {
        setError(data.error || 'Failed to fetch movies');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMovie = (movie: Movie) => {
    setDeleteConfirm({ isOpen: true, movie });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.movie || !user) return;

    try {
      const response = await fetch(`/api/movies/${deleteConfirm.movie.id}?userId=${user.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove movie from local state
        setMovies(movies.filter(movie => movie.id !== deleteConfirm.movie!.id));
        setDeleteConfirm({ isOpen: false, movie: null });
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete movie');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ isOpen: false, movie: null });
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
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-xl font-semibold text-blue-600 hover:text-blue-800">
                Movie Tracker
              </Link>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Add Movie
              </button>
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

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎬 Your Movie Collection
          </h1>
          <p className="text-gray-600">
            {loading ? 'Loading your movies...' : `You have watched ${movies.length} movie${movies.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your movies...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-600 text-lg mb-4">❌ {error}</div>
            <button
              onClick={() => fetchMovies(user.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && movies.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍿</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No movies yet!
            </h2>
            <p className="text-gray-600 mb-6">
              Start building your movie collection by adding your first movie.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-lg font-medium"
            >
              Add Your First Movie
            </button>
          </div>
        )}

        {/* Movies Grid */}
        {!loading && !error && movies.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                onDelete={() => handleDeleteMovie(movie)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && deleteConfirm.movie && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="text-red-600 text-3xl mr-3">⚠️</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Movie</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone.</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700">
                  Are you sure you want to delete <strong>"{deleteConfirm.movie.title}"</strong>?
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
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
  );
}