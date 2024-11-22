import DefaultLayout from "@/layouts/default";
import { PrivacyGuardianLogo } from "@/components/icons.tsx";

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
    <DefaultLayout>
      <section className="flex justify-between py-8 md:py-10">
        {masthead}
        <div>
          <p>HGI</p>
        </div>
      </section>
    </DefaultLayout>
  );
}
