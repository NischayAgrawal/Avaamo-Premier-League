import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SportPage from "./pages/SportPage";
import AggregatedLeaderboard from "./components/AggregatedLeaderboard";
import ManageSports from "./components/ManageSports";
import ManageTeams from "./components/ManageTeams";
import Leaderboard from "./components/Leaderboard";
import MatchFacts from "./components/MatchFacts";
import MatchRules from "./components/MatchRules";
import Gallery from "./components/Gallery";
import { YearProvider } from "./context/YearContext";

function App() {
  return (
    <YearProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            {/* HomePage with nested routes */}
            <Route path="/" element={<HomePage />}>
              <Route index element={<AggregatedLeaderboard />} />
              <Route path="manage-sports" element={<ManageSports />} />
              <Route path="manage-teams" element={<ManageTeams />} />
            </Route>
            {/* SportPage with nested routes */}
            <Route path="/sport/:sportName" element={<SportPage />}>
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="match-facts" element={<MatchFacts />} />
              <Route path="match-rules" element={<MatchRules />} />
              <Route path="gallery" element={<Gallery />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </YearProvider>
  );
}

export default App;
