
import React from 'react';
import { useTitle } from '@/hooks/use-title';
import Navbar from '@/components/layout/Navbar';

const Profile = () => {
  useTitle('User Profile');
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
        <div className="grid gap-6">
          {/* Profile content will go here */}
          <p>Profile page is under construction.</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
