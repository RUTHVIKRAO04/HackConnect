import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Users, Search, Mail, Github, Linkedin, Twitter } from 'lucide-react';

export function Home() {
  return (
    <div className="bg-white">
      <div className="relative isolate">
        <div className="mx-auto max-w-2xl py-16 sm:py-20 lg:py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Connect, Create, and<br className="hidden sm:block" /> Hack Together
            </h1>
            <p className="mt-8 text-lg leading-8 text-gray-600 max-w-xl mx-auto">
              Join the largest community of hackers, builders, and innovators. Find your next hackathon team or host your own event.
            </p>
            <div className="mt-12 flex items-center justify-center gap-x-8">
              <Link
                to="/explore"
                className="rounded-md bg-indigo-600 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Find Hackathons
              </Link>
              <Link
                to="/find-teammates"
                className="text-base font-semibold leading-6 text-gray-900 hover:text-indigo-600"
              >
                Find Teammates <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Why HackConnect?</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to succeed in hackathons
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <Rocket className="h-5 w-5 flex-none text-indigo-600" />
                  Discover Hackathons
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Find the perfect hackathon that matches your interests and skill level.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <Users className="h-5 w-5 flex-none text-indigo-600" />
                  Build Your Team
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Connect with talented developers, designers, and innovators.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <Search className="h-5 w-5 flex-none text-indigo-600" />
                  Track Progress
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Keep track of your hackathon journey and showcase your achievements.</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <footer className="bg-white border-t border-gray-200">
        <div className="mx-auto max-w-7xl py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 justify-items-center">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold text-gray-900">Contact Us</h3>
              <div className="mt-6 space-y-4">
                <p className="text-gray-600 flex items-center justify-center md:justify-start">
                  <Mail className="h-5 w-5 mr-3 text-indigo-600" />
                  contact@hackconnect.com
                </p>
              </div>
            </div>

            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold text-gray-900">Follow Us</h3>
              <div className="mt-6 flex justify-center md:justify-start space-x-6">
                <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  <Github className="h-7 w-7" />
                </a>
                <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  <Linkedin className="h-7 w-7" />
                </a>
                <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  <Twitter className="h-7 w-7" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">
              © {new Date().getFullYear()} HackConnect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}