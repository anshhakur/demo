"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { BagProvider } from "@/components/bag/BagProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <BagProvider>{children}</BagProvider>
    </MotionConfig>
  );
}
