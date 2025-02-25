import { useState, useEffect, useRef } from "react";
import { Button } from "@nextui-org/button";

import { Goal } from "@/types";

interface GoalStackProps {
  isEditable?: boolean;
  ratings?: Goal[];
}

export default function GoalStack({ isEditable = true }: GoalStackProps) {
  const [goalsList, setGoalsList] = useState<Goal[]>([]);
  const [inProcessGoal, setInProcessGoal] = useState<Goal>({
    goal: "",
    rating: null,
    summary: null
  });
  const [isAddingGoal, setIsAddingGoal] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const icons = ["bi bi-check", "bi bi-exclamation", "bi bi-x"];
  const colors = ["text-success-600", "text-warning-600", "text-danger-600"];

  useEffect(() => {
    const goalsFromSession: Goal[] = JSON.parse(sessionStorage.getItem("goals") || "null");

    setGoalsList(goalsFromSession);
  }, []);

  useEffect(() => {
    sessionStorage.setItem("goals", JSON.stringify(goalsList));
  }, [goalsList]);

  useEffect(() => {
    // simulate an autofocus effect
    if (isAddingGoal) {
      inputRef.current?.focus();
    }
  }, [isAddingGoal]);

  const addGoal = () => {
    if (inProcessGoal.goal.trim() !== "") {

      setGoalsList([...goalsList, inProcessGoal]);
      setInProcessGoal({
        goal: "",
        rating: inProcessGoal.rating,
        summary: null
      });
    }
    setIsAddingGoal(false);
  };

  const changeInProcessGoal = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInProcessGoal({
      goal: event.target.value,
      rating: inProcessGoal.rating,
      summary: null,
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      event.key === "Enter" &&
      isAddingGoal &&
      inProcessGoal.goal.trim() !== ""
    ) {
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
            className={`w-full ps-2 pe-4 py-2 border-t border-l border-r border-gray-200 ${index === 0 ? "rounded-t-lg" : ""} ${!isAddingGoal && index === goalsList.length - 1 && "rounded-b-lg border-b"} dark:border-gray-600`}
          >
            <div className="flex items-center gap-2 justify-between">
              <div className="flex gap-1 items-center">
                {goal.rating !== null && (
                  <i
                    className={`bi ${icons[goal.rating]} ${colors[goal.rating]} text-lg`}
                  />
                )}
                <span>{goal.goal}</span>
              </div>
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
                ref={inputRef}
                className="w-full px-2 py-1 border rounded"
                type="text"
                value={inProcessGoal.goal}
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
