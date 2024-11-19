// frontend/src/app/request/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getPostById } from '@/app/services/postService';
import { IPost, OrganizationPreview } from '@shared/types';
import LoadingSpinner from '@/app/components/LoadingSpinner'

const RequestPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState<IPost | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (typeof id === 'string') {
        const fetchedPost = await getPostById(id);
        setPost(fetchedPost);
        if (fetchedPost.images && fetchedPost.images.length > 0) {
          setSelectedImage(fetchedPost.images[0]);
        }
      }
    };
    fetchPost();
  }, [id]);

  if (!post) {
    return <LoadingSpinner/>;
  }

  const organization = post.organization as OrganizationPreview;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Post Header Section */}
      <div className="mb-8">
        <div className="relative h-96 w-full mb-4">
          <img
            src={selectedImage || `https://placehold.co/600x400?text=${encodeURIComponent(post.title)}`}
            alt={post.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="flex space-x-2 overflow-x-auto">
          {post.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${post.title} ${index + 1}`}
              className="w-24 h-24 object-cover rounded cursor-pointer"
              onClick={() => setSelectedImage(image)}
            />
          ))}
        </div>
      </div>

      <h1 className="text-3xl font-bold text-orange-800 mb-4">{post.title}</h1>
      <p className="text-lg text-gray-700 mb-6">{post.description}</p>

      {/* Organization section */}
      <div className="bg-orange-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold text-orange-800 mb-2">Organization</h2>
        <div className="flex items-center">
          <img
            src={organization.profileImage || `https://placehold.co/100x100?text=${encodeURIComponent(organization.name)}`}
            alt={organization.name}
            className="w-16 h-16 rounded-full mr-4"
          />
          <div>
            <Link href={`/organization/${organization._id}`}>
              <span className="text-lg text-orange-800 font-semibold hover:underline">
                {organization.name}
              </span>
            </Link>
            <p className="text-sm text-gray-600">{organization.description}</p>
          </div>
        </div>
      </div>

      {/* Items needed section */}
      {post.itemsNeeded && post.itemsNeeded.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-orange-800 mb-4">Items Needed</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {post.itemsNeeded.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow">
                <img
                  src={`https://placehold.co/200x200?text=${encodeURIComponent(item.item)}`}
                  alt={item.item}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <h3 className="text-lg font-semibold text-orange-800 mb-1">{item.item}</h3>
                <p className="text-gray-600 mb-2">Description of {item.item}</p>
                <p className="text-orange-600 mb-2">Needed: {item.quantity}</p>
                <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors">
                  Donate
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestPage;