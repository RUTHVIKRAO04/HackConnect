import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { auth } from '../firebase/config';

interface Hackathon {
  id: string;
  title: string;
  organizerName: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  location: string;
  mode: 'in-person' | 'virtual' | 'hybrid';
  price: string;
  maxParticipants: string;
  shortDescription: string;
  longDescription: string;
  rules: string;
  prizes: string;
  createdBy: string;
  createdAt: any;
  status: 'active' | 'completed' | 'cancelled';
  registeredTeams: number;
  image: string;
}

export function Explore() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showHostForm, setShowHostForm] = useState(false);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    organizerName: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    location: '',
    mode: 'in-person',
    price: '',
    maxParticipants: '',
    shortDescription: '',
    longDescription: '',
    rules: '',
    prizes: ''
  });
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    teamName: '',
    leaderName: '',
    leaderEmail: '',
    leaderContact: '',
    member2Name: '',
    member2Email: '',
    member3Name: '',
    member3Email: '',
    member4Name: '',
    member4Email: '',
  });
  const [teamSize, setTeamSize] = useState<number>(1);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'hackathons'));
        const fetchedHackathons = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Hackathon[];
        
        setHackathons(fetchedHackathons);
      } catch (error) {
        console.error('Error fetching hackathons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHackathons();
  }, []);

  // Filter hackathons based on search term
  const filteredHackathons = hackathons.filter(hackathon => 
    hackathon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hackathon.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hackathon.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auth.currentUser) {
      alert('Please sign in to host a hackathon');
      return;
    }

    try {
      // Validate required fields
      if (!formData.title || !formData.organizerName || !formData.startDate || 
          !formData.endDate || !formData.registrationDeadline || !formData.location) {
        alert('Please fill in all required fields');
        return;
      }

      // Create hackathon object
      const hackathonData = {
        title: formData.title.trim(),
        organizerName: formData.organizerName.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        registrationDeadline: formData.registrationDeadline,
        location: formData.location.trim(),
        mode: formData.mode,
        price: formData.price || '0',
        maxParticipants: formData.maxParticipants || '4',
        shortDescription: formData.shortDescription.trim(),
        longDescription: formData.longDescription.trim(),
        rules: formData.rules.trim(),
        prizes: formData.prizes.trim(),
        createdBy: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        status: 'active',
        registeredTeams: 0,
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      };

      // Save to Firestore
      await addDoc(collection(db, 'hackathons'), hackathonData);

      // Reset form
      setFormData({
        title: '',
        organizerName: '',
        startDate: '',
        endDate: '',
        registrationDeadline: '',
        location: '',
        mode: 'in-person',
        price: '',
        maxParticipants: '',
        shortDescription: '',
        longDescription: '',
        rules: '',
        prizes: ''
      });

      // Close modal and show success message
      setShowHostForm(false);
      alert('Hackathon created successfully!');

      // Refresh hackathons list
      const querySnapshot = await getDocs(collection(db, 'hackathons'));
      const fetchedHackathons = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Hackathon[];
      setHackathons(fetchedHackathons);

    } catch (error: any) {
      console.error('Error creating hackathon:', error);
      alert(`Failed to create hackathon: ${error.message}`);
    }
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auth.currentUser) {
      alert('Please sign in to register');
      return;
    }

    // Validate required fields
    if (!registrationData.teamName || !registrationData.leaderName || 
        !registrationData.leaderEmail || !registrationData.leaderContact) {
      alert('Please fill in all required team leader information');
      return;
    }

    try {
      // Save registration to Firebase
      await addDoc(collection(db, 'registrations'), {
        hackathonId: selectedHackathon?.id,
        hackathonTitle: selectedHackathon?.title,
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName,
        registeredAt: serverTimestamp(),
        status: 'pending',
        teamDetails: {
          teamName: registrationData.teamName,
          leader: {
            name: registrationData.leaderName,
            email: registrationData.leaderEmail,
            contact: registrationData.leaderContact
          },
          members: [
            registrationData.member2Name && {
              name: registrationData.member2Name,
              email: registrationData.member2Email
            },
            registrationData.member3Name && {
              name: registrationData.member3Name,
              email: registrationData.member3Email
            },
            registrationData.member4Name && {
              name: registrationData.member4Name,
              email: registrationData.member4Email
            }
          ].filter(Boolean) // Remove empty members
        }
      });

      // Reset form
      setRegistrationData({
        teamName: '',
        leaderName: '',
        leaderEmail: '',
        leaderContact: '',
        member2Name: '',
        member2Email: '',
        member3Name: '',
        member3Email: '',
        member4Name: '',
        member4Email: '',
      });

      // Close modals and show success message
      setShowRegistrationForm(false);
      setSelectedHackathon(null);
      alert('Registration successful! You can view your registrations in My Hackathons.');

    } catch (error: any) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Explore Hackathons</h1>
        <button 
          onClick={() => setShowHostForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Host a Hackathon
        </button>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search hackathons..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          <Filter className="h-5 w-5 mr-2" />
          Filters
        </button>
      </div>

      {/* Host Hackathon Form Modal */}
      {showHostForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Host a Hackathon</h2>
              <button onClick={() => setShowHostForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hackathon Name</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Organizer Name</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                    value={formData.organizerName}
                    onChange={(e) => setFormData({...formData, organizerName: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Registration Deadline</label>
                  <input
                    type="date"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                    value={formData.registrationDeadline}
                    onChange={(e) => setFormData({...formData, registrationDeadline: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Mode</label>
                  <select
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                    value={formData.mode}
                    onChange={(e) => setFormData({...formData, mode: e.target.value as 'in-person' | 'virtual' | 'hybrid'})}
                  >
                    <option value="in-person">In Person</option>
                    <option value="virtual">Virtual</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Registration Fee (Rs)</label>
                  <input
                    type="number"
                    min="0"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Team Size</label>
                  <input
                    type="number"
                    min="1"
                    max="4"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({...formData, maxParticipants: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Short Description</label>
                <input
                  type="text"
                  required
                  maxLength={150}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Detailed Description</label>
                <textarea
                  required
                  rows={4}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.longDescription}
                  onChange={(e) => setFormData({...formData, longDescription: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Rules & Guidelines</label>
                <textarea
                  required
                  rows={4}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.rules}
                  onChange={(e) => setFormData({...formData, rules: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Prizes</label>
                <textarea
                  required
                  rows={4}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.prizes}
                  onChange={(e) => setFormData({...formData, prizes: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowHostForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Create Hackathon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading hackathons...</p>
        </div>
      ) : filteredHackathons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHackathons.map((hackathon) => (
            <div key={hackathon.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={hackathon.image} alt={hackathon.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{hackathon.title}</h3>
                <p className="text-gray-500 text-sm mb-4">
                  {hackathon.location} • {new Date(hackathon.startDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600 mb-4 line-clamp-2">{hackathon.shortDescription}</p>
                <button 
                  onClick={() => setSelectedHackathon(hackathon)}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">No hackathons found. {searchTerm ? 'Try a different search term.' : 'Be the first to host one!'}</p>
        </div>
      )}

      {/* Detailed View Modal */}
      {selectedHackathon && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{selectedHackathon.title}</h2>
              <button 
                onClick={() => setSelectedHackathon(null)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              <img 
                src={selectedHackathon.image} 
                alt={selectedHackathon.title} 
                className="w-full h-64 object-cover rounded-lg"
              />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold">Organizer</p>
                  <p>{selectedHackathon.organizerName}</p>
                </div>
                <div>
                  <p className="font-semibold">Location</p>
                  <p>{selectedHackathon.location}</p>
                </div>
                <div>
                  <p className="font-semibold">Mode</p>
                  <p className="capitalize">{selectedHackathon.mode}</p>
                </div>
                <div>
                  <p className="font-semibold">Team Size</p>
                  <p>Up to {selectedHackathon.maxParticipants} members</p>
                </div>
                <div>
                  <p className="font-semibold">Registration Fee</p>
                  <p>{selectedHackathon.price === '0' ? 'Free' : `₹${selectedHackathon.price}`}</p>
                </div>
                <div>
                  <p className="font-semibold">Registration Deadline</p>
                  <p>{new Date(selectedHackathon.registrationDeadline).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">About the Hackathon</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{selectedHackathon.longDescription}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Rules & Guidelines</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{selectedHackathon.rules}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Prizes</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{selectedHackathon.prizes}</p>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setSelectedHackathon(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowRegistrationForm(true);
                    setSelectedHackathon(selectedHackathon);
                  }}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Register Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Form Modal */}
      {showRegistrationForm && selectedHackathon && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Register for {selectedHackathon.title}</h2>
              <button 
                onClick={() => setShowRegistrationForm(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Team Size Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Team Size
              </label>
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setTeamSize(size)}
                    className={`py-2 px-4 rounded-md text-sm font-medium ${
                      teamSize === size
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {size} {size === 1 ? 'Member' : 'Members'}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleRegistration} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Team Name</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    value={registrationData.teamName}
                    onChange={(e) => setRegistrationData({...registrationData, teamName: e.target.value})}
                  />
                </div>

                {/* Team Leader Info */}
                <div className="col-span-2">
                  <h3 className="text-lg font-medium text-gray-900">Team Leader</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    value={registrationData.leaderName}
                    onChange={(e) => setRegistrationData({...registrationData, leaderName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    value={registrationData.leaderEmail}
                    onChange={(e) => setRegistrationData({...registrationData, leaderEmail: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                  <input
                    type="tel"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    value={registrationData.leaderContact}
                    onChange={(e) => setRegistrationData({...registrationData, leaderContact: e.target.value})}
                  />
                </div>

                {/* Other Members - Only show based on team size */}
                {Array.from({ length: teamSize - 1 }, (_, i) => i + 2).map((memberNum) => (
                  <React.Fragment key={memberNum}>
                    <div className="col-span-2">
                      <h3 className="text-lg font-medium text-gray-900">Team Member {memberNum}</h3>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        value={registrationData[`member${memberNum}Name` as keyof typeof registrationData]}
                        onChange={(e) => setRegistrationData({
                          ...registrationData,
                          [`member${memberNum}Name`]: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        value={registrationData[`member${memberNum}Email` as keyof typeof registrationData]}
                        onChange={(e) => setRegistrationData({
                          ...registrationData,
                          [`member${memberNum}Email`]: e.target.value
                        })}
                      />
                    </div>
                  </React.Fragment>
                ))}
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowRegistrationForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Register Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}