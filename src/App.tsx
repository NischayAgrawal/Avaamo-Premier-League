// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SportPage from "./pages/SportPage";
import Leaderboard from "./components/Leaderboard";
import MatchFacts from "./components/MatchFacts";
import MatchRules from "./components/MatchRules";
import Gallery from "./components/Gallery";
import LeaderboardPage from "./pages/LeaderboardPage"; // New import
import { YearProvider } from "./context/YearContext";

function App() {
  return (
    <YearProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sport/:sportName" element={<SportPage />}>
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="match-facts" element={<MatchFacts />} />
              <Route path="match-rules" element={<MatchRules />} />
              <Route path="gallery" element={<Gallery />} />
            </Route>
            <Route path="/leaderboard" element={<LeaderboardPage />} />{" "}
            {/* New route */}
          </Routes>
        </div>
      </Router>
    </YearProvider>
  );
}

export default App;
