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

const citation = ({
                    spans_to_highlight,
                    citation_num
                  }: {
  spans_to_highlight: number[];
  citation_num: number;
}) => {
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <span
      className="text-blue-500 text-xs cursor-pointer mr-1 align-top"
      // role={"button"}
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
      span_to_highlight[i].toString()
    );

    if (toHighlight != null) {
      console.log(toHighlight.textContent);
      toHighlight.classList.add(
        "highlighted"
      );
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
    method: "GET"
  });

  await response1.json();
  let response = await fetch(`http://localhost:5000/api/cite/summary/${id}`, {
    method: "GET"
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
              citation_num: i + 1
            })}
          </span>
        ))}
      </p>
    );
  }
};

export default function SummaryStack({
                                       goals
                                     }: {
  goals: { goal: string; rating: number }[];
}) {
  const [summaries, setSummaries] = useState<SummarizedGoal[]>([]);

  useEffect(() => {
    goals.forEach((_, index) => {
      fetchSummary(index).then((summary) => {
        setSummaries((prevSummaries) => [...prevSummaries, summary]);
      });
    });
  }, []);

  return (
    <div>
      {summaries.map(({ goal, cited_sentences }, i) => (
        <Card key={i} className="my-4 border" shadow={"none"}>
          <CardHeader className="font-semibold text-xl">{goal}</CardHeader>
          <CardBody>{renderSummary(cited_sentences)}</CardBody>
        </Card>
      ))}
    </div>
  );
}
