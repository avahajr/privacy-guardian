import { Card, CardBody } from "@nextui-org/card";
import { useEffect, useState } from "react";

import { apiRequest } from "@/helpers/requests";
import { useStorage } from "@/hooks/useStorage.ts";

export default function Policy() {
  const [policyHTML, setPolicyHTML] = useState([]);
  const { goals, policy } = useStorage();

  useEffect(() => {
    const goalAndPolicy =
      goals && policy ? { goals: goals, policy: policy } : {};

    apiRequest({ endpoint: "html/policy", method: "POST", ...goalAndPolicy })
      .then((response) => response.json())
      .then((data) => {
        setPolicyHTML(data.policy_html);
      });
  }, []);

  return (
    <Card className="p-2 sticky top-48">
      <CardBody id={"policy-text"}>
        <div
          dangerouslySetInnerHTML={{ __html: policyHTML }}
          className="text-default-700 h-[55vh] overflow-y-scroll"
        />
      </CardBody>
    </Card>
  );
}
