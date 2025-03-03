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

  const formattedSportName = sportName
    ?.split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  const tabs = [
    { path: "leaderboard", label: "Leaderboard" },
    { path: "match-facts", label: "Matches" },
    { path: "match-rules", label: "Rules" },
    { path: "gallery", label: "Gallery" },
  ];

  useEffect(() => {
    if (location.pathname === `/sport/${sportName}`) {
      navigate("leaderboard");
    }
  }, [location.pathname, navigate, sportName]);

  return (
    <div className="container mx-auto px-6 py-12 space-y-12 max-w-6xl">
      <div className="flex flex-col items-start">
        <Link
          to="/"
          className="group inline-flex items-center text-blue-600 hover:text-blue-800 transition-all duration-300"
        >
          <span className="bg-blue-50 p-2 rounded-full mr-3 group-hover:bg-blue-100 transition-all duration-300">
            <ArrowLeft className="w-5 h-5" />
          </span>
          <span className="text-lg font-medium">Back to Home</span>
        </Link>

        <div className="w-full flex justify-center mt-6">
          <h1 className="text-5xl font-bold text-gray-900 relative">
            <span className="relative z-10">{formattedSportName}</span>
            <span className="absolute -bottom-3 left-0 right-0 h-3 bg-blue-100 z-0 opacity-50 rounded-full"></span>
          </h1>
        </div>
      </div>

      <nav className="flex justify-center overflow-x-auto py-2">
        <div className="inline-flex items-center p-1 bg-gray-50 rounded-xl shadow-sm">
          {tabs.map((tab) => (
            <Link
              key={tab.path}
              to={tab.path}
              className={`px-6 py-3 rounded-xl text-lg font-medium transition-all duration-300
                ${
                  location.pathname.includes(tab.path)
                    ? "bg-blue-600 text-white shadow-md transform scale-105"
                    : "text-gray-600 hover:bg-gray-100"
                }
              `}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <Outlet context={{ sportName, selectedYear }} />
      </div>
    </div>
  );
}

export default SportPage;
