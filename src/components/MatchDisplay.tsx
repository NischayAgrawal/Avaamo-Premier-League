import React from "react";

const MatchDisplay = ({ match, sportName }) => {
  // Exit early with a loading state if match is undefined
  if (!match) {
    return <div className="p-4 text-gray-500">Loading match data...</div>;
  }

  // Check if this is a set-based sport
  const isSetBasedSport = [
    "badminton",
    "table-tennis",
    "volleyball",
    "throwball",
  ].includes(sportName || "");

  // For set-based sports, calculate total points across sets
  const team1TotalPoints =
    isSetBasedSport && match.team1?.sets
      ? match.team1.sets.reduce((a, b) => a + b, 0)
      : null;

  const team2TotalPoints =
    isSetBasedSport && match.team2?.sets
      ? match.team2.sets.reduce((a, b) => a + b, 0)
      : null;

  // Count sets won by each team for set-based sports
  const team1SetsWon =
    isSetBasedSport && match.team1?.sets && match.team2?.sets
      ? match.team1.sets.filter((score, idx) => score > match.team2.sets[idx])
          .length
      : 0;

  const team2SetsWon =
    isSetBasedSport && match.team1?.sets && match.team2?.sets
      ? match.team2.sets.filter((score, idx) => score > match.team1.sets[idx])
          .length
      : 0;

  // Determine if a team won
  const team1Score = match.team1?.score || "0";
  const team2Score = match.team2?.score || "0";
  const team1Won = isSetBasedSport
    ? team1SetsWon > team2SetsWon
    : team1Score > team2Score;
  const team2Won = isSetBasedSport
    ? team2SetsWon > team1SetsWon
    : team2Score > team1Score;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-300 space-y-4">
      {/* Team 1 */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-lg font-bold text-gray-800">
            {match.team1?.name || "Team 1"}
          </span>

          {/* For set-based sports, show individual set scores */}
          {isSetBasedSport && match.team1?.sets && (
            <div className="flex flex-wrap gap-2 mt-1 text-sm text-gray-600">
              {match.team1.sets.map((set, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded ${
                    (match.team1.sets[index] || 0) >
                    (match.team2?.sets?.[index] || 0)
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Set {index + 1}: {set}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Display score based on sport type */}
        <div className="text-right">
          {isSetBasedSport ? (
            <>
              <span
                className={`text-xl font-bold ${
                  team1Won ? "text-green-600" : "text-gray-600"
                }`}
              >
                {team1SetsWon}
              </span>
              <div className="text-sm text-gray-500 mt-1">
                Sets ({team1TotalPoints} pts)
              </div>
            </>
          ) : (
            <span
              className={`text-2xl font-extrabold ${
                team1Won ? "text-green-600" : "text-gray-600"
              }`}
            >
              {match.team1?.score || "0"}
            </span>
          )}
        </div>
      </div>

      {/* Team 2 */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-lg font-bold text-gray-800">
            {match.team2?.name || "Team 2"}
          </span>

          {/* For set-based sports, show individual set scores */}
          {isSetBasedSport && match.team2?.sets && (
            <div className="flex flex-wrap gap-2 mt-1 text-sm text-gray-600">
              {match.team2.sets.map((set, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded ${
                    (match.team2.sets[index] || 0) >
                    (match.team1?.sets?.[index] || 0)
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Set {index + 1}: {set}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Display score based on sport type */}
        <div className="text-right">
          {isSetBasedSport ? (
            <>
              <span
                className={`text-xl font-bold ${
                  team2Won ? "text-green-600" : "text-gray-600"
                }`}
              >
                {team2SetsWon}
              </span>
              <div className="text-sm text-gray-500 mt-1">
                Sets ({team2TotalPoints} pts)
              </div>
            </>
          ) : (
            <span
              className={`text-2xl font-extrabold ${
                team2Won ? "text-green-600" : "text-gray-600"
              }`}
            >
              {match.team2?.score || "0"}
            </span>
          )}
        </div>
      </div>

      {/* Result display
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-gray-700">
          <span className="font-medium text-gray-600">Winner:</span>{" "}
          <span className="font-bold text-green-600">
            {match.result === "Draw" ? "Draw" : match.result || "Pending"}
          </span>
        </p>
      </div> */}
    </div>
  );
};

// Add default props
MatchDisplay.defaultProps = {
  match: {
    team1: { name: "Team 1", score: "0", sets: [0, 0, 0] },
    team2: { name: "Team 2", score: "0", sets: [0, 0, 0] },
    result: "Pending",
  },
  sportName: "",
};

export default MatchDisplay;
