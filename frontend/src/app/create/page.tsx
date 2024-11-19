'use client';
import { useState } from 'react';

export default function Create() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [date, setDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Submitted:', { title, description, image, date });
    // Reset form
    setTitle('');
    setDescription('');
    setImage(null);
    setDate('');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-orange-800">Create New Request</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-orange-700 mb-1">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-orange-300 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-orange-700 mb-1">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-orange-300 rounded"
            rows={4}
            required
          />
        </div>
        <div>
          <label htmlFor="image" className="block text-orange-700 mb-1">Image</label>
          <input
            type="file"
            id="image"
            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
            className="w-full p-2 border border-orange-300 rounded"
            accept="image/*"
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-orange-700 mb-1">Event Date (if applicable)</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border border-orange-300 rounded"
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
        >
          Create Request
        </button>
      </form>
    </div>
  );
}