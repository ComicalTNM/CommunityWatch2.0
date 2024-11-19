// frontend/src/app/components/ExploreRequestFlashcard.tsx
import React from 'react';
import Link from 'next/link';
import { IPost, OrganizationPreview } from '@shared/types';
import { Types } from 'mongoose';

function isOrganizationPreview(org: Types.ObjectId | OrganizationPreview): org is OrganizationPreview {
  return (org as OrganizationPreview).name !== undefined;
}

const ExploreRequestFlashcard: React.FC<{ post: IPost }> = ({ post }) => {
  const imageUrl = post.images && post.images.length > 0
  ? post.images[0]
  : `https://placehold.co/600x400?text=${encodeURIComponent(post.title)}`;

  const orgName = isOrganizationPreview(post.organization) 
    ? post.organization.name 
    : 'Organization';

  const orgMission = isOrganizationPreview(post.organization) 
    ? post.organization.description 
    : 'Organization Mission';

  const orgLogo = isOrganizationPreview(post.organization)
    ? post.organization.profileImage
    : `https://placehold.co/200x200?text=${encodeURIComponent(orgName[0])}`;

  return (
    <Link href={`/request/${post._id}`} className="group block">
      <div className="w-full backdrop-blur-xl bg-glass-medium rounded-lg 
                    border border-outline-default shadow-glass overflow-hidden
                    transition-all duration-300 hover:shadow-glass-hover 
                    hover:bg-glass-heavy">
        {/* Post Type Indicator */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 text-center">
          <p className="text-white font-medium text-sm">
            🎯 Support Request
          </p>
        </div>
        
        <div className="p-6">
          {/* Organization Info */}
          <div className="flex items-center gap-4 mb-4">
        <div className="flex-shrink-0 w-12 h-12 relative rounded-lg overflow-hidden">
          <img
            src={orgLogo}
            alt={orgName}
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">
            {orgName}
          </h3>
          <p className="text-sm text-white/60 line-clamp-1">
            {orgMission}
          </p>
        </div>
      </div>

          {/* Post Content */}
          <div className="relative h-[300px] w-full mb-4 rounded-lg overflow-hidden">
            <img
              src={imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            
            {/* Title overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                {post.title}
              </h3>
              <p className="text-sm text-white/80">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-white/90 mb-4 line-clamp-2">
            {post.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm rounded-full bg-glass-light
                         text-white border border-outline-default"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/60">
            {post.eventDate && (
              <div>
                📅 Event: {new Date(post.eventDate).toLocaleDateString()}
              </div>
            )}
            {post.volunteersNeeded && (
              <div>
                👥 Volunteers needed: {post.volunteersNeeded}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ExploreRequestFlashcard;