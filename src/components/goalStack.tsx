import { useState, useRef, useEffect } from "react";
import { Button } from "@nextui-org/button";

interface GoalStackProps {
  goals: string[];
}

export default function GoalStack({ goals }: GoalStackProps) {
  const [goalsList, setGoalsList] = useState(goals);
  const [inputValues, setInputValues] = useState<string[]>(goals);
  const [newGoals, setNewGoals] = useState<boolean[]>(goals.map(() => false));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const addGoal = () => {
    const nonEmptyGoals = inputValues.filter((goal) => goal.trim() !== "");

    setGoalsList([...nonEmptyGoals, ""]);
    setInputValues([...nonEmptyGoals, ""]);
    setNewGoals([...newGoals, true]);
  };

  useEffect(() => {
    if (inputRefs.current[goalsList.length - 1]) {
      inputRefs.current[goalsList.length - 1]?.focus();
    }
  }, [goalsList]);

  const handleInputChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const newInputValues = [...inputValues];

      newInputValues[index] = event.target.value;
      setInputValues(newInputValues);
      setGoalsList(newInputValues);
    };

  const handleInputBlur = (index: number) => () => {
    if (inputValues[index].trim() === "") {
      removeGoal(index)();
    } else {
      const newNewGoals = [...newGoals];

      newNewGoals[index] = false;
      setNewGoals(newNewGoals);
    }
  };

  const handleKeyDown =
    (index: number) => (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        handleInputBlur(index)();
      }
    };

  const removeGoal = (index: number) => () => {
    const newGoalsList = goalsList.filter((_, i) => i !== index);
    const newInputValues = inputValues.filter((_, i) => i !== index);
    const newNewGoals = newGoals.filter((_, i) => i !== index);

    setGoalsList(newGoalsList);
    setInputValues(newInputValues);
    setNewGoals(newNewGoals);
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
            className={`w-full px-4 py-2 border-t border-l border-r border-gray-200 ${index === 0 ? "rounded-t-lg" : ""} ${index === goalsList.length - 1 ? "border-b rounded-b-lg" : ""} dark:border-gray-600`}
          >
            <div className="flex items-center gap-2 justify-between">
              {newGoals[index] ? (
                <input
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-full px-2 py-1 border rounded"
                  type="text"
                  value={inputValues[index]}
                  onBlur={handleInputBlur(index)}
                  onChange={handleInputChange(index)}
                  onKeyDown={handleKeyDown(index)}
                />
              ) : (
                <span>{goal}</span>
              )}
              <i
                className="bi bi-trash3 hover:text-danger-600 hover:cursor-pointer"
                role="button"
                onClick={removeGoal(index)}
              />
            </div>
          </li>
        ))}
      </ul>
      <Button color={"secondary"} variant="flat" onPress={addGoal}>
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
