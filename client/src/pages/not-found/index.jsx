import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  // Mouse Parallax Effect
  // Creates a "living" depth feel
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring animation to prevent jittery movement
  const mouseX = useSpring(x, { stiffness: 50, damping: 10 });
  const mouseY = useSpring(y, { stiffness: 50, damping: 10 });

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    const { innerWidth, innerHeight } = window;
    // Calculate relative position from -0.5 to 0.5
    x.set((clientX / innerWidth) - 0.5);
    y.set((clientY / innerHeight) - 0.5);
  };

  // Random witty quotes to reduce user frustration
  const quotes = [
    "It seems you've ventured into the void.",
    "This page has been abducted by aliens.",
    "404: Truth not found. Page not found either.",
    "Not all who wander are lost, but you definitely are.",
    "Houston, we have a problem."
  ];
  const [quote, setQuote] = useState("");

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  // Background Elements Parallax
  const bgX = useTransform(mouseX, [-0.5, 0.5], ["-20px", "20px"]);
  const bgY = useTransform(mouseY, [-0.5, 0.5], ["-20px", "20px"]);

  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-slate-950 flex items-center justify-center text-white selection:bg-purple-500 selection:text-white"
      onMouseMove={handleMouseMove}
    >
      {/* --- BACKGROUND LAYER: Aurora Gradients --- */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Blob 1 */}
        <motion.div 
          style={{ x: bgX, y: bgY }}
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[100px] mix-blend-screen" 
        />
        {/* Blob 2 */}
        <motion.div 
          style={{ x: useTransform(mouseX, [-0.5, 0.5], ["20px", "-20px"]), y: useTransform(mouseY, [-0.5, 0.5], ["20px", "-20px"]) }}
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen" 
        />
        {/* Noise Texture Overlay for "Film Grain" look */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      {/* --- MAIN CONTENT LAYER --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-2xl px-6 text-center"
      >
        {/* 404 Glitch Text Effect */}
        <motion.h1 
          className="text-[150px] md:text-[200px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 select-none font-sans"
          style={{
            textShadow: "0px 0px 40px rgba(168, 85, 247, 0.4)"
          }}
          animate={{
            textShadow: [
              "0px 0px 40px rgba(168, 85, 247, 0.4)",
              "4px 4px 0px rgba(236, 72, 153, 0.4)",
              "-4px -4px 0px rgba(59, 130, 246, 0.4)",
              "0px 0px 40px rgba(168, 85, 247, 0.4)"
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          404
        </motion.h1>

        {/* Message */}
        <div className="space-y-4 mb-10">
          <motion.h2 
            className="text-2xl md:text-4xl font-bold text-white/90"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Oops! Page not found.
          </motion.h2>
          <motion.p 
            className="text-slate-400 text-lg md:text-xl font-light max-w-lg mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {quote}
          </motion.p>
        </div>

        {/* Action Buttons: Glassmorphism Style */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <button 
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate('/');
              }
            }}
            className="group flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full backdrop-blur-md transition-all duration-300 w-full sm:w-auto justify-center cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Go Back</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-full shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 w-full sm:w-auto justify-center transform hover:-translate-y-1 cursor-pointer"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Return Home</span>
          </button>
        </motion.div>
      </motion.div>

      {/* --- DECORATIVE FOOTER --- */}
      <div className="absolute bottom-10 left-0 w-full text-center">
        <p className="text-white/20 text-sm font-mono tracking-widest uppercase">
          Error Code: NOT_FOUND_EXCEPTION
        </p>
      </div>
    </div>
  );
};

export default NotFound;