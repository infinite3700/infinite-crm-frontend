import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, selectIsAuthenticated, selectAuthLoading, selectAuthError } from '../store/authSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { FormInput } from '../components/ui/form-input';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bubble-bg flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 relative overflow-hidden">
      {/* Morphing background layer */}
      <div className="morphing-bg"></div>
      
      {/* Magnetic fields */}
      <div className="magnetic-field" style={{ top: '10%', left: '5%' }}></div>
      <div className="magnetic-field" style={{ bottom: '15%', right: '8%' }}></div>
      <div className="hidden lg:block magnetic-field" style={{ top: '60%', left: '80%', width: '200px', height: '200px' }}></div>
      
      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <div 
          key={`particle-${i}`}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${6 + Math.random() * 4}s`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`
          }}
        ></div>
      ))}

      {/* Enhanced Floating Bubbles */}
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      
      {/* Enhanced Decorative Elements */}
      <div className="absolute top-16 sm:top-20 left-6 sm:left-10 lg:left-20 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white/10 rounded-full blur-sm floating-element"></div>
      <div className="absolute top-32 sm:top-40 lg:top-52 right-6 sm:right-20 lg:right-32 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-purple-300/20 rounded-full blur-md floating-element" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-24 sm:bottom-32 lg:bottom-40 left-1/4 lg:left-1/3 w-14 h-14 sm:w-20 sm:h-20 lg:w-28 lg:h-28 bg-blue-300/20 rounded-full blur-lg floating-element" style={{animationDelay: '4s'}}></div>
      <div className="hidden lg:block absolute top-1/3 left-10 w-6 h-6 bg-indigo-300/30 rounded-full blur-sm floating-element" style={{animationDelay: '1s'}}></div>
      <div className="hidden xl:block absolute bottom-1/3 right-16 w-10 h-10 bg-cyan-300/25 rounded-full blur-md floating-element" style={{animationDelay: '3s'}}></div>
      
      {/* Geometric Shapes */}
      <div className="geometric-shape triangle-1 top-24 left-1/3" style={{animationDelay: '1s'}}></div>
      <div className="geometric-shape triangle-2 bottom-32 right-1/4" style={{animationDelay: '3s'}}></div>
      <div className="geometric-shape diamond top-1/2 left-12" style={{animationDelay: '2s'}}></div>
      <div className="geometric-shape diamond bottom-1/4 right-20" style={{animationDelay: '4s'}}></div>
      <div className="hidden lg:block geometric-shape triangle-1 top-3/4 left-3/4" style={{animationDelay: '5s'}}></div>
      <div className="hidden xl:block geometric-shape diamond top-16 right-1/3" style={{animationDelay: '0.5s'}}></div>
      
      <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md relative z-10">
        <Card className="login-card neon-glow shadow-2xl border-0 overflow-hidden">
          <CardHeader className="text-center pb-3 px-4 sm:px-6 pt-6">
            <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg floating-element">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-sm sm:text-base lg:text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-600 text-sm">
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 px-4 sm:px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Display */}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm animate-fade-in">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Form Fields Container */}
              <div className="space-y-4">
                {/* Email Field */}
                <FormInput
                  id="email"
                  type="email"
                  label="Email Address"
                  placeholder="demo@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={Mail}
                  iconPosition="left"
                  required
                />

                {/* Password Field */}
                <FormInput
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={Lock}
                  iconPosition="left"
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                  required
                />
              </div>

              {/* Remember Me & Forgot Password */}
              {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3 h-3" />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-blue-600 hover:text-purple-600 hover:underline font-medium transition-colors">
                  Forgot password?
                </a>
              </div> */}

              {/* Submit Button */}
              <Button
                type="submit"
                className="enhanced-button pulse-on-hover w-full h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] text-sm"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Demo Credentials and Footer Container */}
            <div className="space-y-4 mt-6">
              {/* Demo Credentials */}
              {/* <div className="p-3 bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-lg border border-blue-200/50">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <p className="text-xs font-semibold text-blue-800">Demo Credentials</p>
                </div>
                <div className="text-xs text-blue-700 space-y-1">
                  <p><span className="font-medium">Email:</span> demo@example.com</p>
                  <p><span className="font-medium">Password:</span> demo</p>
                </div>
              </div> */}

              {/* Footer */}
              <div className="text-center">
                <p className="text-xs text-gray-600">
                  Don't have an account?{' '}
                  <a href="#" className="text-blue-600 hover:text-purple-600 font-semibold hover:underline transition-colors">
                    Contact Administrator
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;