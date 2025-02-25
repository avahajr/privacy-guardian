import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface CitedSentence {
  sentence: string;
  quote_locations: number[][];
}

export interface Goal {
  goal: string;
  rating: number | null;
  summary: string | CitedSentence[] | null;
}