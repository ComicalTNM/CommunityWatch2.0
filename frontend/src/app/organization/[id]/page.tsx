// frontend/src/app/organization/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchOrganizationPublicProfile } from '@/app/services/api';
import { IOrganizationProfile, IMember, IPost } from '@shared/types';
import LoadingSpinner from '@/app/components/LoadingSpinner';

export default function OrganizationProfile() {
  const { id } = useParams();
  const [organization, setOrganization] = useState<IOrganizationProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        if (typeof id === 'string') {
          const data = await fetchOrganizationPublicProfile(id);
          setOrganization(data);
        }
      } catch (error) {
        console.error('Error fetching organization:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, [id]);

  if (loading) {
    return <LoadingSpinner/>
  }

  if (!organization) {
    return <div>Organization not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Banner Image */}
      <div className="relative h-64 w-full mb-8">
        <img
          src={organization.bannerImage}
          alt={organization.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Organization Name and Image */}
      <div className="flex items-center mb-8">
        <img
          src={organization.profileImage}
          alt={organization.name}
          className="w-24 h-24 rounded-full mr-4"
        />
        <h1 className="text-3xl font-bold text-orange-800">{organization.name}</h1>
      </div>

      {/* Social Media Links */}
      <div className="flex space-x-4 mb-8">
        {organization.socialMedia.facebook && (
          <Link href={organization.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
            <span className="text-blue-600">Facebook</span>
          </Link>
        )}
        {organization.socialMedia.twitter && (
          <Link href={organization.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
            <span className="text-blue-400">Twitter</span>
          </Link>
        )}
        {organization.socialMedia.instagram && (
          <Link href={organization.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
            <span className="text-pink-600">Instagram</span>
          </Link>
        )}
        {organization.socialMedia.linkedin && (
          <Link href={organization.socialMedia.linkedin} target="_blank" rel="noopener noreferrer">
            <span className="text-blue-800">LinkedIn</span>
          </Link>
        )}
      </div>

      {/* Causes */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-orange-700 mb-4">Causes</h2>
        <div className="flex flex-wrap gap-2">
          {organization.causes.map((cause, index) => (
            <span key={index} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
              {cause}
            </span>
          ))}
        </div>
      </div>

      {/* Bio */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-orange-700 mb-4">About Us</h2>
        <p className="text-gray-700">{organization.longBio}</p>
      </div>

      {/* Contact Info */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-orange-700 mb-4">Contact Information</h2>
        <p>Email: {organization.contactEmail}</p>
        {organization.contactPhone && <p>Phone: {organization.contactPhone}</p>}
        {organization.website && (
          <p>
            Website:{' '}
            <Link href={organization.website} target="_blank" rel="noopener noreferrer">
              <span className="text-blue-600">{organization.website}</span>
            </Link>
          </p>
        )}
      </div>

      {/* Active Posts */}
      {organization.activePosts && organization.activePosts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-700 mb-4">Active Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {organization.activePosts.map((post: IPost) => (
              <div key={post._id} className="bg-white shadow-md rounded-lg overflow-hidden">
                {post.images && post.images.length > 0 && (
                  <img 
                    src={post.images[0]} 
                    alt={post.title} 
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.description.substring(0, 100)}...</p>
                  <Link href={`/request/${post._id}`}>
                    <span className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors">
                      Learn More
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Members */}
      <div>
        <h2 className="text-2xl font-semibold text-orange-700 mb-4">Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {organization.teamMembers.map((member: IMember) => (
            <div key={member._id} className="flex flex-col items-center">
              <img
                src={member.profilePicture || '/default-profile.jpg'}
                alt={member.name}
                className="w-24 h-24 rounded-full mb-2"
              />
              <p className="font-semibold">{member.name}</p>
              <p className="text-sm text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}