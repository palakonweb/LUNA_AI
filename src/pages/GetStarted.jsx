"use client";

import { SignInButton, SignUpButton, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function GetStarted() {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-yellow-200 px-4 relative overflow-hidden">
      {/* Background video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-20"
        >
          <source src="kaira.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Content */}
      <div className="z-10 flex flex-col items-center text-center space-y-6">
        <h1 className="text-3xl md:text-5xl font-extrabold drop-shadow-lg tracking-wide">
          Hello, I am <span className="text-yellow-400">Luna</span>, <br />
          your study buddy
        </h1>

        <p className="text-yellow-300 max-w-md text-sm md:text-base">
          Let’s make studying fun and easy with me by your side!
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full max-w-sm justify-center">
          {!isSignedIn ? (
            <>
              {/* Sign Up */}
              <SignUpButton mode="modal">
                <span className="flex-1 py-3 rounded-xl font-bold shadow-md border-2 border-yellow-300 bg-gradient-to-r from-yellow-200 to-yellow-400 text-black text-center cursor-pointer transition-transform duration-200 hover:scale-105 hover:from-yellow-300 hover:to-yellow-500 active:scale-95">
                  Sign Up
                </span>
              </SignUpButton>

              {/* Log In */}
              <SignInButton mode="modal">
                <span className="flex-1 py-3 rounded-xl font-bold shadow-md border-2 border-yellow-300 bg-gradient-to-r from-yellow-300 to-yellow-500 text-black text-center cursor-pointer transition-transform duration-200 hover:scale-105 hover:from-yellow-400 hover:to-yellow-600 active:scale-95">
                  Log In
                </span>
              </SignInButton>
            </>
          ) : (
            <button
              onClick={() => navigate("/dashboard")}
              className="flex-1 py-3 rounded-xl font-bold shadow-md border-2 border-yellow-300 bg-gradient-to-r from-yellow-300 to-yellow-500 text-black transition-transform duration-200 hover:scale-105 hover:from-yellow-400 hover:to-yellow-600 active:scale-95"
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
