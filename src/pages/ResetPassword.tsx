
import React from 'react';
import { useTitle } from '@/hooks/use-title';
import Navbar from '@/components/layout/Navbar';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

const ResetPassword = () => {
  useTitle('Reset Password');
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <ResetPasswordForm />
      </div>
    </div>
  );
};

export default ResetPassword;
