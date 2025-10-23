import { use, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function SingleBoardView() {
    const { boardId } = useParams();
    const [feedbacks, setFeedback] = useState([]);
    const [singleBoardView, setSingleBoardView] = useState("");

    useEffect(() => {
        const fetchSingleBoardView = async () => {
            try {
                const response = await api.get(`/boards/${boardId}`);
                setSingleBoardView(response.data.boardName);
                setFeedback(response.data.feedbackDtoList || []);
                console.log(singleBoardView)
            } catch (error) {
                console.error("Failed to fetch feedback:", error);
            }
        };

        fetchSingleBoardView();
    }, [boardId]);

    const addNewFeedback = () => {
        // Logic to add new feedback
        console.log("Add new feedback clicked");
    }

    return (
        <div className="p-8">
            <h5 className="text-2xl font-bold mb-6">{singleBoardView}</h5>
            &nbsp;
             <button
                onClick={addNewFeedback}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Add new feedback
            </button>
            <br />   <br />
            <h5 className="text-xl font-semibold mb-4">Feedbacks</h5>
    
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-gray-700 text-sm uppercase text-left">
                    <tr>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Owner</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Votes</th>
                    </tr>
                </thead>
                <tbody>
                    {feedbacks.map(feedback => (
                    <tr key={feedback.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">{feedback.title}</td>
                        <td className="px-6 py-4">{feedback.description}</td>
                        <td className="px-6 py-4"><p>Submitted by user</p><h5>{feedback.ownerName}</h5></td>
                        <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium
                            ${feedback.status === 'SUBMITTED' ? 'bg-green-100 text-green-700' :
                            feedback.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700' :
                            feedback.status === 'DONE' ? 'bg-blue-100 text-blue-700' :
                            'bg-red-100 text-red-700'}
                        `}>
                            {feedback.status}
                        </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-center">{feedback.voteCount}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>
    );
}

