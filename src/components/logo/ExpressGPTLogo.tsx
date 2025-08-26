import React from "react";

interface ExpressGPTLogoProps {
  size?: number; // size of the abstract symbol
  textClassName?: string; // tailwind classes for text
  className?: string; // wrapper div classes
  withText?: boolean; // toggle text visibility
}

const ExpressGPTLogo: React.FC<ExpressGPTLogoProps> = ({
  size = 56,
  textClassName = "font-semibold text-white text-lg mb-1",
  className = "flex items-center space-x-3",
  withText = true,
}) => {
  return (
    <div className={className}>
      <img src="/logo.png" width={size} height={size} alt="logo" />

      {/* Text */}
      {withText && (
        <span className={`${textClassName} text-green-500`}>ExpressGPT</span>
      )}
    </div>
  );
};

export default ExpressGPTLogo;
