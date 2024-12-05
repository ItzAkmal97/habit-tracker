import React, { useState, useEffect, useRef } from "react";
import img from "../assets/habit.png";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MessageSquareMore } from "lucide-react";
import { setIsLoggedIn } from "../features/authenticationSlice";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../util/firebaseConfig";
import { RootState } from "../store/store";

const DashboardHeader: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const { username, email } = useSelector(
    (State: RootState) => State.firebaseDb
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {})
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        dispatch(setIsLoggedIn(false));
        navigate("/login", { replace: true });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch, navigate]);

  return (
    <header className="flex justify-between items-center px-6 bg-gold py-2">
      <img src={img} alt="Habit" className="w-48" />
      <div className="flex gap-6 items-center flex-row-reverse">
        <button
          className="cursor-pointer focus:outline-none"
          onClick={handleDropdownToggle}
        >
          <User className="w-8 h-8" />
        </button>

        <button>
          <MessageSquareMore className="w-8 h-8" />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute right-3 top-14 mt-2 w-48 bg-white shadow-lg rounded-md z-10"
          >
            <ul className="rounded-md">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                {username}
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                {email}
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                <a href="mailto:muhammadakmal441@gmail.com">Contact support</a>
              </li>
              <li
                onClick={handleLogout}
                className="px-4 py-2 hover:bg-red-100 text-red-500 cursor-pointer hover:rounded-b-md"
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
