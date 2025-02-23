import React from 'react';
import { Users, MessageSquare, Plus } from 'lucide-react';

interface Group {
  id: number;
  name: string;
  members: number;
  description: string;
  image: string;
  lastActive: string;
}

const DUMMY_GROUPS: Group[] = [
  {
    id: 1,
    name: "Web Development Squad",
    members: 5,
    description: "A group of passionate web developers working on innovative projects.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    lastActive: "2 hours ago"
  },
  {
    id: 2,
    name: "AI/ML Enthusiasts",
    members: 8,
    description: "Exploring the latest in artificial intelligence and machine learning.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    lastActive: "5 minutes ago"
  },
];

export function Groups() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Groups</h1>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
          <Plus className="h-5 w-5 mr-2" />
          Create Group
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DUMMY_GROUPS.map((group) => (
          <div key={group.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={group.image} alt={group.name} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{group.name}</h3>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Users className="h-4 w-4 mr-1" />
                {group.members} members
                <span className="mx-2">•</span>
                Last active {group.lastActive}
              </div>
              <p className="text-gray-600 mb-4">{group.description}</p>
              <div className="flex gap-2">
                <button className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                  <Users className="h-4 w-4 mr-2" />
                  View Group
                </button>
                <button className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}