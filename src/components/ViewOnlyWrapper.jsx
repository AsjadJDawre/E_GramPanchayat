// ViewOnlyWrapper.jsx
import React from 'react';
import { motion } from 'framer-motion';

const ViewOnlyWrapper = ({ children }) => {
  return (
    <div className="relative">
      {children}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center pointer-events-none"
      >
        <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
          View Only Mode
        </div>
      </motion.div>
    </div>
  );
};

export default ViewOnlyWrapper;