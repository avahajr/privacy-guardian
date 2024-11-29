import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/card";

interface CitedSentence {
  sentence: string;
  quote_locations: number[];
}

interface SummarizedGoal {
  goal: string;
  rating: number;
  cited_sentences: CitedSentence[];
}

const fetchSummary = async (id: number) => {
  let response1 = await fetch(`http://localhost:5000/api/summary/${id}`, { method: "GET" });

  await response1.json();
  let response = await fetch(`http://localhost:5000/api/cite/summary/${id}`, { method: "GET" });
  let citeSummary: any = await response.json();

  return citeSummary;
};

const renderSummary = (summary: CitedSentence[] | string) => {
  if (typeof summary == "object") {
    return (
      <ul>
        {summary.map((sentence, i) => (
          <li key={i}>{sentence.sentence} {sentence.quote_locations}</li>
        ))}
      </ul>
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
      {summaries.map(({ goal, rating, cited_sentences }, i) => (
        <Card key={i}>
          <CardHeader>{goal}</CardHeader>
          <CardBody>
            <span>{rating}</span>
            {renderSummary(cited_sentences)}
          </CardBody>
        </Card>
      ))}
    </div>
  );
}