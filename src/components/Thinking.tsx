import { motion } from "framer-motion";

const Thinking = () => {
  return (
    <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
      <span>Thinking</span>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 bg-blue-500 rounded-full"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{
              repeat: Infinity,
              duration: 1,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Thinking;
