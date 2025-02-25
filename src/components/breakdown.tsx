import classNames from "classnames";
import { Goal } from "@/types";

interface BreakdownElementProps {
  forRating: number;
  goals: Goal[];
}

interface BreakdownProps {
  goals: Goal[];
}

function BreakdownElement({ forRating, goals }: BreakdownElementProps) {
  const ratingText = [
    "Goals completely met",
    "Goals partially met",
    "Goals not met",
  ];
  const icons = [
    "bi bi-check-circle-fill",
    "bi bi-exclamation-triangle-fill",
    "bi bi-x-circle-fill",
  ];
  const numWithRating = goals.filter(
    (goal) => goal.rating === forRating,
  ).length;

  console.log("with rating", forRating, ":", numWithRating);

  return (
    <div
      className={classNames(
        "p-4 border flex flex-col gap-2 rounded-xl dark:bg-opacity-50 w-44",
        {
          "bg-success-100 border-success-200": forRating === 0,
          "bg-warning-100 border-warning-200": forRating === 1,
          "bg-danger-100 border-danger-200": forRating === 2,
        },
      )}
    >
      <i
        className={classNames(`${icons[forRating]} text-3xl`, {
          "text-success-600": forRating === 0,
          "text-warning-600": forRating === 1,
          "text-danger-600": forRating === 2,
        })}
      />
      <h3 className={"font-bold text-3xl"}>{numWithRating}</h3>
      <div
        className={classNames("text-xs font-medium", {
          "text-success-700": forRating === 0,
          "text-warning-700": forRating === 1,
          "text-danger-700": forRating === 2,
        })}
      >
        {ratingText[forRating]}
      </div>
    </div>
  );
}

export default function Breakdown({ goals }: BreakdownProps) {
  console.log(goals);

  return (
    <div className={"flex justify-between"}>
      {[2, 1, 0].map((rating) => (
        <BreakdownElement key={rating} forRating={rating} goals={goals} />
      ))}
    </div>
  );
}
