/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useState } from "react";
import orbixLogo from "../../../public/OrbixLogo.jpg";

const Navbar = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const handleConnectWallet = () => {
    // Mock wallet connection
    setIsWalletConnected(!isWalletConnected);
  };


  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.nav
      className="relative z-50 bg-white border-b border-gray-100"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section - Logo */}
          <motion.div
            className="flex items-center"
            variants={itemVariants}
          >
            <img src={orbixLogo} alt="Orbix Logo" className="h-6" />
            
          </motion.div>

          {/* Right Section - Connect Wallet Button */}
          <motion.button
            onClick={handleConnectWallet}
            className=" bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            variants={itemVariants}
          >
            {isWalletConnected ? (
              <>
                <span>Connected</span>
              </>
            ) : (
              <span>Connect Wallet</span>
            )}
          </motion.button>
        </div>

      </div>
    </motion.nav>
  );
};

export default Navbar;
