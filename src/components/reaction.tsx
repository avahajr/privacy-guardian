import { useEffect, useState } from "react";

import { Goal } from "@/types";

interface ReactionProps {
  goals: Goal[];
}

export default function Reaction({ goals }: ReactionProps) {
  const reactions = ["Nice!", "Not too shabby!", "Ruh roh!"];
  const [reaction, setReaction] = useState<string>("");
  const [numMet, setNumMet] = useState<number>(0);
  const [allGoalsHaveRating, setAllGoalsHaveRating] = useState<boolean>(false);

  useEffect(() => {
    const seenGoals = [0, 0, 0];

    goals.forEach((goal) => {
      if (goal.rating === null) {
        setAllGoalsHaveRating(false);

        return;
      }
      seenGoals[goal.rating]++;
    });

    const totalGoals = goals.length;
    const metGoals = seenGoals[0];

    if (seenGoals.reduce((a, b) => a + b, 0) === goals.length) {
      setAllGoalsHaveRating(true);
    }
    setNumMet(metGoals);
    const metPercentage = metGoals / totalGoals;

    if (metPercentage > 2 / 3) {
      setReaction(reactions[0]);
    } else if (metPercentage > 1 / 3) {
      setReaction(reactions[1]);
    } else {
      setReaction(reactions[2]);
    }
  }, [goals]);

  if (!allGoalsHaveRating) {
    return null;
  }

  return (
    <div className="mt-3">
      <div className="font-semibold text-lg">{reaction}</div>
      <div className="text-sm">
        <span className="font-medium">
          {numMet} out of {goals.length}
        </span>{" "}
        of your goals were completely met.
      </div>
    </div>
  );
}
