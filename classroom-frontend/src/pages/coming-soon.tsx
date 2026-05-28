import React from 'react';
import { motion } from 'framer-motion';
import { Construction, ArrowLeft, Timer, Map as MapIcon, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';

const ComingSoon: React.FC<{ featureName?: string }> = ({ featureName = "Campus Map" }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-white border-4 border-black rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12 relative overflow-hidden"
      >
        {/* Background Decorative Elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#F4CE14] rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400 rounded-full opacity-10 blur-3xl" />
        
        {/* Icon */}
        <motion.div
          animate={{ 
            rotate: [0, -10, 10, -10, 0],
            scale: [1, 1.1, 1, 1.1, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 5,
            ease: "easeInOut"
          }}
          className="inline-flex items-center justify-center w-24 h-24 bg-[#F4CE14] border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-8"
        >
          <Construction size={48} className="text-black" />
        </motion.div>

        {/* Text Content */}
        <h1 className="text-4xl md:text-5xl font-black text-black mb-4 uppercase tracking-tight">
          Under <span className="text-[#F4CE14] stroke-black" style={{ WebkitTextStroke: '2px black' }}>Construction</span>
        </h1>
        
        <p className="text-xl font-bold text-gray-700 mb-8 max-w-md mx-auto leading-relaxed">
          We're building something amazing! The <span className="text-black underline decoration-[#F4CE14] decoration-4 underline-offset-4">{featureName}</span> is currently getting a major upgrade.
        </p>

        {/* Feature Preview Card */}
        <div className="bg-gray-50 border-2 border-black rounded-2xl p-6 mb-10 text-left relative">
            <div className="absolute -top-3 -right-3 bg-black text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">
                Coming Q3 2026
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                <Sparkles size={14} /> Planned Features
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                    "Interactive 3D Navigation",
                    "Real-time Room Availability",
                    "Augmented Reality Pathfinding",
                    "Event Heatmaps"
                ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm font-bold text-gray-800">
                        <div className="w-2 h-2 bg-[#F4CE14] border border-black rounded-full" />
                        {item}
                    </li>
                ))}
            </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate(-1)}
            variant="outline"
            className="border-2 border-black hover:bg-gray-100 font-black px-8 py-6 h-auto text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all"
          >
            <ArrowLeft className="mr-2" /> Go Back
          </Button>
          <Button 
            onClick={() => navigate('/')}
            className="bg-black text-white hover:bg-gray-800 font-black px-8 py-6 h-auto text-lg shadow-[4px_4px_0px_0px_rgba(244,206,20,1)] hover:shadow-none transition-all border-2 border-black"
          >
            Return Home
          </Button>
        </div>

        {/* Progress indicator */}
        <div className="mt-12 pt-8 border-t-2 border-dashed border-gray-200">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-black uppercase text-gray-400">Development Progress</span>
                <span className="text-xs font-black text-black">65%</span>
            </div>
            <div className="w-full h-4 bg-gray-100 border-2 border-black rounded-full overflow-hidden p-0.5">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-[#F4CE14] rounded-full border-r-2 border-black"
                />
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ComingSoon;
