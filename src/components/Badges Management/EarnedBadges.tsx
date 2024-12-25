import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

const EarnedBadges: React.FC = () => {
  const { badges } = useSelector((state: RootState) => state.badge);

  if (badges.length === 0) return null;

  return (
    <div>
      {badges.map((badge) => (
        <TooltipProvider key={badge.id}>
          <Tooltip>
            <TooltipTrigger>
              <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-800 border border-gray-700">
                <span className="text-sm">{badge.icon}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">{badge.name} - {badge.requirement}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

export default EarnedBadges;