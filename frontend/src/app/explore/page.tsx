// frontend/src/app/explore/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPosts } from '../services/postService';
import SearchBar from '../components/SearchBar';
import { IPost, OrganizationPreview } from '@shared/types';
import { Types } from 'mongoose';

// Type guard for OrganizationPreview
function isOrganizationPreview(org: Types.ObjectId | OrganizationPreview): org is OrganizationPreview {
  return (org as OrganizationPreview).name !== undefined;
}

// Filter types
type FilterType = 'near' | 'latest' | 'popular' | 'starving' | 'trending';
type TopicType = {
  id: string;
  label: string;
  color: string;
};

type LeaderboardOrg = {
  id: string;
  name: string;
  logo: string;
  mission: string;
  causes: string[];
  score: number; // Could be based on donations received, impact, etc.
};

const topOrganizations: LeaderboardOrg[] = [
  {
    id: '1',
    name: 'Global Education Initiative',
    logo: `https://placehold.co/200x200?text=${encodeURIComponent("GEI")}`, // Replace with actual logo paths
    mission: 'Providing quality education to underprivileged children worldwide',
    causes: ['Education', 'Youth Development'],
    score: 9840
  },
  {
    id: '2',
    name: 'Green Health Co',
    logo: `https://placehold.co/200x200?text=${encodeURIComponent("GH")}`, // Replace with actual logo paths
    mission: 'Providing quality education to underprivileged children worldwide',
    causes: ['Health', 'Humanity'],
    score: 9040
  },
  {
    id: '3',
    name: 'YMCA Greensboro',
    logo: `https://placehold.co/200x200?text=${encodeURIComponent("YMCA")}`, // Replace with actual logo paths
    mission: 'Providing quality education to underprivileged children worldwide',
    causes: ['Education', 'Youth Development'],
    score: 9000
  },
  {
    id: '4',
    name: 'NC A&T Food Shelter',
    logo: `https://placehold.co/200x200?text=${encodeURIComponent("FS")}`, // Replace with actual logo paths
    mission: 'Free food',
    causes: ['Food', 'Shelter'],
    score: 8000
  },
  {
    id: '5',
    name: 'Food Shelter',
    logo: `https://placehold.co/200x200?text=${encodeURIComponent("FS")}`, // Replace with actual logo paths
    mission: 'Free food',
    causes: ['Food', 'Shelter'],
    score: 7000
  },
];


const filterButtons: { type: FilterType; label: string; color: string }[] = [
  { type: 'near', label: 'Near You', color: 'from-blue-400 to-cyan-400' },
  { type: 'latest', label: 'Latest', color: 'from-green-400 to-emerald-400' },
  { type: 'popular', label: 'Popular', color: 'from-purple-400 to-pink-400' },
  { type: 'starving', label: 'Urgent Needs', color: 'from-red-400 to-orange-400' },
  { type: 'trending', label: 'Trending', color: 'from-yellow-400 to-amber-400' },
];

const topicButtons: TopicType[] = [
  { id: 'education', label: 'Education', color: 'from-blue-500 to-indigo-500' },
  { id: 'healthcare', label: 'Healthcare', color: 'from-red-500 to-pink-500' },
  { id: 'environment', label: 'Environment', color: 'from-green-500 to-emerald-500' },
  { id: 'hunger', label: 'Food Security', color: 'from-orange-500 to-amber-500' },
  { id: 'housing', label: 'Housing', color: 'from-purple-500 to-fuchsia-500' },
  { id: 'animals', label: 'Animal Welfare', color: 'from-yellow-500 to-orange-500' },
  { id: 'elderly', label: 'Senior Care', color: 'from-teal-500 to-cyan-500' },
  { id: 'veterans', label: 'Veterans', color: 'from-rose-500 to-red-500' },
  { id: 'disabilities', label: 'Disabilities', color: 'from-violet-500 to-purple-500' },
  { id: 'arts', label: 'Arts & Culture', color: 'from-fuchsia-500 to-pink-500' },
  { id: 'youth', label: 'Youth Programs', color: 'from-cyan-500 to-blue-500' },
  { id: 'community', label: 'Community Dev', color: 'from-emerald-500 to-green-500' },
  { id: 'disaster', label: 'Disaster Relief', color: 'from-amber-500 to-yellow-500' },
  { id: 'mental-health', label: 'Mental Health', color: 'from-indigo-500 to-violet-500' },
  { id: 'sports', label: 'Sports & Rec', color: 'from-lime-500 to-green-500' },
];


