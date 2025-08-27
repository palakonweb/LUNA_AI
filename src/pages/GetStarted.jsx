"use client";

import { SignInButton, SignUpButton, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function GetStarted() {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#011C40] via-[#023859] to-[#26658C] text-white px-6 relative overflow-hidden">
      {/* Background Video with Overlay */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-30"
        >
          <source src="kaira.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Main Content */}
      <div className="z-10 flex flex-col items-center text-center space-y-8 max-w-2xl">
        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-wide drop-shadow-lg">
          Hello, I am{" "}
          <span className="text-[#54ACBF]">Luna</span> <br />
          <span className="text-white">your study buddy</span>
        </h1>

        {/* Subtext */}
        <p className="text-white/90 max-w-lg text-base md:text-lg leading-relaxed">
          Let’s make studying <span className="text-[#A7EBF2] font-semibold">fun</span> and{" "}
          <span className="text-[#A7EBF2] font-semibold">easy</span> with me by your side!
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm justify-center">
          {!isSignedIn ? (
            <>
              {/* Sign Up */}
              <SignUpButton mode="modal">
                <span className="flex-1 py-3 rounded-xl font-semibold shadow-lg border border-[#54ACBF] bg-[#011C40] text-white text-center cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-[#023859] active:scale-95">
                  Sign Up
                </span>
              </SignUpButton>

              {/* Log In */}
              <SignInButton mode="modal">
                <span className="flex-1 py-3 rounded-xl font-semibold shadow-lg border border-[#54ACBF] bg-[#54ACBF] text-[#011C40] text-center cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-[#26658C] hover:text-white active:scale-95">
                  Log In
                </span>
              </SignInButton>
            </>
          ) : (
            <button
              onClick={() => navigate("/dashboard")}
              className="flex-1 py-3 rounded-xl font-semibold shadow-lg border border-[#54ACBF] bg-[#54ACBF] text-[#011C40] transition-transform duration-200 hover:scale-105 hover:bg-[#26658C] hover:text-white active:scale-95"
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
