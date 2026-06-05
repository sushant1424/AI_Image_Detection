import React from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';

export const PageWrapper = ({
  children,
  className = '',
  animate = true,
  maxWidth = 'max-w-7xl'
}) => {
  const content = animate ? (
    <motion.main
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex-1 w-full ${maxWidth} mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}
    >
      {children}
    </motion.main>
  ) : (
    <main className={`flex-1 w-full ${maxWidth} mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
      {children}
    </main>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background text-text">
      <Navbar />
      {content}
      <Footer />
    </div>
  );
};

export default PageWrapper;
