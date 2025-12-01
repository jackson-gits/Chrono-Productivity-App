import { useState } from 'react';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import Logo from "../assets/logoslo.png";

interface LoginScreenProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
  isLoading?: boolean;
}

export function LoginScreen({ onLogin, onSignUp, isLoading = false }: LoginScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setIsSubmitting(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setIsSubmitting(false);
          return;
        }
        await onSignUp(email, password);
      } else {
        await onLogin(email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* Branding */}
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-8 text-center">

            <div className="flex justify-center mb-6">
              <div
                className="
                  w-40 h-
                  rounded-2xl
                  overflow-hidden 
                  shadow-[0_8px_20px_rgba(0,0,0,0.12)]
                  border border-[#D6B59C]
                  transform transition-all
                  hover:scale-105 hover:shadow-[0_12px_30px_rgba(0,0,0,0.18)]
                  bg-amber-50
                "
              >
                <img
                  src={Logo}
                  alt="Chrono Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <h1 className="text-2xl font-bold tracking-wide" style={{ color: "#4B2E23" }}>
              Chrono
            </h1>
            <p className="mt-1" style={{ color: "#4B2E23" }}>
              Master your time with clarity
            </p>
          </div>

          {/* Form */}
          <div className="p-8">

            {/* Toggle */}
            <div className="flex gap-2 mb-6 bg-amber-100 p-1 rounded-lg">
              <button
                onClick={() => {
                  setIsSignUp(false);
                  setError('');
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                }}
                className={`flex-1 py-2 px-4 rounded font-medium transition ${
                  !isSignUp ? 'bg-white text-[#4B2E23] shadow-sm' : 'text-[#4B2E23]'
                }`}
              >
                Sign In
              </button>

              <button
                onClick={() => {
                  setIsSignUp(true);
                  setError('');
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                }}
                className={`flex-1 py-2 px-4 rounded font-medium transition ${
                  isSignUp ? 'bg-white text-[#4B2E23] shadow-sm' : 'text-[#4B2E23]'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Error */}
              {error && (
                <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#4B2E23" }}>
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                    style={{ color: "#4B2E23" }}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    disabled={isSubmitting || isLoading}
                    className="w-full pl-10 pr-4 py-2.5 border border-[#B08A76] rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-[#4B2E23] 
                    disabled:bg-amber-50 disabled:text-amber-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#4B2E23" }}>
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                    style={{ color: "#4B2E23" }}
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={isSubmitting || isLoading}
                    className="w-full pl-10 pr-4 py-2.5 border border-[#B08A76] rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-[#4B2E23] 
                    disabled:bg-amber-50 disabled:text-amber-500"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#4B2E23" }}>
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                      style={{ color: "#4B2E23" }}
                    />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      disabled={isSubmitting || isLoading}
                      className="w-full pl-10 pr-4 py-2.5 border border-[#B08A76] rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-[#4B2E23]"
                    />
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full bg-[#4B2E23] hover:bg-[#3C241B] text-white font-semibold py-2.5 
                rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed 
                flex items-center justify-center gap-2 mt-6"
              >
                {isSubmitting || isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    {isSignUp ? 'Create Account' : 'Sign In'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Switch */}
            <p className="text-center text-sm mt-6" style={{ color: "#4B2E23" }}>
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="font-semibold"
                style={{ color: "#4B2E23" }}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "#4B2E23" }}>
          © 2025 Chrono. All rights reserved.
        </p>
      </div>
    </div>
  );
}
