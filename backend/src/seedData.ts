// backend/src/seedData.ts
import mongoose from 'mongoose';
import User from './models/User';
import Organization from './models/Organization';
import Post from './models/Post';
import DonorProfile from './models/DonorProfile';
import bcrypt from 'bcryptjs';

const seedData = async () => {
  // Clear existing data
  await User.deleteMany({});
  await Organization.deleteMany({});
  await Post.deleteMany({});
  await DonorProfile.deleteMany({});

  // Create users
  const users = [
    {
      username: 'johndoe',
      email: 'john@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'owner',
      profilePicture: `https://placehold.co/200x200?text=${encodeURIComponent("JD")}`
    },
    {
      username: 'janedoe',
      email: 'jane@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'admin',
      profilePicture: `https://placehold.co/200x200?text=${encodeURIComponent("JD")}`
    },
    {
      username: 'bobsmith',
      email: 'bob@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'member',
      profilePicture: `https://placehold.co/200x200?text=${encodeURIComponent("BS")}`
    },
    {
      username: 'alicedonor',
      email: 'alice@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'donor',
      profilePicture: `https://placehold.co/200x200?text=${encodeURIComponent("AD")}`
    }
  ];

  const createdUsers = await User.create(users);

  // Create organizations
  const organizations = [
    {
      name: "Green Earth Initiative",
      description: "Dedicated to environmental conservation and sustainability.",
      longBio: "Green Earth Initiative is committed to creating a sustainable future for our planet. We focus on community-driven projects that promote environmental awareness, conservation, and sustainable living practices.",
      bannerImage: `https://placehold.co/600x400?text=${encodeURIComponent("Green Earth Initiative")}`,
      profileImage: `https://placehold.co/200x200?text=${encodeURIComponent("GEI")}`,
      ownerId: createdUsers[0]._id,
      adminIds: [createdUsers[0]._id, createdUsers[1]._id],
      memberIds: [createdUsers[0]._id, createdUsers[1]._id, createdUsers[2]._id],
      website: "https://greenearth.org",
      contactEmail: "contact@greenearth.org",
      contactPhone: "+1234567890",
      socialMedia: {
        facebook: "https://facebook.com/greenearth",
        twitter: "https://twitter.com/greenearth",
        instagram: "https://instagram.com/greenearth",
        linkedin: "https://linkedin.com/company/greenearth"
      },
      causes: ["Environment", "Sustainability", "Conservation"],
      foundedYear: 2010
    },
    {
      name: "Helping Hands Shelter",
      description: "Providing food and housing for those in need.",
      longBio: "Helping Hands Shelter is dedicated to supporting our community's most vulnerable members. We provide shelter, meals, and support services to help individuals and families get back on their feet.",
      bannerImage: `https://placehold.co/600x400?text=${encodeURIComponent("Helping Hands Shelter")}`,
      profileImage: `https://placehold.co/200x200?text=${encodeURIComponent("HHS")}`,
      ownerId: createdUsers[1]._id,
      adminIds: [createdUsers[1]._id],
      memberIds: [createdUsers[1]._id, createdUsers[2]._id],
      website: "https://helpinghands.org",
      contactEmail: "info@helpinghands.org",
      contactPhone: "+1987654321",
      socialMedia: {
        facebook: "https://facebook.com/helpinghands",
        twitter: "https://twitter.com/helpinghands",
        instagram: "https://instagram.com/helpinghands",
        linkedin: "https://linkedin.com/company/helpinghands"
      },
      causes: ["Homelessness", "Poverty", "Community Support"],
      foundedYear: 2005
    }
  ];

  const createdOrganizations = await Organization.create(organizations);
  // Update users with organizationId
  await User.findByIdAndUpdate(createdUsers[0]._id, { organizationId: createdOrganizations[0]._id });
  await User.findByIdAndUpdate(createdUsers[1]._id, { organizationId: createdOrganizations[1]._id });
  await User.findByIdAndUpdate(createdUsers[2]._id, { organizationId: createdOrganizations[0]._id });

  // Create posts
  const posts = [
    {
      title: "Beach Cleanup Drive",
      description: "Join us for our annual beach cleanup event to help preserve our coastal ecosystems.",
      images: [`https://placehold.co/600x400?text=${encodeURIComponent("Beach Cleanup")}`],
      tags: ["Environment", "Volunteer", "Community"],
      organization: createdOrganizations[0]._id,
      itemsNeeded: [
        { item: "Gloves", quantity: 50 },
        { item: "Trash bags", quantity: 100 }
      ],
      volunteersNeeded: 30,
      eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    },
    {
      title: "Recycle Day Drive",
      description: "Join us for our annual recycle day event to help recycle reusables.",
      images: [`https://placehold.co/600x400?text=${encodeURIComponent("Recycle Day Drive")}`],
      tags: ["Environment", "Volunteer", "Community"],
      organization: createdOrganizations[0]._id,
      itemsNeeded: [
        { item: "Gloves", quantity: 50 },
        { item: "Trash bags", quantity: 100 }
      ],
      volunteersNeeded: 30,
      eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    },
    {
      title: "Food Drive for the Homeless",
      description: "Help us collect non-perishable food items for our local homeless shelter.",
      images: [`https://placehold.co/600x400?text=${encodeURIComponent("Food Drive")}`],
      tags: ["Food Drive", "Homelessness", "Donation"],
      organization: createdOrganizations[1]._id, // Changed from organizationId to organization
      itemsNeeded: [
        { item: "Canned goods", quantity: 200 },
        { item: "Rice", quantity: 50 }
      ],
      volunteersNeeded: 15,
      eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
    },
    {
      title: "NC A&T Foodshelter",
      description: "Help us collect non-perishable food items for our local food shelter.",
      images: [`https://placehold.co/600x400?text=${encodeURIComponent("NC A&T Foodshelter")}`],
      tags: ["Food Drive", "Humanitarian", "Donation"],
      organization: createdOrganizations[1]._id, // Changed from organizationId to organization
      itemsNeeded: [
        { item: "Canned goods", quantity: 200 },
        { item: "Rice", quantity: 50 }
      ],
      volunteersNeeded: 15,
      eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
    },
    {
      title: "Jugars vs Rockets - Little League",
      description: "Help us with our little league for tonight's game for the Jugars vs Rockets.",
      images: [`https://placehold.co/600x400?text=${encodeURIComponent("Jugars vs Rockets - Little League")}`],
      tags: ["Sports", "Recreational"],
      organization: createdOrganizations[1]._id, // Changed from organizationId to organization
      itemsNeeded: [
        { item: "Canned goods", quantity: 200 },
        { item: "Rice", quantity: 50 }
      ],
      volunteersNeeded: 35,
      eventDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000) // 14 days from now
    },
    {
      title: "Daily Bread Sundays",
      description: "Help us serve our kind on Sunday. Join us for our daily bread event!",
      images: [`https://placehold.co/600x400?text=${encodeURIComponent("Daily Bread Sundays")}`],
      tags: ["Religion", "Food", "Community"],
      organization: createdOrganizations[0]._id, // Changed from organizationId to organization
      itemsNeeded: [
        { item: "Canned goods", quantity: 200 },
        { item: "Rice", quantity: 50 }
      ],
      volunteersNeeded: 35,
      eventDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000) // 14 days from now
    }
  ];

  const createdPosts = await Post.create(posts);

  // Create donor profiles
  const donorProfiles = [
    {
      userId: createdUsers[3]._id,
      bio: "Passionate about making a difference in my community.",
      interests: ["Environmental Conservation", "Homeless Support"],
      donationHistory: [
        {
          organization: createdOrganizations[0]._id, // Changed from organizationId to organization
          amount: 100,
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
        },
        {
          organization: createdOrganizations[1]._id, // Changed from organizationId to organization
          amount: 50,
          date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
        }
      ],
      preferredCauses: ["Environment", "Homelessness"],
      volunteerHistory: [
        {
          organization: createdOrganizations[0]._id, // Changed from organizationId to organization
          hours: 5,
          date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000) // 45 days ago
        }
      ]
    }
  ];

  const createdDonorProfiles = await DonorProfile.create(donorProfiles);

  // Update user with donorProfileId
  await User.findByIdAndUpdate(createdUsers[3]._id, { donorProfileId: createdDonorProfiles[0]._id });

  console.log('Seed data inserted successfully');
};

export default seedData;