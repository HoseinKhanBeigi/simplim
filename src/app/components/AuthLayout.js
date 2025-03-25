import React, { useState, useEffect } from 'react';

const AuthLayout = ({ onLogin, onGuestMode }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    // Auto-focus email input on mount
    const emailInput = document.getElementById('email');
    if (emailInput) emailInput.focus();
  }, [isSignUp, isResetPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isResetPassword) {
      if (!email) {
        setError('Please enter your email address');
        return;
      }
      // TODO: Implement password reset
      setResetSent(true);
      return;
    }

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (isSignUp) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      // Handle sign up logic
    }

    onLogin({ email, password });
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">PDF Highlighter</h1>
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
                    />
                  </div>
                )}
              </>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isResetPassword
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
                >
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                </button>
                {!isSignUp && !isResetPassword && (
                  <button
                    type="button"
                    onClick={() => switchMode('reset')}
                    className="text-sm text-blue-600 hover:text-blue-500"
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
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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