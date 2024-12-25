import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { toast } from 'sonner';
import { BADGESDATA } from './Data';
import { setBadges, xpBadge, levelBadge } from '../../features/badgeSlice';

export const useBadgeSystem = () => {
  const dispatch = useDispatch();
  const { xp, level } = useSelector((state: RootState) => state.xpLevel);
  const { badges } = useSelector((state: RootState) => state.badge);

  // Initialize badges from localStorage
  useEffect(() => {
    const savedBadges = localStorage.getItem('userBadges');
    if (savedBadges) {
      dispatch(setBadges(JSON.parse(savedBadges)));
    }
  }, [dispatch]);

  // Save badges to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userBadges', JSON.stringify(badges));
  }, [badges]);

  // Check for XP-based badges
  useEffect(() => {
    BADGESDATA.progression.forEach((badge) => {
      if (
        badge.xpRequired && 
        xp >= badge.xpRequired && 
        !badges.some((earnedBadge) => earnedBadge.id === badge.id)
      ) {
        dispatch(xpBadge({ requiredXp: badge.xpRequired }));
        toast.success('New Badge Unlocked!', {
          description: (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 border border-gray-700">
                <span className="text-lg">{badge.icon}</span>
              </div>
              <div>
                <p className="font-semibold">{badge.name}</p>
                <p className="text-sm text-gray-500">{badge.requirement}</p>
              </div>
            </div>
          ),
          duration: 5000,
        });
      }
    });
  }, [xp, badges, dispatch]);

  // Check for level-based badges
  useEffect(() => {
    BADGESDATA.progression.forEach((badge) => {
      if (
        badge.levelRequired && 
        level >= badge.levelRequired && 
        !badges.some((earnedBadge) => earnedBadge.id === badge.id)
      ) {
        dispatch(levelBadge({ levelRequired: badge.levelRequired }));
        toast.success('New Badge Unlocked!', {
          description: (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 border border-gray-700">
                <span className="text-lg">{badge.icon}</span>
              </div>
              <div>
                <p className="font-semibold">{badge.name}</p>
                <p className="text-sm text-gray-500">{badge.requirement}</p>
              </div>
            </div>
          ),
          duration: 5000,
        });
      }
    });
  }, [level, badges, dispatch]);

  return null;
};