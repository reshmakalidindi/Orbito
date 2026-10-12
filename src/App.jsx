import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import CategoryDetailPage from './components/CategoryDetailPage';
import WorkshopDetailPage from './components/WorkshopDetailPage';
import NotFoundPage from './components/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/categories/:categorySlug" element={<CategoryDetailPage />} />
        <Route path="/workshops/:workshopId" element={<WorkshopDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
