import { useState, useEffect } from "react";
import { Button } from "@nextui-org/button";

interface GoalStackProps {
  goals: string[];
}

export default function GoalStack({ goals }: GoalStackProps) {
  const [goalsList, setGoalsList] = useState(goals);

  const addGoal = () => {
    setGoalsList([...goalsList, ""]);
  };

  useEffect(() => {}, [goalsList]);

  return (
    <>
      <ul
        key={goalsList.length}
        className="text-sm font-medium text-gray-900 dark:border-gray-600 dark:text-white"
      >
        {goalsList.map((goal, index) => (
          <li
            key={index}
            className={`w-full px-4 py-2 border-t border-l border-r border-gray-200 ${index === 0 ? "rounded-t-lg" : ""} ${index === goalsList.length - 1 ? "border-b rounded-b-lg" : ""} dark:border-gray-600`}
          >
            <div className="flex justify-between">
              <span>{goal}</span>
              <i className="bi bi-trash3 hover:text-danger-600 hover:cursor-pointer" />
            </div>
          </li>
        ))}
      </ul>
      <Button color={"secondary"} onPress={addGoal}>
        <div className="flex justify-center">
          <div className="flex gap-1">
            <i className="bi bi-plus" />
            <span>Add a goal</span>
          </div>
        </div>
      </Button>
    </>
  );
}
