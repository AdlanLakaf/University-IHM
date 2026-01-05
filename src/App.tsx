import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Learning from './pages/Learning';
import LessonDetail from './pages/LessonDetail';
import Quiz from './pages/Quiz';
import FinalExam from './pages/FinalExam';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="learn" element={<Learning />} />
          <Route path="learn/:id" element={<LessonDetail />} />
          <Route path="quiz" element={<Quiz />} />
          <Route path="final-exam" element={<FinalExam />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
