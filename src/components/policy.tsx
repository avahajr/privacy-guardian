import { Card, CardHeader, CardBody } from "@nextui-org/card";

interface PolicyProps {
  policy: string;
}

export default function Policy({ policy }: PolicyProps) {
  return (
    <Card className="p-2">
      <CardHeader className="text-xl font-medium">{policy}{`'s Privacy Policy`}</CardHeader>
      <CardBody>
        <div className="text-default-700">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget
          ultricies nisl. Integer ac erat in ipsum luctus luctus. Donec
          sollicitudin, metus nec mollis fermentum, nunc libero tincidunt
          tortor, nec ultricies lacus sapien nec nunc. Curabitur nec
          consectetur turpis. Sed sit amet semper purus. Vestibulum ante ipsum
          primis in faucibus or
        </div>
      </CardBody>
    </Card>
  );
}