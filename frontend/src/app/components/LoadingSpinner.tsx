// app/components/LoadingSpinner.tsx
export default function LoadingSpinner() {
    return (
      <div className="fixed inset-0 flex justify-center items-center backdrop-blur-xl bg-glass-medium">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-pink-500 
                         rounded-full blur animate-spin" />
          <div className="relative h-16 w-16 rounded-full backdrop-blur-xl bg-glass-heavy 
                         border-2 border-outline-default animate-pulse" />
        </div>
      </div>
    );
  }