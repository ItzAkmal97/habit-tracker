import React, { useState, useEffect, useRef } from "react";
import img from "../assets/habit.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { MessageSquareMore } from "lucide-react";
import { setIsLoggedIn } from "../features/authenticationSlice";
import { signOut } from "firebase/auth";
import { auth } from "../util/firebaseConfig";
import Modal from "./Modal";
import ModeToggle from "./themes/ModeToggle";
import GameGold from "./ui/GameGold";
import { RootState } from "../store/store";
import { getTotalGold, setTotalGold } from "@/features/rewardSlice";
import { User } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardHeader: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isModelOpen, setIsModelOpen] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { totalGold } = useSelector((state: RootState) => state.reward);

  const darkModeAccess = localStorage.getItem("darkModeAccess") === "true";
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
    const fetchTotalGold = async () => {
      try {
        const gold = await getTotalGold();
        if (gold !== null) dispatch(setTotalGold(gold));
      } catch (error) {
        console.error("Error fetching total gold:", error);
      }
    };

    fetchTotalGold();
  }, [dispatch, totalGold]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("username");
      localStorage.removeItem("email");
      localStorage.removeItem("photoURL");
      localStorage.removeItem("vite-ui-theme");
      localStorage.removeItem("darkModeAccess");
      dispatch(setIsLoggedIn(false));
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");

  return (
    <header className="flex justify-between items-center px-6 dark:bg-slate-800 border-b py-2">
      <img src={img} alt="Habit" className="w-36 md:w-48" />
      <div className="flex gap-4 items-center flex-row-reverse w-40 md:w-96">
        <ModeToggle />
        <button
          className="cursor-pointer focus:outline-none"
          onClick={handleDropdownToggle}
        >
          <User className="md:w-8 h-8" />
        </button>

        <GameGold gold={totalGold.toFixed(2)} />

        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute right-3 top-14 mt-2 w-48 dark:bg-gray-700 bg-white shadow-lg rounded-md z-10"
          >
            <ul className="rounded-md">
              <button
                onClick={() => setIsModelOpen(true)}
                className="w-full px-4 py-2 dark:hover:bg-gray-600 hover:bg-gray-100 text-start"
              >
                Profile
              </button>

              <li className="px-4 py-2 dark:hover:bg-gray-600 hover:bg-gray-100  cursor-pointer">
                <a href="mailto:muhammadakmal441@gmail.com">Contact support</a>
              </li>
              <li
                onClick={handleLogout}
                className="px-4 py-2 hover:bg-red-100 text-red-500 cursor-pointer hover:rounded-b-md"
              >
                Logout
              </li>
              {!darkModeAccess && (
                <>
                  <hr className="border-2 dark:border-gray-900" />
                  <li className="px-4 py-2 dark:hover:bg-gray-600 hover:bg-gray-100">
                    <Link to="/payment">
                      <button>Upgrade to Premium</button>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}

        <Modal
          isOpen={isModelOpen}
          onClose={() => setIsModelOpen(false)}
          title="Profile"
        >
          <ul>
            <li className="px-4 py-2 hover:bg-gray-100">
              Username: {username}
            </li>
            <li className="px-4 py-2 hover:bg-gray-100">Email: {email}</li>
          </ul>
        </Modal>
      </div>
    </header>
  );
};

export default DashboardHeader;
