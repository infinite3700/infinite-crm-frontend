import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Rocket, Sparkles, Clock, Star, Zap, Heart } from 'lucide-react';

const Dashboard = () => {
  const [currentIcon, setCurrentIcon] = useState(0);
  const [dots, setDots] = useState('');

  const icons = [Rocket, Sparkles, Zap, Star];

  useEffect(() => {
    // Animate icons rotation
    const iconInterval = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % icons.length);
    }, 2000);

    // Animate loading dots
    const dotsInterval = setInterval(() => {
      setDots((prev) => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => {
      clearInterval(iconInterval);
      clearInterval(dotsInterval);
    };
  }, [icons.length]);

  const CurrentIcon = icons[currentIcon];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
        {/* Floating Orbs */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full opacity-20 animate-float`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 80}px`,
              height: `${20 + Math.random() * 80}px`,
              background: `linear-gradient(45deg, ${
                ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'][i]
              }, ${['#1D4ED8', '#7C3AED', '#0891B2', '#059669', '#D97706', '#DC2626'][i]})`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
        
        {/* Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-60 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <Card className="relative z-10 w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
        <CardContent className="p-8 sm:p-12 text-center">
          {/* Animated Icon */}
          <div className="mb-8">
            <div className="relative inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-spin-slow opacity-20"></div>
              <div className="absolute inset-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
              <div className="relative z-10 p-4 sm:p-6 bg-white rounded-full shadow-lg">
                <CurrentIcon className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600 animate-bounce" />
              </div>
            </div>
          </div>

          {/* Main Title */}
          <div className="mb-6">
            <h1 className="text-3xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient">
                Dashboard
              </span>
            </h1>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">
              Coming Soon{dots}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              We're crafting an amazing dashboard experience with powerful analytics, 
              real-time insights, and beautiful visualizations.
            </p>
          </div>

          {/* Feature Preview */}
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: Sparkles, title: 'Analytics', desc: 'Real-time insights' },
                { icon: Zap, title: 'Performance', desc: 'Lightning fast' },
                { icon: Heart, title: 'Experience', desc: 'User-friendly' }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <feature.icon className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-800 text-sm">{feature.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600 font-medium">Development in Progress</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-progress"></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Design</span>
              <span>Development</span>
              <span>Testing</span>
              <span>Launch</span>
            </div>
          </div>

          {/* Call to Action */}
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Stay tuned for an incredible dashboard experience!
            </p>
            <div className="flex justify-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Floating Elements */}
      <div className="absolute top-10 left-10 w-6 h-6 bg-yellow-400 rounded-full opacity-60 animate-ping" />
      <div className="absolute top-20 right-20 w-4 h-4 bg-green-400 rounded-full opacity-60 animate-pulse" />
      <div className="absolute bottom-20 left-20 w-8 h-8 bg-pink-400 rounded-full opacity-40 animate-bounce" />
      <div className="absolute bottom-10 right-10 w-5 h-5 bg-purple-400 rounded-full opacity-50 animate-ping" />
    </div>
  );
};

export default Dashboard;