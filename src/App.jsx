// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import BoardsList from "./pages/BoardsList";
import SingleBoardView from "./pages/SingleBoardView";
import Login from "./pages/Login";
import './App.css';

export default function App() {
  return (
  
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Protected routes inside layout */}
      <Route path="/" element={<Layout />}>
        <Route path="boards" element={<BoardsList />} />
        <Route path="boards/:boardId" element={<SingleBoardView />} />
        {/* Optionally: 404 fallback */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Route>
    </Routes>
  );
}


/* import { Routes, Route} from "react-router-dom";
import Login from "./pages/Login.jsx";
import BoardsList from "./pages/BoardsList.jsx";
import SingleBoardView from "./pages/SingleBoardView.jsx";
import './App.css';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/boards" element={<BoardsList />} />
      <Route path="/boards/:boardId" element={<SingleBoardView />} />
    </Routes>
  );
}*/