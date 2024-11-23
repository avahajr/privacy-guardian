import { Link } from "@nextui-org/link";

import DefaultLayout from "@/layouts/default";
import Policy from "@/components/policy.tsx";
import GoalStack from "@/components/goalStack.tsx";

export default function GoalsPage() {
  return (
    <DefaultLayout width={7}>
      <section className="flex gap-4 py-8 md:py-10">
        <div className="flex flex-col gap-2 mr-10 w-full">
          <Link className="w-max" color="foreground" href="/" underline="hover">
            <i className="bi bi-arrow-left pr-1" />
            Back to policy selection{" "}
          </Link>
          <Policy policy={"Apple"} />
        </div>
        <div className={"flex flex-col gap-2 w-full"}>
          <div className="flex justify-between">
            <h3 className="text-xl font-medium">My Goals</h3>
            <div className="text-default-400 flex gap-1">
              <i className="bi bi-magic" />
              <span>Suggest...</span>
            </div>
          </div>
          <GoalStack goals={["Don't sell my data", "Eat the rich"]} />
        </div>
      </section>
    </DefaultLayout>
  );
}
