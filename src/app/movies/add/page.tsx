'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const GENRES = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 
  'Documentary', 'Drama', 'Fantasy', 'Horror', 'Mystery', 
  'Romance', 'Sci-Fi', 'Thriller', 'Western'
];

interface User {
  id: number;
  name: string;
  email: string;
}

export default function AddMoviePage() {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    rating: '',
    watchDate: '',
    imageUrl: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: user.id
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Movie added successfully! 🎬');
        setFormData({
          title: '',
          genre: '',
          rating: '',
          watchDate: '',
          imageUrl: '',
          notes: ''
        });
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
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
            <div className="flex items-center">
              <Link href="/dashboard" className="text-xl font-semibold text-blue-600 hover:text-blue-800">
                ← Back to Dashboard
              </Link>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700">Welcome, {user.name}!</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🎬 Add a Movie to Your Collection
            </h1>
            <p className="text-gray-600">
              Track the movies you've watched and build your personal movie database!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Required Fields Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">📽️ Movie Details (Required)</h2>
              
              {/* Title */}
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Movie Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter the movie title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              {/* Genre */}
              <div className="mb-4">
                <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
                  Genre *
                </label>
                <select
                  id="genre"
                  name="genre"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.genre}
                  onChange={handleChange}
                >
                  <option value="">Select a genre</option>
                  {GENRES.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>

              {/* Rating */}
              <div className="mb-4">
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating (1-10) *
                </label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  min="1"
                  max="10"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Rate from 1-10"
                  value={formData.rating}
                  onChange={handleChange}
                />
              </div>

              {/* Watch Date */}
              <div className="mb-4">
                <label htmlFor="watchDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Watch Date *
                </label>
                <input
                  type="date"
                  id="watchDate"
                  name="watchDate"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.watchDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Optional Fields Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">🎭 Optional Details</h2>
              
              {/* Image URL */}
              <div className="mb-4">
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Movie Poster URL
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/poster.jpg"
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
                <p className="text-sm text-gray-500 mt-1">Add an image URL to make your collection visually appealing</p>
              </div>

              {/* Notes */}
              <div className="mb-4">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Personal Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Share your thoughts, favorite scenes, or what you liked/disliked about the movie..."
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">{error}</div>
            )}
            {success && (
              <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-md">{success}</div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Adding Movie...' : 'Add Movie to Collection 🎬'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}