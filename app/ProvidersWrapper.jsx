"use client";

import { NextUIProvider } from "@nextui-org/react";
import NextTopLoader from "@/components/NextTopLoader";
import ErrorBoundary from "./ErrorBoundary";

export default function ProvidersWrapper({ children }) {
  

  return (
    <NextUIProvider>
      <NextTopLoader />
      <ErrorBoundary>{children}</ErrorBoundary>
    </NextUIProvider>
  );
}
