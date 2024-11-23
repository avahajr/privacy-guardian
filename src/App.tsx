import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import GoalsPage from "@/pages/goals.tsx";
import AnalysisPage from "@/pages/analysis.tsx";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<GoalsPage />} path="/goals" />
      <Route element={<AnalysisPage />} path="/breakdown" />
    </Routes>
  );
}

export default App;
