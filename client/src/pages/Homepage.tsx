import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import API_BASE_URL from '../config/api';

interface SchoolContent {
  _id: string;
  section: string;
  title: string;
  content: string;
  images?: string[];
  publishedAt: string;
}

const Homepage: React.FC = () => {
  const { user } = useAuth();
  const [content, setContent] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState<any>({});

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async (retryCount = 0) => {
    if (retryCount > 0) {
      setRetrying(true);
    }
    
    try {
      const response = await axios.get(`${API_BASE_URL}/school-content`);
      setContent(response.data);
      setEditContent(response.data);
    } catch (error: any) {
      console.error('Error fetching content:', error);
      
      // If it's a network error or 503 (service unavailable), retry up to 3 times
      if (retryCount < 3 && (error.code === 'NETWORK_ERROR' || error.response?.status === 503)) {
        console.log(`Retrying content fetch... Attempt ${retryCount + 1}/3`);
        setTimeout(() => {
          fetchContent(retryCount + 1);
        }, (retryCount + 1) * 2000); // Exponential backoff: 2s, 4s, 6s
        return;
      }
      
      // If all retries failed, set default content
      setContent({
        schoolName: 'Shambil Pride Academy Birnin Gwari',
        motto: 'Excellence in Education, Character Building, and Academic Achievement',
        about: 'Welcome to Shambil Pride Academy Birnin Gwari. We are committed to providing quality education and nurturing young minds for a brighter future.',
        history: 'Our school has been serving the community with dedication and excellence.',
        aims: 'To provide comprehensive education that develops both academic excellence and moral character.',
        gallery: []
      });
      setEditContent({
        schoolName: 'Shambil Pride Academy Birnin Gwari',
        motto: 'Excellence in Education, Character Building, and Academic Achievement',
        about: 'Welcome to Shambil Pride Academy Birnin Gwari. We are committed to providing quality education and nurturing young minds for a brighter future.',
        history: 'Our school has been serving the community with dedication and excellence.',
        aims: 'To provide comprehensive education that develops both academic excellence and moral character.',
        gallery: []
      });
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  const handleSaveContent = async () => {
    try {
      await axios.put(`${API_BASE_URL}/school-content`, editContent);
      setContent(editContent);
      setIsEditing(false);
      
      // Show success message
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successDiv.textContent = '✅ Homepage content updated successfully!';
      document.body.appendChild(successDiv);
      
      setTimeout(() => {
        document.body.removeChild(successDiv);
      }, 3000);
    } catch (error) {
      console.error('Error updating content:', error);
      
      // Show error message
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      errorDiv.textContent = '❌ Failed to update content. Please try again.';
      document.body.appendChild(errorDiv);
      
      setTimeout(() => {
        document.body.removeChild(errorDiv);
      }, 3000);
    }
  };

  const handleEditChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [section, property] = field.split('.');
      setEditContent(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [property]: value
        }
      }));
    } else {
      setEditContent(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const getContentBySection = (section: string) => {
    return content[section] || {
      title: `${section.charAt(0).toUpperCase() + section.slice(1).replace('_', ' & ')}`,
      content: 'Content will be available soon.'
    };
  };

  const sections = [
    { id: 'about', name: 'About Us', icon: '🏫' },
    { id: 'history', name: 'Our History', icon: '📚' },
    { id: 'aims_objectives', name: 'Aims & Objectives', icon: '🎯' },
    { id: 'gallery', name: 'Gallery', icon: '📸' },
    { id: 'news', name: 'News & Events', icon: '📰' },
    { id: 'achievements', name: 'Achievements', icon: '🏆' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Shambil Pride Academy</h2>
          <p className="text-gray-600">Please wait while we prepare the content for you...</p>
          <div className="mt-4 text-sm text-gray-500">
            <p>If this takes longer than expected, our server might be starting up.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white relative">
        {/* Admin Edit Button */}
        {user && (user.role === 'admin' || user.role === 'director' || user.role === 'principal') && (
          <div className="absolute top-4 right-4 z-20">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-colors"
              >
                ✏️ Edit Homepage
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveContent}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  💾 Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  ❌ Cancel
                </button>
              </div>
            )}
          </div>
        )}

        {/* Login Button for Non-authenticated Users */}
        {!user && (
          <div className="absolute top-4 right-4 z-20">
            <Link
              to="/login"
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
            >
              <span>🔐</span>
              <span>Login</span>
            </Link>
          </div>
        )}

        {/* Dashboard Link for Authenticated Users */}
        {user && (
          <div className="absolute top-4 left-4 z-20">
            <Link
              to="/dashboard"
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
            >
              <span>📊</span>
              <span>Dashboard</span>
            </Link>
          </div>
        )}

        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editContent.schoolName || 'Shambil Pride Academy Birnin Gwari'}
                  onChange={(e) => handleEditChange('schoolName', e.target.value)}
                  className="text-5xl font-bold mb-4 bg-transparent border-b-2 border-white text-center text-white placeholder-gray-200 w-full"
                  placeholder="School Name"
                />
                <textarea
                  value={editContent.motto || 'Excellence in Education, Character Building, and Academic Achievement'}
                  onChange={(e) => handleEditChange('motto', e.target.value)}
                  className="text-xl mb-8 bg-transparent border-b-2 border-white text-center text-white placeholder-gray-200 w-full resize-none"
                  placeholder="School Motto"
                  rows={2}
                />
              </div>
            ) : (
              <>
                <h1 className="text-5xl font-bold mb-4">
                  {content.schoolName || 'Shambil Pride Academy Birnin Gwari'}
                </h1>
                <p className="text-xl mb-8">
                  {content.motto || 'Excellence in Education, Character Building, and Academic Achievement'}
                </p>
              </>
            )}
            
            <div className="flex justify-center space-x-4 flex-wrap gap-4">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                📚 Admissions Open
              </button>
              <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                🏫 Virtual Tour
              </button>
              {!user && (
                <Link
                  to="/login"
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  🔐 Portal
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeSection === section.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-primary-600'
                }`}
              >
                <span className="text-lg">{section.icon}</span>
                <span className="font-medium">{section.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {isEditing ? (
              <div className="space-y-6">
                <input
                  type="text"
                  value={editContent[activeSection]?.title || getContentBySection(activeSection).title}
                  onChange={(e) => handleEditChange(`${activeSection}.title`, e.target.value)}
                  className="text-2xl font-bold text-gray-800 w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none"
                  placeholder="Section Title"
                />
                <textarea
                  value={editContent[activeSection]?.content || getContentBySection(activeSection).content}
                  onChange={(e) => handleEditChange(`${activeSection}.content`, e.target.value)}
                  className="w-full h-64 p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none resize-none"
                  placeholder="Section Content"
                />
              </div>
            ) : (
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  {getContentBySection(activeSection).title}
                </h2>
                <div className="prose max-w-none text-gray-600 leading-relaxed">
                  <div className="whitespace-pre-wrap">
                    {getContentBySection(activeSection).content}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">📞</div>
              <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editContent.phone || '+2348079387958, +2348034012480'}
                    onChange={(e) => handleEditChange('phone', e.target.value)}
                    className="bg-gray-700 text-white px-3 py-1 rounded w-full text-center"
                    placeholder="Phone Numbers"
                  />
                  <input
                    type="email"
                    value={editContent.email || 'shehubala70@gmail.com'}
                    onChange={(e) => handleEditChange('email', e.target.value)}
                    className="bg-gray-700 text-white px-3 py-1 rounded w-full text-center"
                    placeholder="Email Address"
                  />
                </div>
              ) : (
                <p className="text-gray-300">
                  Phone: {content.phone || '+2348079387958, +2348034012480'}<br />
                  Email: {content.email || 'shehubala70@gmail.com'}
                </p>
              )}
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-lg font-semibold mb-2">Visit Us</h3>
              {isEditing ? (
                <textarea
                  value={editContent.address || 'Birnin Gwari\nKaduna State, Nigeria'}
                  onChange={(e) => handleEditChange('address', e.target.value)}
                  className="bg-gray-700 text-white px-3 py-1 rounded w-full text-center resize-none"
                  rows={2}
                  placeholder="School Address"
                />
              ) : (
                <p className="text-gray-300 whitespace-pre-line">
                  {content.address || 'Birnin Gwari\nKaduna State, Nigeria'}
                </p>
              )}
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🕒</div>
              <h3 className="text-lg font-semibold mb-2">School Hours</h3>
              {isEditing ? (
                <textarea
                  value={editContent.hours || 'Monday - Friday: 7:30 AM - 3:00 PM\nSaturday: 8:00 AM - 12:00 PM'}
                  onChange={(e) => handleEditChange('hours', e.target.value)}
                  className="bg-gray-700 text-white px-3 py-1 rounded w-full text-center resize-none"
                  rows={2}
                  placeholder="School Hours"
                />
              ) : (
                <p className="text-gray-300 whitespace-pre-line">
                  {content.hours || 'Monday - Friday: 7:30 AM - 3:00 PM\nSaturday: 8:00 AM - 12:00 PM'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Shambil Pride Academy Birnin Gwari. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;