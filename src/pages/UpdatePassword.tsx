
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import UpdatePasswordForm from '@/components/auth/UpdatePasswordForm';

const UpdatePassword: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#11131E] text-white">
      <Navbar />
      <main className="flex-grow pt-12 pb-12 flex items-center justify-center">
        <div className="container max-w-md mx-auto px-4">
          <div className="bg-[#171B2D] rounded-lg p-6">
            <UpdatePasswordForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UpdatePassword;
