import { Card, CardBody } from "@nextui-org/card";
import { useEffect, useState } from "react";
import "../styles/policy.css";

export default function Policy() {
  const [policyHTML, setPolicyHTML] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/html/policy", { method: "GET" })
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
          className="text-default-700"
        />
      </CardBody>
    </Card>
  );
}
