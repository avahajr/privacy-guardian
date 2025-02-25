import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Spinner } from "@nextui-org/spinner";

import { CitedSentence, Goal } from "@/types";

const colors = ["text-success-600", "text-warning-600", "text-danger-600"];
const icons = ["bi bi-check", "bi bi-exclamation", "bi bi-x"];
const sectionLabels = ["Goals Not Met", "Goals Partially Met", "Goals Met"];

const citation = ({
  spans_to_highlight,
  citation_num,
}: {
  spans_to_highlight: number[];
  citation_num: number;
}) => {
  return (
    <button
      className="text-blue-500 text-xs cursor-pointer mr-1 align-top"
      onClick={() => highlight(spans_to_highlight)}
    >
      [{citation_num}]
    </button>
  );
};

const renderSummary = (summary: CitedSentence[] | string | null) => {
  if (typeof summary == "object") {
    let citation_num = 0;
    return (
      <p>
        {summary?.map((sentence, i) => {
          return (
            <span key={i}>
              {sentence.sentence}
              {sentence.quote_locations.map((group, j) => (
                <span key={j}>
                  {citation({
                    spans_to_highlight: group,
                    citation_num: ++citation_num,
                  })}
                </span>
              ))}
            </span>
          );
        })}
      </p>
    );
  }
  else if (summary) {
    return <p>{summary}</p>;
  }
};

function clearHighlights() {
  const highlightedElements = document.querySelectorAll(".highlighted");

  highlightedElements.forEach((element) => {
    element.classList.remove("highlighted");
  });
}

function highlight(span_to_highlight: number[]) {
  clearHighlights();
  for (let i = 0; i < span_to_highlight.length; i++) {
    const toHighlight = document.getElementById(
      span_to_highlight[i].toString(),
    );

    if (toHighlight != null) {
      toHighlight.classList.add("highlighted");
      if (i == 0) {
        toHighlight.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      console.error("Could not find element with id", span_to_highlight[i]);
    }
  }
}

const getGoalCounts = (goals: Goal[]) => {
  let seenGoals = [0, 0, 0];

  goals.forEach((goal) => {
    seenGoals[goal.rating || 0]++;
  });

  return seenGoals;
};

export default function SummaryStack({ goals }: { goals: Goal[] }) {
  const [seenGoals, setSeenGoals] = useState<number[]>([0, 0, 0]);
  const goalCounts = getGoalCounts(goals);

  useEffect(() => {
    setSeenGoals(getGoalCounts(goals));
  }, [goals]);

  const groupedSummaries = goals
    .reduce(
      (acc, summary) => {
        acc[summary.rating || 0].push(summary);

        return acc;
      },
      [[], [], []] as Goal[][],
    )
    .reverse();

  return (
    <div>
      {groupedSummaries.map((group, rating) => (
        <div key={rating} className="mt-5 flex flex-col">
          {goalCounts[rating] > 0 && (
            <h2 className="text-2xl font-bold my-4">{sectionLabels[rating]}</h2>
          )}
          {group.map(({ goal, rating, summary }, i) => (
            <>
              <Card key={i} className="my-3 border p-1" shadow={"none"}>
                <CardHeader className="font-semibold text-xl -mb-4">
                  <div className="flex gap-1">
                    <i
                      className={`${icons[rating || 0]} ${colors[rating || 0]}`}
                    />
                    <span>{goal}</span>
                  </div>
                </CardHeader>
                <CardBody className="px-4">
                  {renderSummary(summary)}
                </CardBody>
              </Card>
            </>
          ))}
          {goalCounts[rating] > 0 && seenGoals[rating] < goalCounts[rating] && (
            <Spinner className="self-center" />
          )}
        </div>
      ))}
    </div>
  );
}
