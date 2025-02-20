import {
  useParams,
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useYear } from "../context/YearContext";

function SportPage() {
  const { sportName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedYear } = useYear();

  const formattedSportName =
    sportName?.charAt(0).toUpperCase() + sportName?.slice(1);

  const tabs = [
    { path: "leaderboard", label: "Leaderboard" },
    { path: "match-facts", label: "Match Facts" },
    { path: "match-rules", label: "Match Rules" },
    { path: "gallery", label: "Photo Gallery" },
  ];

  useEffect(() => {
    // Redirect to the leaderboard tab if no specific tab is visited
    if (location.pathname === `/sport/${sportName}`) {
      navigate("leaderboard");
    }
  }, []); //leaving the dependencies array is also fine as SportPage component will unmount and will receive new sportName and location.pathname props whenver we leave the page

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center text-blue-500 hover:text-blue-600"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mt-4">
          {formattedSportName}
        </h1>
      </div>

      <div className="mb-8">
        <nav className="flex space-x-4">
          {tabs.map((tab) => (
            <Link
              key={tab.path}
              to={tab.path}
              className={`px-4 py-2 rounded-lg transition-colors ${
                location.pathname.includes(tab.path)
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <Outlet context={{ sportName, selectedYear }} />
      </div>
    </div>
  );
}

export default SportPage;
