"use client";
import React from "react";
import AppLayout from "../components/AppLayout";
import PDFUploader from "../components/PDFUploader";

export default function Viewer() {
  return (
    <AppLayout>
      <PDFUploader />
    </AppLayout>
  );
}
