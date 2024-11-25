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

const fetchCitedSummaries = () => {
  return fetch("http://localhost:5000/api/cite/summary", { method: "GET" }).then((response) => {
    return response.json();
  });
};

export default function SummaryStack() {
  useEffect(() => {
    rerollAnalysis();
  }, []);

  const [summaries, setSummaries] = useState<SummarizedGoal[]|null>(null);

  const rerollAnalysis = () => {
    fetchCitedSummaries().then((newSummaries) => {
      setSummaries(newSummaries);
    });
  };

  return (
    <div>
      { summaries &&
        (summaries.map(({ goal, rating, summary }) => {
          return (
            <Card>
              <CardHeader>{goal}</CardHeader>
              <CardBody>
                {summary.map(({ sentence, quote_locations }) => {
                  return (
                    <>
                      <span>{sentence}</span>
                      <span>{quote_locations}</span>
                    </>
                  );
                })}
              </CardBody>
            </Card>
          );
        }))
      }
    </div>
  );
}
