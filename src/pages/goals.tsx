import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";

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
          <Policy />
        </div>
        <div className={"flex flex-col gap-2 w-full min-h-96"}>
          <div className="flex justify-between">
            <h3 className="text-xl font-medium">My Goals</h3>
            <div className="text-default-400 flex gap-1">
              <i className="bi bi-magic" />
              <span>Suggest...</span>
            </div>
          </div>
          <GoalStack isEditable={true} />
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
