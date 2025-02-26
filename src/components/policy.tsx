import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { useEffect, useState } from "react";

import { apiRequest } from "@/helpers/requests";
import { useStorage } from "@/hooks/useStorage.ts";

export default function Policy() {
  const { goals, policy, policy_html } = useStorage();
  const [policyHTML, setPolicyHTML] = useState(policy_html);

  useEffect(() => {
    if (!policyHTML) {
      const goalAndPolicy =
        goals && policy ? { goals: goals, policy: policy } : {};

      apiRequest({ endpoint: "html/policy", method: "POST", ...goalAndPolicy })
        .then((response) => response.json())
        .then((data) => {
          setPolicyHTML(data.policy_html);
          sessionStorage.setItem("policy_html", data.policy_html);
        });
    }
  }, []);

  return (
    <Card className="p-2 sticky top-48">
      <CardHeader className={"font-medium font-mono text-xs text-default-500"}>
        {policy?.toLowerCase()}_policy.md
      </CardHeader>
      <CardBody
        className={"text-default-700 h-[55vh] overflow-y-scroll"}
        id={"policy-text"}
      >
        {policyHTML && <div dangerouslySetInnerHTML={{ __html: policyHTML }} />}
      </CardBody>
    </Card>
  );
}
