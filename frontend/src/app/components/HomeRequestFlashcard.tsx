// frontend/src/app/components/HomeRequestFlashcard.tsx
import React from 'react';
import Link from 'next/link';
import { getTagColor, borderGradients } from '../utils/colorUtils';
import { IPost } from '@shared/types';

const HomeRequestFlashcard: React.FC<{ post: IPost; index: number }> = ({ post, index }) => {
  const imageUrl = post.images && post.images.length > 0
    ? post.images[0]
    : `https://placehold.co/600x400?text=${encodeURIComponent(post.title)}`;

  // Use index to create different gradients for each card
  const gradient = post.theme
    ? { from: post.theme.borderFrom, to: post.theme.borderTo }
    : borderGradients[index % borderGradients.length];
  
  const glowColor = post.theme?.glowColor || 'rgba(255, 255, 255, 0.1)';

  return (
    <Link href={`/request/${post._id}`} className="group flex-shrink-0 w-64">
      <div className="relative">
        {/* Animated border effect with custom colors */}
        <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient.from} ${gradient.to}
                       opacity-0 group-hover:opacity-100 rounded-lg blur transition 
                       duration-500 animate-gradient-xy`} 
             style={{
               '--tw-shadow-color': glowColor,
             } as React.CSSProperties}
        />
        
        {/* Card content */}
        <div className="relative backdrop-blur-xl bg-glass-medium rounded-lg 
                       overflow-hidden border border-outline-default shadow-glass
                       transition-all duration-300 group-hover:shadow-glass-hover 
                       group-hover:bg-glass-heavy">
          <div className="relative h-32 w-full">
            <div className="absolute inset-0 backdrop-blur-sm bg-glass-light">
              <img
                src={imageUrl}
                alt={post.title}
                className="w-full h-full object-cover opacity-80"
              />
            </div>
          </div>
          <div className="p-4 backdrop-blur-xl bg-glass-medium">
            <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
            <div className="flex flex-wrap gap-1">
              {post.tags.map((tag, index) => {
                const tagColor = getTagColor(tag);
                return (
                  <span 
                    key={index} 
                    className={`text-xs backdrop-blur-xl ${tagColor.bg} 
                              ${tagColor.text} px-2 py-1 rounded-full 
                              border ${tagColor.border} transition-all 
                              duration-300 hover:scale-105`}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HomeRequestFlashcard;