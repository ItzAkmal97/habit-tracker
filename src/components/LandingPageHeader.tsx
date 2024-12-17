import img from "../assets/habit.png";
import { NavLink } from "react-router-dom";
import { Button } from "./ui/button";
function LandingPageHeader() {
  return (
    <header className="flex justify-between items-center px-4 border-b border-gray-300 dark:border-gray-700">
      <img
        src={img}
        alt="Habit"
        className="w-44 md:w-56 dark:filter dark:brightness-90"
      />
      <NavLink to="/login">
        <Button
          type="button"
          className="font-semibold py-2 px-4 dark:bg-red-600 dark:text-white dark:hover:bg-red-700"
          variant="destructive"
          size="default"
        >
          Login
        </Button>
      </NavLink>
    </header>
  );
}

export default LandingPageHeader;
