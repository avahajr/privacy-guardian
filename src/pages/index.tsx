import { useEffect, useState } from "react";
import { Select, SelectItem } from "@nextui-org/select";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";

import DefaultLayout from "@/layouts/default";
import { PrivacyGuardianLogo } from "@/components/icons.tsx";
import { siteConfig } from "@/config/site.ts";
import { Goal } from "@/types";

const masthead = (
  <div className="inline-block ml-4">
    <div className="text-6xl sm:text-7xl md:text-8xl font-semibold">
      <div className="flex items-end gap-5">
        <div>Privacy</div>
        <PrivacyGuardianLogo className="-mb-4" size={105} />
      </div>
      <div className="mt-1">Guardian</div>
    </div>
    <div className="text-2xl sm:text-3xl text-default-400 font-medium mt-3">
      Understand what you&#39;re signing.
    </div>
  </div>
);

export default function IndexPage() {
  const [selectedPolicy, setSelectedPolicy] = useState<string>(
    sessionStorage.getItem("policy") || "Apple",
  );
  const initialGoals: Goal[] = [
    { goal: "Don't sell my data", rating: null, summary: null },
    {
      goal: "Don't give my data to law enforcement",
      rating: null,
      summary: null,
    },
    { goal: "Allow me to delete my data", rating: null, summary: null },
  ];

  const storedGoals: Goal[] | null = JSON.parse(
    sessionStorage.getItem("goals") || "null",
  );

  const [goals, setGoals] = useState<Goal[]>(storedGoals || initialGoals);
  const [isInvalid, setIsInvalid] = useState(false);

  useEffect(() => {
    sessionStorage.setItem("policy", selectedPolicy);
  }, [selectedPolicy]);

  useEffect(() => {
    sessionStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  const handlePolicyChange = async (policy: string) => {
    if (policy) {
      setSelectedPolicy(policy);

      // reset goals to initial values
      setGoals(initialGoals);
      setIsInvalid(false);
    }
  };

  const handleButtonClick = () => {
    if (!selectedPolicy) {
      setIsInvalid(true);
    }
  };

  return (
    <DefaultLayout activeStep={1} width={5}>
      <section className="flex justify-between py-8 md:py-10">
        {masthead}
        <div className="flex flex-col justify-end">
          <div className="font-medium text-2xl text-default-900 mb-2">
            Select a policy to analyze.
          </div>
          <Select
            className="min-w-40 min-h-28 pt-3"
            errorMessage={isInvalid ? "Please select a policy to proceed." : ""}
            isInvalid={isInvalid}
            label={"Policy"}
            placeholder="Select a policy..."
            selectedKeys={selectedPolicy ? [selectedPolicy] : []}
            size="lg"
            variant={"bordered"}
            onChange={(e) => handlePolicyChange(e.target.value)}
          >
            {siteConfig.policies.map((policy) => (
              <SelectItem key={policy} value={policy}>
                {policy}
              </SelectItem>
            ))}
          </Select>
          <div className="flex justify-end">
            <Button
              as={Link}
              className="max-w-fit"
              color="secondary"
              href={selectedPolicy ? "./goals" : "#"}
              size="md"
              variant="solid"
              onClick={handleButtonClick}
              onPress={handleButtonClick}
            >
              <div className="flex gap-2.5">
                <div>Let&#39;s go</div>
                <i className="bi bi-arrow-right" />
              </div>
            </Button>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
