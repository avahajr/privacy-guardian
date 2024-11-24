import { useState, useEffect } from "react";
import { Button } from "@nextui-org/button";

interface GoalStackProps {
  isEditable?: boolean;
}

interface GoalRating {
  goal: string;
  rating: number;
}

export default function GoalStack({ isEditable = true }: GoalStackProps) {
  const [goalsList, setGoalsList] = useState<string[]>([]);
  const [inProcessGoal, setInProcessGoal] = useState<string>("");
  const [isAddingGoal, setIsAddingGoal] = useState<boolean>(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/goals", { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        const apiGoals = data.map(({ goal }: GoalRating) => goal);
        setGoalsList(apiGoals);
      });
  }, []);

  const addGoal = () => {
    if (inProcessGoal.trim() !== "") {
      setGoalsList([...goalsList, inProcessGoal]);

      fetch("http://localhost:5000/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ goal: inProcessGoal })
      });

      setInProcessGoal("");
    }
    setIsAddingGoal(false);
  };

  const changeInProcessGoal = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInProcessGoal(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && isAddingGoal && inProcessGoal.trim() !== "") {
      addGoal();
      setIsAddingGoal(true);
    }
  };

  const removeGoal = (index: number) => () => {
    const newGoalsList = goalsList.filter((_, i) => i !== index);
    setGoalsList(newGoalsList);
  };

  return (
    <>
      <ul
        key={goalsList.length}
        className="text-sm font-medium text-gray-900 dark:border-gray-600 dark:text-white"
      >
        {goalsList.map((goal, index) => (
          <li
            key={index}
            className={`w-full px-4 py-2 border-t border-l border-r border-gray-200 ${index === 0 ? "rounded-t-lg" : ""} ${!isAddingGoal && index === goalsList.length-1 && "rounded-b-lg border-b"} dark:border-gray-600`}
          >
            <div className="flex items-center gap-2 justify-between">
              <span>{goal}</span>
              {isEditable && (
                <i
                  className="bi bi-trash3 hover:text-danger-600 hover:cursor-pointer"
                  role="button"
                  onClick={removeGoal(index)}
                />
              )}
            </div>
          </li>
        ))}
        {isEditable && isAddingGoal && (
          <li className="w-full px-4 py-2 border rounded-b-lg border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-2 justify-between">
              <input
                className="w-full px-2 py-1 border rounded"
                type="text"
                value={inProcessGoal}
                autoFocus
                onBlur={addGoal}
                onChange={changeInProcessGoal}
                onKeyDown={handleKeyDown}
              />
            </div>
          </li>
        )}
      </ul>
      {isEditable && (
        <Button
          color={"secondary"}
          variant="flat"
          onPress={() => setIsAddingGoal(true)}
        >
          <div className="flex justify-center">
            <div className="flex gap-1">
              <i className="bi bi-plus" />
              <span>Add a goal</span>
            </div>
          </div>
        </Button>
      )}
    </>
  );
}