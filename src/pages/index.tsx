import { Select, SelectItem } from "@nextui-org/select";
import { Button } from "@nextui-org/button";

import DefaultLayout from "@/layouts/default";
import { PrivacyGuardianLogo } from "@/components/icons.tsx";
import { siteConfig } from "@/config/site.ts";

const masthead = (
  <div className="inline-block ml-4">
    <div className="text-8xl font-semibold">
      <div className="flex items-end gap-5">
        <div>Privacy</div>
        <PrivacyGuardianLogo className="-mb-4" size={105} />
      </div>
      <div className="mt-1">Guardian</div>
    </div>
    <div className="text-3xl text-default-400 font-medium mt-3">
      Understand what you&#39;re signing.
    </div>
  </div>
);

export default function IndexPage() {
  return (
    <DefaultLayout width={5}>
      <section className="flex justify-between py-8 md:py-10">
        {masthead}
        <div className="flex flex-col justify-end">
          <div className="font-medium text-2xl text-default-900 mb-2">
            Select a policy to analyze.
          </div>
          <Select
            className="min-w-40 my-4"
            label={"Policy"}
            placeholder="Select a policy..."
            size="lg"
            variant={"bordered"}
          >
            {siteConfig.policies.map((policy) => (
              <SelectItem key={policy}>{policy}</SelectItem>
            ))}
          </Select>
          <div className="flex justify-end">
            <Button className="max-w-fit" color="secondary" size="md" variant="solid">
              <div className="flex gap-2.5">
                <div>Let&#39;s go</div>
                <i className="bi bi-arrow-right" />
              </div>
            </Button>
          </div>
        </div>
      </section>
    </DefaultLayout>
  )
    ;
}
