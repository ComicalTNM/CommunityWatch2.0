'use client';

import { Suspense, useEffect } from 'react';
import LoadingSpinner from './components/LoadingSpinner';
import PostList from './components/PostList';
import OrganizationFeed, { OrganizationFeedProps } from './components/OrganizationFeed';
import { getPosts } from './services/postService';
import { IPost } from '@shared/types';
import { useState } from 'react';

function HomeContent() {
  const actionButtons = [
    { label: 'My Organizations', color: 'bg-purple-500', icon: '🏢' },
    { label: 'Saved Requests', color: 'bg-blue-500', icon: '⭐' },
    { label: 'Recent Activity', color: 'bg-green-500', icon: '📊' },
    { label: 'Volunteer History', color: 'bg-pink-500', icon: '📝' },
    { label: 'Donation Stats', color: 'bg-amber-500', icon: '📈' },
  ];

  const [post, setPost] = useState<IPost | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await getPosts(1);
        setPost(fetchedPost[0]);
      } catch (err: unknown) {
        console.error("Error fetching post:", err);
        if (err instanceof Error) setError(err.message);
        else if (err instanceof String) setError(err.toString());
        else setError("Error: " + err);
      }
    }
    fetchPost();
  }, [])

  if (!post) {
    return <LoadingSpinner/>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const sampleFeeds: Array<OrganizationFeedProps> = [
    {
      organization: {
        id: '1',
        name: 'Green Earth Initiative',
        profileImage: 'https://placehold.co/200x200?text=GEI',
        posts: [
          {
            type: 'request',
            id: post._id,
            title: 'Beach Cleanup Drive',
            description: 'Join us for our annual beach cleanup event! We need volunteers and supplies to help preserve our coastal ecosystems. Your support can make a huge difference in protecting our marine life.',
            images: ['https://placehold.co/1200x800?text=Beach+Cleanup'],
            createdAt: new Date(),
          },
          {
            type: 'thanks',
            title: 'Thank You for Supporting Our Cause!',
            description: 'Your recent participation in our environmental initiatives has been invaluable. Thanks to supporters like you, we were able to make significant progress in our mission to protect the environment...',
            images: ['https://placehold.co/1200x800?text=Thank+You'],
            createdAt: new Date(),
            personalMessage: 'Your dedication to environmental conservation inspires us!',
          },
        ],
      }
    },
    {
      organization: {
        id: '2',
        name: 'Helping Hands Shelter',
        profileImage: 'https://placehold.co/200x200?text=HHS',
        posts: [
          {
            type: 'request',
            id: '6728d989ff3b12f1e7fdc87e',
            title: 'Winter Clothing Drive',
            description: "Help us keep our community warm this winter! We're collecting warm clothing items for those in need. Every donation makes a difference in someone's life.",
            images: ['https://placehold.co/1200x800?text=Clothing+Drive'],
            createdAt: new Date(),
          },
          {
            type: 'update',
            title: 'Community Kitchen Success',
            description: "Last week's community kitchen event was a huge success! We served over 200 meals and brought smiles to many faces. Here's a glimpse of the wonderful moments we shared...",
            images: ['https://placehold.co/1200x800?text=Community+Kitchen'],
            createdAt: new Date(),
          },
        ],
      }
    },
  ];


  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Welcome section with buttons */}
      <section className="backdrop-blur-xl bg-glass-medium rounded-xl 
                         border border-outline-default shadow-glass p-6">
        <h1 className="text-3xl font-bold text-white mb-6">
          Welcome to GiveApp
        </h1>

        {/* Scrollable buttons container with padding for hover effects */}
        <div className="relative -mx-2 px-2 pb-2"> {/* Added negative margin and padding to maintain alignment */}
          {/* Scrollable buttons */}
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
            {actionButtons.map((button, index) => (
              <button
                key={index}
                className={`flex-shrink-0 ${button.color} px-6 py-3 rounded-lg 
                           font-bold text-white shadow-lg transform transition-all 
                           duration-300 hover:scale-105 hover:shadow-xl 
                           hover:ring-2 hover:ring-white/50 hover:-translate-y-0.5
                           focus:outline-none focus:ring-2 focus:ring-white/50
                           backdrop-blur-xl bg-opacity-90`}
              >
                <span className="flex items-center space-x-2">
                  <span className="text-xl">{button.icon}</span>
                  <span>{button.label}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* History section */}
      <section className="backdrop-blur-xl bg-glass-medium rounded-xl 
                         border border-outline-default shadow-glass p-6">
        <h2 className="text-2xl font-semibold text-white mb-6">
          History
        </h2>
        <div className="space-y-4">
          <PostList cardType="home" limit={5} />
        </div>
      </section>

      {/* Updates from Organizations */}
      <section className="backdrop-blur-xl bg-glass-medium rounded-xl 
                         border border-outline-default shadow-glass p-6">
        <h2 className="text-2xl font-bold text-white mb-6">
          Updates from Organizations You Follow
        </h2>
        
        <div className="space-y-8">
          {sampleFeeds.map((org, index) => (
            <OrganizationFeed key={index} organization={org.organization} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HomeContent />
    </Suspense>
  );
}