import { Link } from "@nextui-org/link";
import { Spinner } from "@nextui-org/spinner";
import { useEffect, useState } from "react";

import DefaultLayout from "@/layouts/default";
import Policy from "@/components/policy.tsx";
import GoalStack from "@/components/goalStack.tsx";
import Breakdown from "@/components/breakdown.tsx";
import SummaryStack from "@/components/summaryStack.tsx";
import Reaction from "@/components/reaction.tsx";
import { Goal } from "@/types";
import { apiRequest } from "@/helpers/requests.ts";

export default function AnalysisPage() {
  const [goals, setGoals] = useState<Goal[]>(
    sessionStorage.getItem("goals")
      ? JSON.parse(sessionStorage.getItem("goals") as string)
      : undefined,
  );
  const policy = sessionStorage.getItem("policy") || undefined;

  useEffect(() => {
    console.log("Goals updated", goals);
    sessionStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    const fetchGoalsData = async () => {
      try {
        // 1. Get rated goals.
        const ratingResponse = await apiRequest({
          endpoint: "goals/rating",
          method: "POST",
          goals: goals,
          policy: policy,
        });
        const ratedGoals = await ratingResponse.json();

        setGoals(ratedGoals);

        // Process each goal concurrently.
        ratedGoals.forEach((_: Goal, index: number) => {
          (async () => {
            // 2. Summarize the goal for the current index.
            const summaryResponse = await apiRequest({
              endpoint: `summary/${index}`,
              method: "POST",
              goals: ratedGoals,
              policy: policy,
            });
            const summarizedGoal = await summaryResponse.json();

            // Update the goal in state.
            setGoals((prevGoals) =>
              prevGoals.map((g, i) => (i === index ? summarizedGoal : g)),
            );

            // 3. Apply citation for the same goal after summarization completes.
            const citationResponse = await apiRequest({
              endpoint: `cite/summary/${index}`,
              method: "POST",
              goals: goals,
              policy: policy,
            });
            const citedGoal = await citationResponse.json();

            // Update the goal in state once the citation resolves.
            setGoals((prevGoals) =>
              prevGoals.map((g, i) => (i === index ? citedGoal : g)),
            );
          })();
        });
      } catch (error) {
        console.error("Error fetching goals data", error);
      }
    };

    fetchGoalsData();
  }, []);

  return (
    <DefaultLayout activeStep={3} width={9}>
      <section className="flex gap-4 py-8 md:py-10">
        <div className="flex flex-col gap-2 mr-10 w-full">
          <Link
            className="w-max font-medium text-lg"
            color="foreground"
            href="/goals"
            underline="hover"
          >
            <i className="bi bi-arrow-left pr-1" />
            Back to goals
          </Link>
          <Policy />
        </div>
        <div className={"flex flex-col gap-2 w-full min-h-96"}>
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold text-3xl">Your privacy report</h3>
          </div>
          {goals ? <Breakdown goals={goals} /> : <Spinner />}
          {goals && <Reaction goals={goals} />}
          <div className="flex justify-between mt-3">
            <h3 className="text-lg font-medium">My Goals</h3>
          </div>
          {goals && <GoalStack isEditable={false} />}
          {goals && <SummaryStack goals={goals} />}
        </div>
      </section>
    </DefaultLayout>
  );
}
