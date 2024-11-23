import { useState } from "react";
import { Select, SelectItem } from "@nextui-org/select";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";

import DefaultLayout from "@/layouts/default";
import { PrivacyGuardianLogo } from "@/components/icons.tsx";
import { siteConfig } from "@/config/site.ts";

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
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);
  const [isInvalid, setIsInvalid] = useState(false);

  const handlePolicyChange = (policy: string) => {
    setSelectedPolicy(policy);
    setIsInvalid(false);
  };

  const handleButtonClick = () => {
    if (!selectedPolicy) {
      setIsInvalid(true);
    }
  };

  return (
    <DefaultLayout width={5}>
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
