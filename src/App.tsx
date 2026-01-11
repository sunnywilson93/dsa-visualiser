import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ScrollToTop } from '@/components/ScrollToTop'
import { HomePage, CategoryPage, PracticePage } from '@/pages'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:categoryId" element={<CategoryPage />} />
        <Route path="/:categoryId/:problemId" element={<PracticePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
