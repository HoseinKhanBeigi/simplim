"use client";
import React from "react";
import AppLayout from "../components/AppLayout";
import PDFUploader from "../components/PDFUploader";
import ProtectedRoute from "../components/ProtectedRoute";

export default function Viewer() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <PDFUploader />
      </AppLayout>
    </ProtectedRoute>
  );
}
