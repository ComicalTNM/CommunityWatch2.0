// utils/colorUtils.ts
export const tagColors = [
    { bg: 'bg-blue-500/30', border: 'border-blue-400/50', text: 'text-blue-100' },
    { bg: 'bg-purple-500/30', border: 'border-purple-400/50', text: 'text-purple-100' },
    { bg: 'bg-green-500/30', border: 'border-green-400/50', text: 'text-green-100' },
    { bg: 'bg-pink-500/30', border: 'border-pink-400/50', text: 'text-pink-100' },
    { bg: 'bg-yellow-500/30', border: 'border-yellow-400/50', text: 'text-yellow-100' },
    { bg: 'bg-cyan-500/30', border: 'border-cyan-400/50', text: 'text-cyan-100' },
  ];
  
  export const borderGradients = [
    { from: 'from-blue-500', to: 'to-purple-500' },
    { from: 'from-purple-500', to: 'to-pink-500' },
    { from: 'from-green-500', to: 'to-blue-500' },
    { from: 'from-yellow-500', to: 'to-orange-500' },
    { from: 'from-pink-500', to: 'to-rose-500' },
  ];
  
  // Function to get consistent color for a tag
  export const getTagColor = (tag: string) => {
    const index = Math.abs(tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
    return tagColors[index % tagColors.length];
  };
  
  // Function to get random border gradient
  export const getRandomBorderGradient = () => {
    return borderGradients[Math.floor(Math.random() * borderGradients.length)];
  };