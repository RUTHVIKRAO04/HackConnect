import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Code2, Users, Search, UserPlus, Home, LogOut, MessageCircle } from 'lucide-react';
import { auth } from '../firebase/config';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { ChatBot } from './ChatBot';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [userName, setUserName] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.displayName) {
        setUserName(user.displayName);
        console.log('User display name:', user.displayName); // Debug log
      } else {
        setUserName(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUserName(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center pl-2">
              <Link to="/" className="flex items-center">
                <Code2 className="h-8 w-8 text-indigo-600" />
                <span className="ml-3 text-xl font-bold text-gray-900">HackConnect</span>
              </Link>
            </div>
            <div className="flex items-center">
              <div className="flex items-center space-x-8 mr-12">
                <Link to="/" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900">
                  <Home className="h-4 w-4 mr-1" />
                  Home
                </Link>
                <Link to="/explore" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                  <Search className="h-4 w-4 mr-1" />
                  Explore
                </Link>
                <Link to="/find-teammates" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                  <Users className="h-4 w-4 mr-1" />
                  Find Teammates
                </Link>
                <Link to="/groups" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                  <UserPlus className="h-4 w-4 mr-1" />
                  Groups
                </Link>
              </div>
              <div className="flex-shrink-0 flex items-center gap-4">
                {userName ? (
                  <>
                    <Link 
                      to="/my-hackathons" 
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                    >
                      <Users className="h-4 w-4 mr-1" />
                      My Hackathons
                    </Link>
                    <span className="text-gray-700">Welcome, {userName}</span>
                    <button
                      onClick={handleSignOut}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>

      {/* Chat Button */}
      <button
        onClick={() => setShowChat(true)}
        className="fixed bottom-4 right-4 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 z-50"
        aria-label="Toggle chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Widget */}
      {showChat && <ChatBot onClose={() => setShowChat(false)} />}
    </div>
  );
}