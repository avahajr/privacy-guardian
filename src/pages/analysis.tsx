import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";

import DefaultLayout from "@/layouts/default";
import Policy from "@/components/policy.tsx";
import GoalStack from "@/components/goalStack.tsx";
import Breakdown from "@/components/breakdown.tsx";

export default function AnalysisPage() {
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
          <Policy policy={"Apple"} />
        </div>
        <div className={"flex flex-col gap-2 w-full min-h-96"}>
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold text-2xl">Goal Breakdown</h3>
            <Button size="sm" variant="ghost">
              Re-roll analysis
            </Button>
          </div>
          <Breakdown
            goals={[
              { goal: "Don't sell my data", rating: 0 },
              { goal: "Eat the rich", rating: 1 },
              {
                goal: "meep morp",
                rating: 2,
              },
            ]}
          />
          <div className="flex justify-between mt-3">
            <h3 className="text-lg font-medium">My Goals</h3>
          </div>
          <GoalStack
            goals={["Don't sell my data", "Eat the rich"]}
            isEditable={false}
          />
          <div className="flex justify-end mt-5">
            <Button as={Link} color="secondary" href="/breakdown">
              Analyze
              <i className="bi bi-arrow-right" />
            </Button>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}