// profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { ThemeSettings } from '@shared/types';
import { useTheme } from '@/app/contexts/ThemeContext';

const commonColors = [
  { name: 'Purple', rgba: 'rgba(88, 28, 135, 0.2)' },  // purple-900 equivalent
  { name: 'Blue', rgba: 'rgba(30, 58, 138, 0.2)' },    // blue-900 equivalent
  { name: 'Green', rgba: 'rgba(6, 78, 59, 0.2)' },     // green-900 equivalent
  { name: 'Orange', rgba: 'rgba(154, 52, 18, 0.2)' },  // orange-900 equivalent
  { name: 'Red', rgba: 'rgba(127, 29, 29, 0.2)' },     // red-900 equivalent
  { name: 'Cyan', rgba: 'rgba(22, 78, 99, 0.2)' },     // cyan-900 equivalent
  { name: 'Pink', rgba: 'rgba(131, 24, 67, 0.2)' },    // pink-900 equivalent
  { name: 'Custom', rgba: 'rgba(0, 0, 0, 0.2)' }
];

const gradientDirections = [
  { name: 'Bottom Right', value: 'to bottom right' },
  { name: 'Bottom', value: 'to bottom' },
  { name: 'Bottom Left', value: 'to bottom left' },
  { name: 'Right', value: 'to right' },
  { name: 'Left', value: 'to left' },
  { name: 'Top Right', value: 'to top right' },
  { name: 'Top', value: 'to top' },
  { name: 'Top Left', value: 'to top left' },
];

const defaultTheme: ThemeSettings = {
  backgroundFrom: commonColors[0].rgba,
  backgroundTo: 'rgba(0, 0, 0, 1)',
  direction: 'to bottom right',
  allowOverride: true
};

export default function Profile() {
  const { theme, setTheme } = useTheme();
  const [selectedColor, setSelectedColor] = useState(commonColors[0].name);
  const [customRgba, setCustomRgba] = useState(commonColors[0].rgba);
  const [currentTheme, setCurrentTheme] = useState<ThemeSettings>(defaultTheme);

  useEffect(() => {
    // Initialize with current theme if it exists
    if (theme) {
      setCurrentTheme(theme);
      const color = commonColors.find(c => c.rgba === theme.backgroundFrom);
      if (color) {
        setSelectedColor(color.name);
        setCustomRgba(color.rgba);
      } else {
        setSelectedColor('Custom');
        setCustomRgba(theme.backgroundFrom);
      }
    }
  }, [theme]);

  const handleColorChange = (colorName: string) => {
    const color = commonColors.find(c => c.name === colorName);
    if (color) {
      setSelectedColor(colorName);
      if (colorName !== 'Custom') {
        setCustomRgba(color.rgba);
        const newTheme: ThemeSettings = {
          ...currentTheme,
          backgroundFrom: color.rgba,
          backgroundTo: 'rgba(0, 0, 0, 1)'
        };
        setCurrentTheme(newTheme);
        setTheme(newTheme);
      }
    }
  };


  const handleDirectionChange = (direction: string) => {
    const newTheme: ThemeSettings = {
      ...currentTheme,
      direction: direction
    };
    setCurrentTheme(newTheme);
    setTheme(newTheme);
  };

  const handleCustomRgbaChange = (value: string) => {
    setCustomRgba(value);
    if (selectedColor === 'Custom') {
      const newTheme: ThemeSettings = {
        ...currentTheme,
        backgroundFrom: value,
        backgroundTo: 'rgba(0, 0, 0, 1)'
      };
      setCurrentTheme(newTheme);
      setTheme(newTheme);
    }
  };

  const handleOverrideToggle = (allowed: boolean) => {
    const newTheme: ThemeSettings = {
      ...currentTheme,
      allowOverride: allowed
    };
    setCurrentTheme(newTheme);
    setTheme(newTheme);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Theme Settings Section */}
      <div className="backdrop-blur-xl bg-white/10 rounded-lg border border-white/20 shadow-lg">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Theme Settings</h3>
          
          {/* Color Selection */}
          <div className="space-y-4">
            <label className="text-white/80 block">Background Color</label>
            <select
              value={selectedColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white"
            >
              {commonColors.map((color) => (
                <option key={color.name} value={color.name}>
                  {color.name}
                </option>
              ))}
            </select>

            {/* Custom RGBA Input */}
            <div className="space-y-2">
              <label className="text-white/80 block">
                {selectedColor === 'Custom' ? 'Custom RGBA' : 'Current RGBA'}
              </label>
              <input
                type="text"
                value={customRgba}
                onChange={(e) => handleCustomRgbaChange(e.target.value)}
                disabled={selectedColor !== 'Custom'}
                placeholder="rgba(0, 0, 0, 0.2)"
                className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white"
              />
              <p className="text-white/60 text-sm">
                Format: rgba(red 0-255, green 0-255, blue 0-255, alpha 0-1)
              </p>
            </div>
          </div>

          {/* Gradient Direction */}
          <div className="space-y-2">
            <label className="text-white/80 block">Gradient Direction</label>
            <select
              value={currentTheme.direction}
              onChange={(e) => handleDirectionChange(e.target.value)}
              className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white"
            >
              {gradientDirections.map((direction) => (
                <option key={direction.value} value={direction.value}>
                  {direction.name}
                </option>
              ))}
            </select>
          </div>

          {/* Preview */}
          <div className="mt-6">
            <label className="text-white/80 block mb-2">Preview</label>
            <div 
              className="h-32 rounded-lg border border-white/20 overflow-hidden"
              style={{
                background: `linear-gradient(${currentTheme.direction}, ${currentTheme.backgroundFrom}, ${currentTheme.backgroundTo})`
              }}
            >
              <div className="h-full w-full flex items-center justify-center backdrop-blur-xl bg-white/10">
                <span className="text-white/80">Theme Preview</span>
              </div>
            </div>
          </div>

          {/* Override Toggle */}
          <div className="mt-6">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={currentTheme.allowOverride}
                onChange={(e) => handleOverrideToggle(e.target.checked)}
                className="form-checkbox h-5 w-5 text-orange-500 rounded border-white/20
                          bg-black/30 focus:ring-offset-0 focus:ring-2 focus:ring-orange-500"
              />
              <span className="text-white/80">Allow pages to override theme</span>
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button 
          onClick={() => {
            setTheme(currentTheme); // Apply the current theme settings
            // Here you could also add an API call to save the theme to the user's profile
          }}
          className="w-full backdrop-blur-xl bg-white/10 px-4 py-3 rounded-lg 
                  border border-white/20 hover:bg-white/20 
                  transition-all duration-300
                  text-white"
        >
          Apply Changes
        </button>
        <button 
          onClick={() => {
            setCurrentTheme(defaultTheme);
            setTheme(defaultTheme);
            handleColorChange(commonColors[0].name);
          }}
          className="w-full backdrop-blur-xl bg-white/10 px-4 py-3 rounded-lg 
                   border border-white/20 hover:bg-white/20 
                   transition-all duration-300
                   text-white/80"
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
}