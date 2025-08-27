import { useState } from "react";
import { Link } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-[#A7EBF2] backdrop-blur-lg text-[#011C40] p-3 flex items-center justify-between shadow-md sticky top-0 z-50 rounded-b-xl">

      <h1 className="text-lg font-bold tracking-wide flex flex-col">
        LUNA
        <span className="font-medium text-sm text-[#26658C]">your study mate</span>
      </h1>

      <div className="hidden md:flex gap-5">
        {["/", "/dashboard", "/roadmap", "/quiz", "/notes"].map((path, idx) => {
          const name = ["Home", "Dashboard", "Roadmap", "Quiz", "Notes"][idx];
          return (
            <Link
              key={path}
              to={path}
              className="hover:underline hover:text-[#023859] transition-colors duration-200 font-medium"
            >
              {name}
            </Link>
          );
        })}
      </div>

      <div className="hidden md:flex items-center gap-3">
        {user && (
          <span className="text-sm font-medium text-[#011C40]/80">
            {user.fullName || user.primaryEmailAddress?.emailAddress}
          </span>
        )}
        <UserButton afterSignOutUrl="/" />
      </div>

      <button
        className="md:hidden p-2 bg-[#54ACBF]/30 rounded-xl shadow-md z-50 hover:bg-[#54ACBF]/50 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      <div
        className={`absolute top-full left-0 w-full bg-[#A7EBF2]/95 backdrop-blur-lg border-t border-[#023859]/20 shadow-lg z-40 transition-transform duration-300 origin-top ${
          isOpen ? "scale-y-100" : "scale-y-0"
        } rounded-b-xl`}
      >
        <div className="flex flex-col items-center gap-4 py-6 text-[#011C40] font-medium">
          {["/", "/dashboard", "/roadmap", "/quiz", "/notes"].map((path, idx) => {
            const name = ["Home", "Dashboard", "Roadmap", "Quiz", "Notes"][idx];
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setIsOpen(false)}
                className="hover:underline hover:text-[#26658C] transition-colors duration-200"
              >
                {name}
              </Link>
            );
          })}

          {user && (
            <span className="text-sm mt-4 border-t border-[#023859]/20 pt-2 text-[#011C40]">
              {user.fullName || user.primaryEmailAddress?.emailAddress}
            </span>
          )}
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </nav>
  );
}
