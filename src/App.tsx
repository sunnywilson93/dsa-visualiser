import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ScrollToTop } from '@/components/ScrollToTop'
import { HomePage, CategoryPage, PracticePage, ConceptsPage, ConceptPage, ConceptVisualizationPage } from '@/pages'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Concepts routes - must be before dynamic :categoryId */}
        <Route path="/concepts" element={<ConceptsPage />} />
        <Route path="/concepts/:conceptId" element={<ConceptPage />} />
        {/* Practice routes */}
        <Route path="/:categoryId" element={<CategoryPage />} />
        <Route path="/:categoryId/:problemId" element={<PracticePage />} />
        <Route path="/:categoryId/:problemId/concept" element={<ConceptVisualizationPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
