import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import DefaultLayout from "@/layouts/default";
import Policy from "@/components/policy.tsx";
import GoalStack from "@/components/goalStack.tsx";
import Breakdown from "@/components/breakdown.tsx";
import SummaryStack from "@/components/summaryStack.tsx";
import { useEffect, useState } from "react";

export default function AnalysisPage() {
  const [goals, setGoals] = useState<{ goal: string; rating: number }[] | null>(
    null
  );

  useEffect(() => {
    fetch("http://localhost:5000/api/goals/rating", { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        setGoals(data);
      });
  }, []);

  return (
    <DefaultLayout width={9}>
      <section className="flex gap-4 py-8 md:py-10">
        <div className="flex flex-col gap-2 mr-10 w-full">
          <Link
            className="w-max"
            color="foreground"
            href="/goals"
            underline="hover"
          >
            <i className="bi bi-arrow-left pr-1" />
            Back to goals{" "}
          </Link>
          <Policy />
        </div>
        <div className={"flex flex-col gap-2 w-full min-h-96"}>
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold text-2xl">Goal Breakdown</h3>
            <Button size="sm" variant="ghost">
              Re-roll analysis
            </Button>
          </div>
          {goals ? <Breakdown goals={goals} /> : <Spinner/>}
          <div className="flex justify-between mt-3">
            <h3 className="text-lg font-medium">My Goals</h3>
          </div>
          <GoalStack
            isEditable={false}
          />
          {goals &&
            <SummaryStack goals={goals} />}
        </div>
      </section>
    </DefaultLayout>
  );
}
