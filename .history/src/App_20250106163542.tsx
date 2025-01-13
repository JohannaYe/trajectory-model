import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './i18n';  // Import i18n configuration
import Layout from './components/Layout';
import Home from './pages/Home';
import Introduction from './pages/Introduction';
import Modeling from './pages/Modeling';
import Simulation from './pages/Simulation';
import Evaluation from './pages/Evaluation';
import KnowledgeBase from './pages/KnowledgeBase';
import 'antd/dist/reset.css'; // Import Ant Design styles

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="introduction" element={<Introduction />} />
          <Route path="modeling" element={<Modeling />} />
          <Route path="simulation" element={<Simulation />} />
          <Route path="evaluation" element={<Evaluation />} />
          <Route path="knowledge-base" element={<KnowledgeBase />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;