export default function ExplorePage() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType | null>(null);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getPosts(undefined, searchQuery);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="container mx-auto max-w-7xl">
      {/* Search Section */}
      <div className="mb-8 px-4">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Filters Section */}
      <div className="relative mb-8 px-4 py-4"> {/* Added py-4 for vertical padding */}
        <div className="overflow-visible hide-scrollbar">
          <div className="flex gap-3 pb-2">
            {filterButtons.map(({ type, label, color }) => (
              <button
                key={type}
                onClick={() => setActiveFilter(type === activeFilter ? null : type)}
                className="flex-1 relative group min-w-[160px] h-[80px]" // Added fixed minimum width and height
              >
                {/* Animated border effect */}
                <div
                  className={`absolute -inset-[4px] bg-gradient-to-r ${color}
                           opacity-75 rounded-lg blur transition duration-500
                           group-hover:opacity-100`}
                />
                
                {/* Button content */}
                <div
                  className={`relative h-full w-full backdrop-blur-xl 
                           ${activeFilter === type ? 'bg-glass-heavy' : 'bg-glass-medium'}
                           rounded-lg border border-outline-default
                           transition-all duration-300 hover:bg-glass-heavy
                           text-white flex items-end justify-end p-4` /* Added flex and positioning */}
                >
                  <span className="text-lg font-medium">{label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Topics Grid Section */}
      <div className="px-4 mb-8">
        <h2 className="text-2xl font-semibold text-white mb-6">Explore Topics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-2">
          {topicButtons.map(({ id, label, color }) => (
            <button
              key={id}
              onClick={() => setActiveTopic(id === activeTopic ? null : id)}
              className="relative group h-24 transition-transform duration-300 hover:scale-[1.02]"
            >
              {/* Glow effect - only visible on hover */}
              <div
                className={`absolute -inset-[4px] bg-gradient-to-r ${color}
                         opacity-0 rounded-lg blur transition duration-300
                         group-hover:opacity-70`}
              />
              
              {/* Button content */}
              <div
                className={`relative h-full w-full backdrop-blur-xl 
                         ${activeTopic === id ? 'bg-glass-heavy' : 'bg-glass-medium'}
                         rounded-lg border border-outline-default
                         transition-all duration-300 hover:bg-glass-heavy
                         text-white flex items-center justify-center p-4`}
              >
                <span className="text-base font-medium text-center">{label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>


            {/* Leaderboard Section */}
            <div className="px-4 mb-8">
        <h2 className="text-2xl font-semibold text-white mb-6">Top Organizations</h2>
        <div className="relative p-2">
          <div className="relative backdrop-blur-xl bg-glass-medium rounded-lg border border-outline-default p-6">
            {topOrganizations.map((org, index) => (
              <div
                key={org.id}
                className={`relative flex items-center gap-4 p-4 rounded-lg
                           transition-all duration-300 hover:bg-glass-heavy
                           ${index !== topOrganizations.length - 1 ? 'border-b border-outline-default' : ''}`}
              >
                {/* Rank Number */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">#{index + 1}</span>
                </div>

                {/* Organization Logo */}
                <div className="flex-shrink-0 w-12 h-12 relative rounded-lg overflow-hidden">
                  <img
                    src={org.logo}
                    alt={`${org.name} logo`}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Organization Info */}
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-white">{org.name}</h3>
                  <p className="text-sm text-gray-300 line-clamp-1">{org.mission}</p>
                  
                  {/* Causes Tags */}
                  <div className="flex gap-2 mt-2">
                    {org.causes.map((cause) => (
                      <span
                        key={cause}
                        className="px-2 py-1 text-xs rounded-full bg-glass-light
                                 text-white border border-outline-default"
                      >
                        {cause}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Score */}
                <div className="flex-shrink-0 text-right">
                  <span className="text-lg font-semibold text-white">
                    {org.score.toLocaleString()}
                  </span>
                  <p className="text-xs text-gray-300">points</p>
                </div>
              </div>
            ))}
          </div>

          {/* Decorative gradient blur behind the leaderboard */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-lg blur opacity-20 -z-10" />
        </div>
      </div>

      {/* Posts section will be updated later */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div key={post._id}>
            {/* Post content will be updated with new design */}
            {isOrganizationPreview(post.organization) && (
              <Link href={`/organization/${post.organization._id}`}>
                <span>{post.organization.name}</span>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}