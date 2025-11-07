'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {

  useEffect(() => {
    console.error('App Error:', error);
  }, [error]);

  return (
    <main className="h-full flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-lg rounded-xl p-6 md:p-8 max-w-md w-full text-center border border-gray-600"
      >
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold text-red-600"
        >
          Something went wrong!
        </motion.h1>

        <p className="text-gray-600 mt-2">
          Don't worry — this can be fixed. Try again or refresh.
        </p>

        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => window.location.reload()}
          className="mt-6 bg-red-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-red-700 transition"
        >
          Try Again
        </motion.button>
      </motion.div>
    </main>
  );
}

