import img from "../assets/habit.png";
import { NavLink } from "react-router-dom";
function LandingPageHeader() {
  return (
    <header className="flex justify-between items-center px-4 py- bg-[#F5E7B4]">
      <img src={img} alt="Habit" className="w-56" />
      <NavLink to="/login">
        <button
          type="button"
          className="w-20 bg-[#FE3810] text-[#F5E7B4] font-semibold py-2 px-4 rounded-md hover:bg-red-900 hover:text-[#F5E7B4] duration-500 ease-in-out"
        >
          Login
        </button>
      </NavLink>
    </header>
  );
}

export default LandingPageHeader;
