import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import GetStarted from "./pages/GetStarted";
import Dashboard from "./pages/Dashboard";
import Roadmap from "./pages/Roadmap";
import Quizpage from "./pages/Quizpage";
import Notes from "./pages/Notes";
import ScorePage from "./pages/ScorePage"; // import ScorePage
function App() {
  return (
    <div className='bg-black/20'>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<GetStarted />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/quiz" element={<Quizpage />} />
         <Route path="/score" element={<ScorePage />} />
         <Route path="/notes" element={<Notes />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
