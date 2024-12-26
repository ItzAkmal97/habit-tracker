import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { toast } from "sonner";
import { BADGESDATA } from "./Data";
import { setBadges, xpBadge, levelBadge, addBadge } from "../../features/badgeSlice";
import {
  fetchUserBadges,
  saveUserBadges,
} from "../../components/Badges Management/badgeService";

export const useBadgeSystem = () => {
  const dispatch = useDispatch();
  const { totalXp, level } = useSelector((state: RootState) => state.xpLevel);
  const { badges } = useSelector((state: RootState) => state.badge);
  const userEmail = localStorage.getItem("email");
  const initialLoadComplete = useRef(false);

  useEffect(() => {
    const initializeBadges = async () => {
      if (!userEmail) return;
      try {
        const savedBadges = await fetchUserBadges(userEmail);
        dispatch(setBadges(savedBadges));
        initialLoadComplete.current = true;
      } catch (error) {
        console.error("Failed to fetch user badges:", error);
        toast.error("Failed to load badges. Please try again later.");
      }
    };

    initializeBadges();
  }, [dispatch, userEmail]);

  useEffect(() => {
    if (!userEmail || !initialLoadComplete.current) return;
    saveUserBadges(userEmail, badges);
  }, [badges, userEmail]);

  useEffect(() => {
    if (!initialLoadComplete.current) return;

    BADGESDATA.progression.forEach((badge) => {
      if (
        badge.xpRequired &&
        totalXp >= badge.xpRequired &&
        !badges.some((earnedBadge) => earnedBadge.id === badge.id)
      ) {
        dispatch(xpBadge({ requiredXp: badge.xpRequired }));
        toast.success("New Badge Unlocked!", {
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
  }, [totalXp, badges, dispatch]);

  useEffect(() => {
    if (!initialLoadComplete.current) return;

    BADGESDATA.progression.forEach((badge) => {
      if (
        badge.levelRequired &&
        level >= badge.levelRequired &&
        !badges.some((earnedBadge) => earnedBadge.id === badge.id)
      ) {
        dispatch(levelBadge({ levelRequired: badge.levelRequired }));
        toast.success("New Badge Unlocked!", {
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

  useEffect(() => {
    if (!initialLoadComplete.current) return;

    // Get all progression badges except the Habit King badge
    const regularBadges = BADGESDATA.progression.filter(badge => badge.id !== 'habit-king');
    const habitKingBadge = BADGESDATA.progression.find(badge => badge.id === 'habit-king');
    
    // Check if user has earned all regular badges
    const hasAllRegularBadges = regularBadges.every(badge => 
      badges.some(earnedBadge => earnedBadge.id === badge.id)
    );

    // Check if user doesn't already have the Habit King badge
    const hasHabitKingBadge = badges.some(badge => badge.id === 'habit-king');

    // If all regular badges are earned and Habit King isn't earned yet, award it
    if (hasAllRegularBadges && !hasHabitKingBadge && habitKingBadge) {
      dispatch(addBadge(habitKingBadge));
      toast.success("Congratulations! Final Badge Unlocked!", {
        description: (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 border border-gray-700">
              <span className="text-lg">{habitKingBadge.icon}</span>
            </div>
            <div>
              <p className="font-semibold">{habitKingBadge.name}</p>
              <p className="text-sm text-gray-500">{habitKingBadge.requirement}</p>
            </div>
          </div>
        ),
        duration: 7000, // Longer duration for this special achievement
      });
    }

    
  }, [badges, dispatch]);

  return null;
};
