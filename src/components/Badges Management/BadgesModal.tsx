import React from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface Badge {
  id: string;
  name: string;
  icon: string;
  requirement: string;
  xpRequired?: number;
  levelRequired?: number;
  time?: string;
}

interface BadgesModalProps {
  totalBadges: Badge[];
}

const BadgesModal: React.FC<BadgesModalProps> = ({ totalBadges }) => {
  const { badges } = useSelector((state: RootState) => state.badge);

  const isBadgeEarned = (badgeId: string) => {
    return badges.some((badge) => badge.id === badgeId);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800/50 rounded-lg">
      <p>
        {badges.length} out of {totalBadges.length} badges earned
      </p>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default">View Badges</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Badges</DialogTitle>
            <Separator />
            <DialogDescription>
              <ScrollArea className="w-full h-96 pr-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-4">
                  {totalBadges.map((badge) => {
                    const earned = isBadgeEarned(badge.id);
                    return (
                      <TooltipProvider key={badge.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-colors cursor-pointer ${earned ? "bg-gray-800/10 dark:bg-gray-700/30" : "opacity-40 grayscale" }`}
                            >
                              <div
                                className={`w-12 h-12 flex items-center justify-center rounded-full ${ earned ? "bg-gray-800 border-2 border-gray-700 shadow-lg" : "bg-gray-600 border border-gray-500" }`}
                              >
                                <span
                                  className={`text-xl ${ earned && "animate-pulse" }`}
                                >
                                  {badge.icon}
                                </span>
                              </div>
                              <span
                                className={`text-sm text-center ${
                                  earned
                                    ? "text-gray-300 font-medium"
                                    : "text-gray-400"
                                }`}
                              >
                                {badge.name}
                              </span>
                              {/* {earned && (
                                <span className="text-xl text-green-500">
                                  ✅
                                </span>
                              )} */}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-sm">
                              {earned ? "Completed: " : ""}
                              {badge.name} - {badge.requirement}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </div>
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BadgesModal;
