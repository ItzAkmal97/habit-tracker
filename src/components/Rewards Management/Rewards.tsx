import React from "react";
import { useState } from "react";
import { Input } from "../ui/input";
const Rewards: React.FC = () => {
    const [input, setInput] = useState<string>("");
  return (
    <div className="flex flex-col gap-4 m-4">
      <h1 className="text-start text-2xl text-black dark:text-white">
        Rewards
      </h1>
      <div className="flex flex-col gap-2 items-start bg-gray-200 dark:bg-gray-800 p-2 rounded-md">
        <div className="w-full rounded flex gap-2">
          <Input
            placeholder="Add a Habit"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter"}
            className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>
      </div>
    </div>
  );
};

export default Rewards;
