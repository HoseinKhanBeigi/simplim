import React, { useState, useEffect } from 'react';
import useStore from '../../store/useStore';
import { useRouter } from 'next/navigation';

const AuthLayout = ({ onGuestMode }) => {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const { error, isLoading, login, register, setError, isAuthenticated } = useStore();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    // Auto-focus email input on mount
    const emailInput = document.getElementById('email');
    if (emailInput) emailInput.focus();
  }, [isSignUp, isResetPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (isResetPassword) {
        if (!email) {
          setError('Please enter your email address');
          return;
        }
        // TODO: Implement password reset
        setResetSent(true);
        return;
      }

      if (isSignUp) {
        if (!email || !username || !password) {
          setError('Please fill in all fields');
          return;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        console.log('Registration attempt with:', { email, username, password });
        await register(email, username, password);
      } else {
        // Handle login
        if (!username || !password) {
          setError('Please fill in all fields');
          return;
        }
        console.log('Login attempt with:', { username, password });
        await login(username, password);
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError(error.message || 'An error occurred. Please try again.');
    }
  };

  const resetForm = () => {
    setEmail('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setError(null);
    setResetSent(false);
  };

  const switchMode = (mode) => {
    resetForm();
    if (mode === 'reset') {
      setIsResetPassword(true);
      setIsSignUp(false);
    } else {
      setIsResetPassword(false);
      setIsSignUp(mode === 'signup');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full px-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">simplim</h1>
            <p className="text-gray-600">
              {isResetPassword
                ? 'Reset your password'
                : isSignUp
                ? 'Create your account'
                : 'Welcome back'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {resetSent ? (
              <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">
                Check your email for a reset link! The link will expire in 1 hour.
              </div>
            ) : (
              <>
                {isSignUp && (
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                      disabled={isLoading}
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={isLoading}
                  />
                </div>

                {!isResetPassword && (
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                      disabled={isLoading}
                    />
                  </div>
                )}

                {isSignUp && (
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                      disabled={isLoading}
                    />
                  </div>
                )}
              </>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : isResetPassword
                ? resetSent
                  ? 'Resend Reset Link'
                  : 'Send Reset Link'
                : isSignUp
                ? 'Sign Up'
                : 'Sign In'}
              </button>
            </div>

            {!resetSent && (
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => switchMode(isSignUp ? 'signin' : 'signup')}
                  className="text-sm text-blue-600 hover:text-blue-500"
                  disabled={isLoading}
                >
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                </button>
                {!isSignUp && !isResetPassword && (
                  <button
                    type="button"
                    onClick={() => switchMode('reset')}
                    className="text-sm text-blue-600 hover:text-blue-500"
                    disabled={isLoading}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
            )}

            {(isResetPassword || resetSent) && (
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className="w-full text-sm text-blue-600 hover:text-blue-500"
                disabled={isLoading}
              >
                Back to Sign In
              </button>
            )}

            {!isResetPassword && !resetSent && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onGuestMode}
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Continue as Guest
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      {/* Right Panel - Feature Preview */}
      <div className="hidden lg:flex flex-1 bg-gray-50 items-center justify-center relative">
        <div className="max-w-2xl w-full mx-8 rounded-lg overflow-hidden shadow-xl bg-white opacity-50">
          <div className="p-8">
            <div className="h-64 bg-gray-200 rounded-md mb-4" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
      </div>
    </div>
  );
};

export default AuthLayout; 