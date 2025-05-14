"use client";
import React, { useEffect, useRef, useState } from "react";
import AppLayout from "../components/AppLayout";
import dynamic from 'next/dynamic';

// Dynamically import PDF.js with no SSR
const PDFViewer = dynamic(() => import('../components/PDFViewer'), {
  ssr: false,
});

export default function Viewer() {
  return (
    <AppLayout>
      <div className="flex flex-col items-center p-4">
        <PDFViewer />
      </div>
    </AppLayout>
  );
}
