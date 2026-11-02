"use client";

import type { CalculatorId } from "@/content/types";
import GeneralCalc from "./GeneralCalc";
import SweetnessCalc from "./SweetnessCalc";
import CarCalc from "./CarCalc";
import CarbonCalc from "./CarbonCalc";
import PriceBreakdown from "./PriceBreakdown";
import { CalcShell } from "./ui";
import { PieChart } from "lucide-react";

export default function CalculatorBlock({ id }: { id: CalculatorId }) {
  switch (id) {
    case "general":
      return <GeneralCalc />;
    case "sweetness":
      return <SweetnessCalc />;
    case "car":
      return <CarCalc />;
    case "carbon":
      return <CarbonCalc />;
    case "breakdown":
      return (
        <CalcShell title="ราคาสินค้าหนึ่งชิ้นมีภาษีอยู่เท่าไร" icon={<PieChart className="h-4 w-4" />}>
          <PriceBreakdown />
        </CalcShell>
      );
  }
}
