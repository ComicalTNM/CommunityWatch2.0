// components/OrganizationFeed.tsx
import PreviewPost from "./PreviewPost";

export interface OrganizationFeedProps {
  organization: {
    id: string;
    name: string;
    profileImage: string;
    posts: Array<{
      type: 'update' | 'thanks' | 'request';
      id?: string; // for request posts
      title: string;
      description: string;
      images: string[];
      createdAt: Date;
      personalMessage?: string;
    }>;
  };
}

const OrganizationFeed: React.FC<OrganizationFeedProps> = ({ organization }) => {
  return (
    <div className="space-y-6 backdrop-blur-lg bg-glass-light 
                    rounded-lg p-6 border border-outline-default">
      {/* Organization Header */}
      <div className="flex items-center space-x-4">
        <img
          src={organization.profileImage}
          alt={organization.name}
          className="w-16 h-16 rounded-full border-2 border-white/20"
        />
        <h3 className="text-xl font-bold text-white">
          {organization.name}
        </h3>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {organization.posts.map((post, index) => (
          <PreviewPost key={index} post={post} />
        ))}
      </div>
    </div>
  );
};

export default OrganizationFeed;