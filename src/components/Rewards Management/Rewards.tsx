import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { Reorder } from "framer-motion";
import {
  addRewards,
  setRewards,
  Reward,
  deleteRewards,
} from "../../features/rewardSlice";
import { db } from "../../util/firebaseConfig";
import {
  doc,
  collection,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useAuth } from "../../util/useAuth";
import Loading from "../Loading";
import { RootState } from "../../store/store";
import { Input } from "../ui/input";
import RewardItem from "./RewardItem";
const Rewards: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const rewards = useSelector((state: RootState) => state.reward.rewards);

  useEffect(() => {
    const fetchRewards = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const rewardCollection = collection(db, "users", user.uid, "rewards");
        const rewardSnapshot = await getDocs(rewardCollection);
        const fetchedRewards: Reward[] = rewardSnapshot.docs
          .map(
            (doc) =>
              ({
                id: doc.id,
                ...doc.data(),
              } as Reward)
          )
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        dispatch(setRewards(fetchedRewards));
      } catch (error) {
        console.error("Error fetching rewards:", error);
      }

      setIsLoading(false);
    };

    fetchRewards();
  }, [dispatch, user]);

  const saveReward = async (rewardId: string, rewardData: Reward) => {
    try {
      if (!user) return null;

      const rewardRef = doc(
        collection(db, "users", user.uid, "rewards"),
        rewardId
      );
      await setDoc(rewardRef, rewardData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error saving reward: ", error.message);
      }
    }
  };

  const handleAddRewards = async () => {
    if (input.trim() !== "") {
      const newReward = {
        id: uuidv4(),
        title: input,
        notes: "",
        cost: 10,
        order: 0,
      };

      dispatch(addRewards(newReward));
      setInput("");
      await saveReward(newReward.id, newReward);
    }
  };

  const handleDeleteReward = async (rewardId: string) => {
    if (user) {
      try {
        const rewardRef = doc(db, "users", user.uid, "rewards", rewardId);
        await deleteDoc(rewardRef);
        dispatch(deleteRewards(rewardId));
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log("Error deleting rewards", error);
        }
      }
    }
  };

  const handleRewardReorder = async (newOrder: Reward[]) => {
    if (!user) return;

    dispatch(setRewards(newOrder));

    try {
      const batch = newOrder.map((reward, index) => {
        const rewardRef = doc(db, "users", user.uid, "rewards", reward.id);
        return updateDoc(rewardRef, { order: index });
      });

      await Promise.all(batch);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("Error updating order", error);
      }
    }
  };

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
            onKeyDown={(e) => e.key === "Enter" && handleAddRewards()}
            className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

          {isLoading ? (
            <Loading
              cssClassName="w-full bg-white dark:bg-slate-700"
              isLoading={isLoading}
            />
          ) : (
            <Reorder.Group
              values={rewards}
              axis="y"
              onReorder={handleRewardReorder}
              className="w-full"
            >
              {rewards.map((reward) => (
                <RewardItem
                  key={reward.id}
                  reward={reward}
                  onDelete={async () => handleDeleteReward(reward.id)}
                />
              ))}
            </Reorder.Group>
          )}
      </div>
    </div>
  );
};

export default Rewards;
