// loading.tsx
import LoadingSpinner from '@/app/components/LoadingSpinner';

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="backdrop-blur-sm bg-glass-medium p-8 rounded-lg 
                      border border-outline-default">
        <LoadingSpinner />
      </div>
    </div>
  );
}