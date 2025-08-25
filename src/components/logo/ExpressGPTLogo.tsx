import React from "react";

interface ExpressGPTLogoProps {
  size?: number; // size of the abstract symbol
  textClassName?: string; // tailwind classes for text
  className?: string; // wrapper div classes
  withText?: boolean; // toggle text visibility
}

const ExpressGPTLogo: React.FC<ExpressGPTLogoProps> = ({
  size = 56,
  textClassName = "text-3xl font-extrabold tracking-wide",
  className = "flex items-center ",
  withText = true,
}) => {
  return (
    <div className={className}>
      <img src="/logo.png" className={`w-${size} h-${size}`} alt="logo" />

      {/* Text */}
      {withText && (
        <span className={`${textClassName} text-green-500`}>ExpressGPT</span>
      )}
    </div>
  );
};

export default ExpressGPTLogo;
