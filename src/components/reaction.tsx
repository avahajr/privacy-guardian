import { useEffect, useState } from "react";

interface ReactionProps {
  goals: { goal: string; rating: number }[];
}

export default function Reaction({ goals }: ReactionProps) {
  const reactions = ["Nice!", "Not too shabby!", "Ruh roh!"];
  const [reaction, setReaction] = useState<string>("");
  const [numMet, setNumMet] = useState<number>(0);
  useEffect(() => {
    const seenGoals = [0, 0, 0];

    goals.forEach((goal) => {
      seenGoals[goal.rating]++;
    });

    const totalGoals = goals.length;
    const metGoals = seenGoals[0];
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

  return (
    <div className="mt-3">
      <div className="font-semibold text-lg">{reaction}</div>
      <div className="text-sm"><span className="font-medium" >{numMet} out of {goals.length}</span> of your goals were completely met.</div>
    </div>
  );
}