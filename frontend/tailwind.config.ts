import type { Config } from "tailwindcss";

/**
 * Tailwind CSS Configuration File
 * This file controls the global styling system for your application.
 * It allows you to customize colors, animations, shadows, and other design tokens.
 * Changes here will be available throughout your application via Tailwind's utility classes.
 */

/**
 * HOW TO USE THIS CONFIGURATION:
 * 
 * 1. Colors:
 *    - Use orange shades with: text-orange-500, bg-orange-200, etc.
 *    - Use glass effects with: bg-glass-light, bg-glass-medium, bg-glass-heavy
 *    - Use outline colors with: border-outline-default
 * 
 * 2. Blur Effects:
 *    - Apply backdrop blur with: backdrop-blur-xs, backdrop-blur-md, etc.
 * 
 * 3. Shadows:
 *    - Apply glass shadows with: shadow-glass, shadow-glass-hover
 * 
 * 4. Animations:
 *    - Use gradient animation with: animate-gradient-xy
 *    - Use pulse animation with: animate-pulse
 *    - Use spin animation with: animate-spin
 * 
 * EXAMPLE USAGE IN A COMPONENT:
 * 
 * <div className="
 *   bg-glass-medium
 *   backdrop-blur-md
 *   shadow-glass
 *   hover:shadow-glass-hover
 *   text-orange-500
 *   animate-gradient-xy
 * ">
 *   Your content here
 * </div>
 * 
 * To add new styles:
 * 1. Add your new values in the appropriate section above
 * 2. Restart docker container (even for dev docker version)
 * 3. Use the new classes in your components
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // 'extend' allows you to add new values while keeping the default Tailwind theme
    extend: {
      // Custom color palette
      // Usage example: <div className="bg-orange-500"> for orange background
      // Usage example: <div className="bg-glass-light"> for transparent light background
      colors: {
        orange: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.08)',
          medium: 'rgba(255, 255, 255, 0.12)',
          heavy: 'rgba(255, 255, 255, 0.16)',
        },
        // Custom outline color
        // Usage example: <div className="border-outline-default">
        outline: {
          default: 'rgba(255, 255, 255, 0.15)',
        },
      },
      // Custom backdrop blur values for frosted glass effects
      // Usage example: <div className="backdrop-blur-xs">
      backdropBlur: {
        xs: '2px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        glass: '0 4px 30px rgba(0, 0, 0, 0.1)',
        'glass-hover': '0 4px 30px rgba(255, 255, 255, 0.1)',
      },

      // Custom animation definitions
      // Usage example: <div className="animate-gradient-xy">
      animation: {
        'gradient-xy': 'gradient-xy 3s linear infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        spin: 'spin 1s linear infinite',
      },
      keyframes: {
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        pulse: {
          '0%, 100%': {
            opacity: '1'
          },
          '50%': {
            opacity: '.5'
          }
        },
        spin: {
          from: {
            transform: 'rotate(0deg)'
          },
          to: {
            transform: 'rotate(360deg)'
          }
        }
      }
    },
  },
  plugins: [],
};

export default config;