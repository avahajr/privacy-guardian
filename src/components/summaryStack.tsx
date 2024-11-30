import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Spinner } from "@nextui-org/spinner";

interface CitedSentence {
  sentence: string;
  quote_locations: number[];
}

interface SummarizedGoal {
  goal: string;
  rating: number;
  cited_sentences: CitedSentence[];
}

const colors = ["text-success-600", "text-warning-600", "text-danger-600"];
const icons = ["bi bi-check", "bi bi-exclamation", "bi bi-x"];
const sectionLabels = ["Goals Met", "Goals Partially Met", "Goals Not Met"];

const citation = ({
  spans_to_highlight,
  citation_num,
}: {
  spans_to_highlight: number[];
  citation_num: number;
}) => {
  return (
    <span
      className="text-blue-500 text-xs cursor-pointer mr-1 align-top"
      onClick={() => highlight(spans_to_highlight)}
    >
      [{citation_num}]
    </span>
  );
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

const fetchSummary = async (id: number) => {
  let response1 = await fetch(`http://localhost:5000/api/summary/${id}`, {
    method: "GET",
  });

  await response1.json();
  let response = await fetch(`http://localhost:5000/api/cite/summary/${id}`, {
    method: "GET",
  });
  let citeSummary: any = await response.json();

  return citeSummary;
};

const renderSummary = (summary: CitedSentence[] | string) => {
  if (typeof summary == "object") {
    return (
      <p>
        {summary.map((sentence, i) => (
          <span key={i}>
            {sentence.sentence}
            {citation({
              spans_to_highlight: sentence.quote_locations,
              citation_num: i + 1,
            })}
          </span>
        ))}
      </p>
    );
  }
};

const getGoalCounts = (goals: { goal: string; rating: number }[]) => {
  let seenGoals = [0, 0, 0];

  goals.forEach((goal) => {
    seenGoals[goal.rating]++;
  });

  return seenGoals;
};

export default function SummaryStack({
  goals,
}: {
  goals: { goal: string; rating: number }[];
}) {
  const [summaries, setSummaries] = useState<SummarizedGoal[]>([]);
  const [seenGoals, setSeenGoals] = useState<number[]>([0, 0, 0]);
  const goalCounts = getGoalCounts(goals);

  useEffect(() => {
    const fetchAllSummaries = async () => {
      for (let index = 0; index < goals.length; index++) {
        const fetchedSummary = await fetchSummary(index);

        setSeenGoals((prevSeenGoals) => {
          const newExpectedGoals = [...prevSeenGoals];

          newExpectedGoals[fetchedSummary.rating]++;

          return newExpectedGoals;
        });
        setSummaries((prevSummaries) => [...prevSummaries, fetchedSummary]);
      }
    };

    fetchAllSummaries();
  }, [goals]);

  const groupedSummaries = summaries.reduce(
    (acc, summary) => {
      acc[summary.rating].push(summary);

      return acc;
    },
    [[], [], []] as SummarizedGoal[][],
  );

  return (
    <div>
      {groupedSummaries.map((group, rating) => (
        <div key={rating} className="mt-5 flex flex-col">
          {goalCounts[rating] > 0 && (
            <h2 className="text-2xl font-bold my-4">{sectionLabels[rating]}</h2>
          )}
          {group.map(({ goal, rating, cited_sentences }, i) => (
            <>
              <Card key={i} className="my-3 border p-1" shadow={"none"}>
                <CardHeader className="font-semibold text-xl -mb-4">
                  <div className="flex gap-1">
                    <i className={`${icons[rating]} ${colors[rating]}`} />
                    <span>{goal}</span>
                  </div>
                </CardHeader>
                <CardBody className="px-4">
                  {renderSummary(cited_sentences)}
                </CardBody>
              </Card>
            </>
          ))}
          {goalCounts[rating] > 0 && (seenGoals[rating] < goalCounts[rating]) && <Spinner className="self-center"/>}
        </div>
      ))}
    </div>
  );
}
