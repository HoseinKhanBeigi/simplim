"use client";

import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import PDFUploader from '../components/PDFUploader';

export default function AppPage() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <PDFUploader />
        </div>
      </main>
    </ProtectedRoute>
  );
} 