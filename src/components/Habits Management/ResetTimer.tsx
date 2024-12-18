import React, { useState, useEffect } from 'react';
import { differenceInSeconds, addDays, addWeeks, addMonths } from 'date-fns';
import { ResetFrequency } from '../../features/habitsSlice';
interface ResetTimerProps {
  resetFrequency?: ResetFrequency;
  lastResetDate?: string;
}

const ResetTimer: React.FC<ResetTimerProps> = ({ 
  resetFrequency, 
  lastResetDate 
}) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  useEffect(() => {
    if (!resetFrequency || !lastResetDate) return;

    const calculateRemainingTime = () => {
      const now = new Date();
      let nextResetDate;

      switch (resetFrequency) {
        case 'Daily':
          nextResetDate = addDays(new Date(lastResetDate), 1);
          break;
        case 'Weekly':
          nextResetDate = addWeeks(new Date(lastResetDate), 1);
          break;
        case 'Monthly':
          nextResetDate = addMonths(new Date(lastResetDate), 1);
          break;
      }

      const remainingSeconds = Math.max(0, differenceInSeconds(nextResetDate, now));
      setTimeRemaining(remainingSeconds);

      // Set total duration for progress calculation
      const totalSeconds = {
        'Daily': 24 * 60 * 60,
        'Weekly': 7 * 24 * 60 * 60,
        'Monthly': 30 * 24 * 60 * 60
      }[resetFrequency];

      setTotalDuration(totalSeconds);
    };

    calculateRemainingTime();
    const interval = setInterval(calculateRemainingTime, 1000);

    return () => clearInterval(interval);
  }, [resetFrequency, lastResetDate]);

  if (!resetFrequency) return null;

  const progressPercentage = 100 - ((timeRemaining / totalDuration) * 100);
  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
      <div 
        className="bg-white h-2.5 rounded-full" 
        style={{ width: `${progressPercentage}%` }}
      />
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {`Reset in: ${hours}h ${minutes}m ${seconds}s`}
      </div>
    </div>
  );
};

export default ResetTimer;