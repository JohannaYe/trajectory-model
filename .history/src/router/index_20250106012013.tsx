import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import Introduction from '../pages/Introduction';
import Modeling from '../pages/Modeling';
import Simulation from '../pages/Simulation';
import Evaluation from '../pages/Evaluation/index';
import KnowledgeBase from '../pages/KnowledgeBase';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/introduction',
    element: <Introduction />,
  },
  {
    path: '/modeling',
    element: <Modeling />,
  },
  {
    path: '/simulation',
    element: <Simulation />,
  },
  {
    path: '/evaluation',
    element: <Evaluation />,
  },
  {
    path: '/knowledge-base',
    element: <KnowledgeBase />,
  }
]); 