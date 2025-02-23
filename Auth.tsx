import React, { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { auth } from '../firebase/config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile 
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'frontend-developer'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        
        await updateProfile(userCredential.user, {
          displayName: formData.name,
          photoURL: `role:${formData.role}`
        });

        // Save additional user data to Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          fullName: formData.name,
          email: formData.email,
          role: formData.role,
          createdAt: new Date().toISOString()
        });
        
        setSuccess('Registration successful! Redirecting...');
        setTimeout(() => navigate('/'), 2000);
      } else {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'An error occurred during authentication.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-100">
      <form className="bg-white p-8 max-w-sm rounded-lg shadow-md w-full mx-4" onSubmit={handleSubmit}>
        <p className="text-xl font-semibold text-center text-black mb-6">
          {isSignUp ? "Sign up for an account" : "Sign in to your account"}
        </p>
        
        <div className="relative mt-4">
          <input
            type="email"
            placeholder="Enter email"
            className="w-full p-3 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
            <Mail className="w-5 h-5" />
          </span>
        </div>
        
        {isSignUp && (
          <>
            <div className="relative mt-4">
              <input
                type="text"
                placeholder="Enter full name"
                className="w-full p-3 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                <User className="w-5 h-5" />
              </span>
            </div>

            <div className="mt-4">
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-300 text-gray-700"
                required
              >
                <option value="frontend-developer">Frontend Developer</option>
                <option value="backend-developer">Backend Developer</option>
                <option value="full-stack-developer">Full Stack Developer</option>
                <option value="java-developer">Java Developer</option>
                <option value="kotlin-developer">Kotlin Developer</option>
                <option value="python-developer">Python Developer</option>
                <option value="designer">Designer</option>
                <option value="other">Other</option>
              </select>
            </div>
          </>
        )}
        
        <div className="relative mt-4">
          <input
            type="password"
            placeholder="Enter password"
            className="w-full p-3 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
            <Lock className="w-5 h-5" />
          </span>
        </div>

        <button
          type="submit"
          className="w-full mt-6 p-3 bg-indigo-600 text-white rounded-md text-sm font-medium uppercase hover:bg-indigo-700 transition"
        >
          {isSignUp ? "Sign up" : "Sign in"}
        </button>
        
        <p className="text-gray-500 text-sm text-center mt-4">
          {isSignUp ? "Already have an account?" : "No account?"}{" "}
          <button 
            type="button"
            onClick={() => setIsSignUp(!isSignUp)} 
            className="underline text-indigo-600 hover:text-indigo-800"
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </p>

        {success && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md text-center">
            {success}
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-center">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}