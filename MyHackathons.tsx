import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

interface Registration {
  id: string;
  hackathonId: string;
  hackathonTitle: string;
  registeredAt: any;
  status: string;
  teamDetails: {
    teamName: string;
    leader: {
      name: string;
      email: string;
      contact: string;
    };
    members: Array<{
      name: string;
      email: string;
    }>;
  };
}

export function MyHackathons() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!auth.currentUser) return;

      try {
        const q = query(
          collection(db, 'registrations'),
          where('userId', '==', auth.currentUser.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const regs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Registration[];
        
        setRegistrations(regs);
      } catch (error) {
        console.error('Error fetching registrations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Hackathons</h1>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your hackathons...</p>
        </div>
      ) : registrations.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {registrations.map((reg) => (
            <div key={reg.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{reg.hackathonTitle}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Registered on: {new Date(reg.registeredAt?.toDate()).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    reg.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    reg.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">Team: {reg.teamDetails.teamName}</h3>
                  
                  <div className="mt-4 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Team Leader</h4>
                      <p className="text-sm text-gray-600">{reg.teamDetails.leader.name}</p>
                      <p className="text-sm text-gray-500">{reg.teamDetails.leader.email}</p>
                      <p className="text-sm text-gray-500">{reg.teamDetails.leader.contact}</p>
                    </div>

                    {reg.teamDetails.members.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Team Members</h4>
                        <div className="mt-2 space-y-2">
                          {reg.teamDetails.members.map((member, index) => (
                            <div key={index} className="text-sm">
                              <p className="text-gray-600">{member.name}</p>
                              <p className="text-gray-500">{member.email}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600">You haven't registered for any hackathons yet.</p>
          <a 
            href="/explore" 
            className="mt-4 inline-block px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Explore Hackathons
          </a>
        </div>
      )}
    </div>
  );
} 