import DefaultLayout from "@/layouts/default";
import Policy from "@/components/policy.tsx";
import GoalStack  from "@/components/goalStack.tsx";

export default function GoalsPage() {
  return (
    <DefaultLayout width={7}>
      <section className="flex gap-4 py-8 md:py-10">
        <div className="w-1/2">
          <Policy policy={"Apple"}></Policy>
        </div>
        <div className={"w-1/2"}>
          <GoalStack></GoalStack>
        </div>
      </section>
    </DefaultLayout>
  );
}
