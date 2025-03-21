
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

const ResetPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { loading, resetPassword } = useAuth();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    try {
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Password reset error:', error);
    }
  };

  return (
    <div className="space-y-6">
      {!isSubmitted ? (
        <>
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold mb-2">Reset Your Password</h1>
            <p className="text-gray-400 text-sm">
              Enter your email and we'll send you instructions to reset your password
            </p>
          </div>
          
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="reset-email" className="block text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <Input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="bg-[#1B203A] border-[#2A3052] pl-10 pr-4 py-2 w-full rounded-md"
                />
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={loading || !email}
              className="bg-green-500 text-white hover:bg-green-600 w-full py-2 rounded-md font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <>
                  Send Reset Instructions
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </>
      ) : (
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-500 mb-2">
            <Mail size={32} />
          </div>
          <h1 className="text-xl font-semibold">Check Your Email</h1>
          <p className="text-gray-400 text-sm">
            We've sent password reset instructions to<br />
            <span className="text-white font-medium mt-1 block">{email}</span>
          </p>
          <div className="pt-4">
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-gray-400 hover:text-white flex items-center justify-center gap-2 mx-auto"
            >
              <ArrowLeft size={16} />
              Try a different email
            </button>
          </div>
        </div>
      )}
      <div className="text-center mt-6">
        <Link 
          to="/auth"
          className="text-green-500 hover:text-green-400 text-sm flex items-center justify-center gap-1"
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
