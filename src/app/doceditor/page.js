"use client";

import dynamic from "next/dynamic";
// import testData from "../../test-content/test-data.json";
import ProtectedRoute from "../components/ProtectedRoute";
import AppLayout from "../components/AppLayout";

// Dynamically import PlaygroundApp with no SSR
const PlaygroundApp = dynamic(() => import("../components/lexical/App"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center p-4">
      Loading editor...
    </div>
  ),
});

export default function DocEditor() {
  return (
    <AppLayout>
      <PlaygroundApp />
    </AppLayout>
  );
}
