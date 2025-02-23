import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

interface User {
  id: string;
  fullName: string;
  role: string;
  email: string;
  createdAt: string;
}

export function FindTeammates() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const fetchedUsers = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as User[];
        
        setUsers(fetchedUsers);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Find Teammates</h1>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or role..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading teammates...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow-md overflow-hidden aspect-square w-64">
            <div className="p-4 h-full flex flex-col items-center">
              <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <span className="text-3xl font-semibold text-indigo-600">
                  {user.fullName.charAt(0)}
                </span>
              </div>
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{user.fullName}</h3>
                <p className="text-sm text-gray-500">{user.role}</p>
              </div>
              <button className="px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                Connect
              </button>
            </div>
          </div>
        ))}
      </div>

      {!loading && filteredUsers.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          No teammates found matching your search.
        </div>
      )}
    </div>
  );
}