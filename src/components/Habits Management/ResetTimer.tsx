import React, { useState, useEffect } from "react";
import { differenceInSeconds, addDays, addWeeks, addMonths } from "date-fns";
import { ResetFrequency } from "../../features/habitsSlice";
import { Timer } from "lucide-react";

interface ResetTimerProps {
  resetFrequency?: ResetFrequency;
  lastResetDate?: string;
}

const ResetTimer: React.FC<ResetTimerProps> = ({
  resetFrequency,
  lastResetDate,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (!resetFrequency || !lastResetDate) return;

    const calculateRemainingTime = () => {
      const now = new Date();
      let nextResetDate;

      switch (resetFrequency) {
        case "Daily":
          nextResetDate = addDays(new Date(lastResetDate), 1);
          break;
        case "Weekly":
          nextResetDate = addWeeks(new Date(lastResetDate), 1);
          break;
        case "Monthly":
          nextResetDate = addMonths(new Date(lastResetDate), 1);
          break;
      }

      const remainingSeconds = Math.max(
        0,
        differenceInSeconds(nextResetDate, now)
      );
      setTimeRemaining(remainingSeconds);
    };

    calculateRemainingTime();
    const interval = setInterval(calculateRemainingTime, 1000);

    return () => clearInterval(interval);
  }, [resetFrequency, lastResetDate]);

  if (!resetFrequency) return null;

  const days = Math.floor(timeRemaining / 86400);
  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="flex flex-col gap-1 mt-2">
      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
        <Timer size={12} className="inline-block" />
        <span>
          {days < 1
            ? `${hours}h ${minutes}m ${seconds}s`
            : `${days}d ${hours % 24}h`}
        </span>
      </div>
    </div>
  );
};

export default ResetTimer;
