/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import "../styles/animation.css";

const UniverseBackground: React.FC = () => {
  const [shootingStars, setShootingStars] = useState<any[]>([]);
  const [nebulaClouds, setNebulaClouds] = useState<any[]>([]);

  // Shooting stars
  useEffect(() => {
    const interval = setInterval(() => {
      const newStar = {
        id: Math.random(),
        startX: Math.random() * window.innerWidth,
        startY: Math.random() * 200,
        duration: Math.random() * 3 + 2,
      };
      setShootingStars((prev) => [...prev, newStar]);

      setTimeout(() => {
        setShootingStars((prev) =>
          prev.filter((star) => star.id !== newStar.id)
        );
      }, newStar.duration * 1000);
    }, Math.random() * 4000 + 2000);

    return () => clearInterval(interval);
  }, []);

  // Nebula
  useEffect(() => {
    const clouds = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 300 + 150,
      opacity: Math.random() * 0.3 + 0.1,
      hue: Math.random() * 60 + 240,
      duration: Math.random() * 20 + 30,
    }));
    setNebulaClouds(clouds);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      {/*  Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-zinc-900 to-black"></div>

      {/* Nebula overlays */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-radial from-green-800/20 via-transparent to-transparent opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-radial from-blue-600/15 via-transparent to-transparent opacity-40 transform scale-150"></div>
        <div className="absolute inset-0 bg-gradient-radial from-green-600/10 via-transparent to-transparent opacity-30 transform scale-75"></div>
      </div>

      {/* 🌟 Nebula Clouds */}
      {nebulaClouds.map((cloud) => (
        <div
          key={cloud.id}
          className="absolute rounded-full blur-3xl animate-pulse"
          style={{
            left: `${cloud.x}%`,
            top: `${cloud.y}%`,
            width: `${cloud.size}px`,
            height: `${cloud.size}px`,
            background: `radial-gradient(circle, hsl(${cloud.hue}, 70%, 50%) 0%, transparent 70%)`,
            opacity: cloud.opacity,
            animation: `float ${cloud.duration}s ease-in-out infinite alternate, glow 4s ease-in-out infinite`,
          }}
        />
      ))}

      {/* ⭐ Stars */}
     {/* ⭐ Stars */}
<div className="absolute inset-0">
  {Array.from({ length: 200 }, (_, i) => (
    <div
      key={i}
      className="absolute bg-white rounded-full"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${Math.random() * 2 + 0.5}px`,
        height: `${Math.random() * 2 + 0.5}px`,
        opacity: 0.8,
        animation: `twinkle 2000s ease-in-out infinite`,
        animationDelay: `3000s`,
      }}
    />
  ))}
</div>


      {/* 🌠 Shooting Stars */}
      {shootingStars.map((star) => (
        <div
          key={star.id}
          className="absolute w-2 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent rounded-full"
          style={{
            left: `${star.startX}px`,
            top: `${star.startY}px`,
            transform: "rotate(45deg)",
            animation: `shoot ${star.duration}s ease-out forwards`,
          }}
        />
      ))}
      
    </div>
    
  );
};

export default UniverseBackground;
