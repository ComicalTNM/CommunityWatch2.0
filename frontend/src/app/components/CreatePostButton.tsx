// app/components/CreatePostButton.tsx
'use client';

import Link from 'next/link';
import { useUser } from '@/app/hooks/useUser'; // You'll need to create this hook

/**
 * Creates a post button if the user is a nonprofit member.
 * @returns A button to create a post if the user is a nonprofit member, otherwise null.
 */
const CreatePostButton = () => {
  const { user } = useUser();

  if (!user || !user.isNonprofitMember) {
    return null;
  }

  return (
    <Link 
      href="/create" 
      className="fixed right-4 bottom-20 backdrop-blur-sm bg-glass-medium 
                 text-white rounded-full p-4 shadow-lg border border-outline-default
                 hover:bg-glass-heavy transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
    >
      <span className="text-2xl">➕</span>
    </Link>
  );
};

export default CreatePostButton;