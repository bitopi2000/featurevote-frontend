import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function BoardsList() {
    const [boards, setBoards] = useState([]);
    const [feature, setFeature] = useState("");
    const [suggestion, setSuggestion] = useState("");
    const [expanded, setExpanded] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const featchBoards = async () => {
            try {
                const response = await api.get("/boards/list");
                setBoards(response.data);
            } catch (error) {
                console.error("Failed to fetch boards:", error);
            }
        };

        featchBoards();
    }, []);

    const suggestBoard = async () => {
        try {
            const response = await api.post("/ai/suggest-board", { 
                description: feature,
             });
             setSuggestion(response.data);
        } catch (error) {
            console.error("Failed to suggest board:", error);
        }
    };
    const getColor = (name) => {
      const nameSplit = name.split(" ") || [name];
      console.log(nameSplit);
      name = nameSplit[0];
      console.log(name);
      const map = {
        Web: 'bg-blue-100 border-blue-400',
        Mobile: 'bg-green-100 border-green-400',
        Admin: 'bg-yellow-100 border-yellow-400',
        API: 'bg-purple-100 border-purple-400',
      };
      return map[name] || 'bg-gray-100 border-gray-300';
    };

  const toggleExpand = (id) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  const singleBoardView = (boardId) => {
    navigate(`/boards/${boardId}`); 
  }

    return (
    <div className="p-6 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold mb-4">Available Boards</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {boards.map((board) => {
          const isExpanded = expanded === board.id;
          const colorClass = getColor(board.name);
          return (
            <div
              key={board.id}
              onClick={() => singleBoardView(board.id)}
              className={`cursor-pointer ${colorClass} border shadow-md rounded-xl p-4 transition-transform duration-300 hover:scale-105 flex flex-col justify-between aspect-square`}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {board.name}
              </h2>

              {isExpanded && (
                <p className="text-gray-700 text-sm mb-2 transition-opacity duration-200">
                  {board.description || "No description available"}
                </p>
              )}

              {isExpanded && (
                <div className="text-right text-xs text-gray-400">
                  ID: {board.id}
                </div>
              )}

              <div className="mt-auto text-right text-xs text-gray-700"
                   key={board.id}
                   onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(board.id);
                  }}>
                Click to {isExpanded ? "collapse" : "expand"}
              </div>
            </div>
          );
        })}
      </div>
      <br/><br/>
      <input
        type="text"
        value={feature}
        onChange={(e) => setFeature(e.target.value)}
        placeholder="Describe your feature"
        className="border p-2 w-full mb-2"
      />
      <button
        onClick={suggestBoard}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Suggest Board
      </button>

      {suggestion && (
        <div className="mt-4">
          <p className="font-semibold">Suggested Board:</p>
          <p>{suggestion}</p>
        </div>
      )}
    </div>
  );
}
