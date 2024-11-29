import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/card";

interface CitedSentence {
  sentence: string;
  quote_locations: number[];
}

interface SummarizedGoal {
  goal: string;
  rating: number;
  summary: CitedSentence[];
}

const fetchSummary = (id: number) => {
  return fetch(`http://localhost:5000/api/summary/${id}`, { method: "GET" })
    .then((response) => response.json())
    .then(() => {
      return fetch(`http://localhost:5000/api/cite/summary/${id}`, { method: "GET" })
        .then((response) => response.json())
        .then((citeSummary) => {
          console.log(citeSummary)
          return citeSummary.json();
        });
    });
};

const renderSummary = (summary: SummarizedGoal | string) => {
  if (typeof summary === "string") {
    return <span>{summary}</span>;
  } else if (typeof summary == "object") {
    return (
      <div>
        <span>{summary.goal}</span>
        <span>{summary.rating}</span>
        <div>Cited</div>
        {summary.summary.map(({ sentence, quote_locations }, i) => (
          <div key={i}>
            <span>{sentence}</span>
            <span>{quote_locations.join(", ")}</span>
          </div>
        ))}
      </div>
    );
  }
};
export default function SummaryStack({ goals }: { goals: { goal: string; rating: number }[] }) {
  const [summaries, setSummaries] = useState<SummarizedGoal[]>([]);

  useEffect(() => {
    goals.forEach((goal, index) => {
      fetchSummary(index).then((summary) => {
        setSummaries((prevSummaries) => [...prevSummaries, summary]);
      });
    });
  }, []);

  return (
    <div>
      {summaries.map(({ goal, rating, summary }, i) => (
        <Card key={i}>
          <CardHeader>{goal}</CardHeader>
          <CardBody>
            <span>{rating}</span>
            {renderSummary(summary)}
          </CardBody>
        </Card>
      ))}
    </div>
  );
}