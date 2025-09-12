import { motion } from "framer-motion";

export const MotionWrapper = ({ children, className = "", ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);
