import Link from "next/link";

// components/PreviewPost.tsx
interface PreviewPostProps {
  post: {
    type: 'update' | 'thanks' | 'request';
    id?: string; // for request posts
    title: string;
    description: string;
    images: string[];
    createdAt: Date;
    personalMessage?: string;
  };
}

const PreviewPost: React.FC<PreviewPostProps> = ({ post }) => {
  const PostWrapper = ({ children }: { children: React.ReactNode }) => {
    if (post.type === 'request') {
      return (
        <Link href={`/request/${post.id}`}>
          <div className="group cursor-pointer">{children}</div>
        </Link>
      );
    }
    return <div>{children}</div>;
  };

  return (
    <PostWrapper>
      <div className="w-full backdrop-blur-xl bg-glass-medium rounded-lg 
                      border border-outline-default shadow-glass overflow-hidden
                      transition-all duration-300 hover:shadow-glass-hover 
                      hover:bg-glass-heavy">
        {/* Post Type Indicator */}
        {post.type === 'thanks' && (
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-2 text-center">
            <p className="text-white font-medium text-sm">
              ✨ Personal Message for You! ✨
            </p>
          </div>
        )}
        {post.type === 'request' && (
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 text-center">
            <p className="text-white font-medium text-sm">
              🎯 New Request - Click to Support! 🤝
            </p>
          </div>
        )}
        {post.type === 'update' && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 text-center">
            <p className="text-white font-medium text-sm">
              📢 Organization Update
            </p>
          </div>
        )}
        
        <div className="relative">
          {/* Images/Video Container */}
          <div className="relative h-[300px] w-full">
            <img
              src={post.images[0]}
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
        </div>

        {/* Description */}
        <div className="p-6">
          <p className="text-white/90 line-clamp-3">
            {post.description}
          </p>
        </div>
      </div>
    </PostWrapper>
  );
};

export default PreviewPost;