import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../auth/AuthProvider";

export default function SingleBoardView() {
    const { boardId } = useParams();
    const { user } = useContext(AuthContext);
    const [feedbacks, setFeedbacks] = useState([]);
    const [singleBoardView, setSingleBoardView] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFeedbackId, setEditingFeedbackId] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [voteMessage, setVoteMessage] = useState("");
    const [votedFeedbackIds, setVotedFeedbackIds] = useState([]);
    const [editedFeedbackIds, setEditedFeedbackIds] = useState([]);

    const fetchSingleBoardView = async () => {
        try {
            const response = await api.get(`/boards/${boardId}`);
            setSingleBoardView(response.data.boardName || "");
            setFeedbacks(response.data.feedbackDtoList || []);
        } catch (error) {
            console.error("Failed to fetch feedback:", error);
        }
    };

    useEffect(() => {
        fetchSingleBoardView();
    }, [boardId]);

    const resetFeedbackModal = () => {
        setIsModalOpen(false);
        setEditingFeedbackId(null);
        setErrorMessage("");
        setTitle("");
        setDescription("");
    };

    const openAddFeedbackModal = () => {
        resetFeedbackModal();
        setIsModalOpen(true);
    };

    const openEditFeedbackModal = (feedback) => {
        setEditingFeedbackId(feedback.feedbackId ?? feedback.id);
        setTitle(feedback.title || "");
        setDescription(feedback.description || "");
        setErrorMessage("");
        setIsModalOpen(true);
    };

    const handleFeedbackSubmit = async (event) => {
        event.preventDefault();

        if (!title.trim() || !description.trim()) {
            setErrorMessage("Please enter both title and description.");
            return;
        }

        setIsSubmitting(true);
        setErrorMessage("");

        const payload = {
            title: title.trim(),
            description: description.trim(),
            ownerName: user || localStorage.getItem("user") || "Anonymous",
        };

        try {
            if (editingFeedbackId) {
                await api.patch(`/boards/feedback/${editingFeedbackId}`, payload);
                setEditedFeedbackIds((prev) => (prev.includes(editingFeedbackId) ? prev : [...prev, editingFeedbackId]));
                setVoteMessage("Feedback updated.");
            } else {
                await api.post(`/boards/${boardId}/feedback`, {
                    ...payload,
                    status: "SUBMITTED",
                });
                setVoteMessage("Feedback added.");
            }

            await fetchSingleBoardView();
            resetFeedbackModal();
        } catch (error) {
            console.error("Failed to save feedback:", error);
            setErrorMessage(
                editingFeedbackId ? "Unable to update feedback right now." : "Unable to add feedback right now."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVoteToggle = async (feedbackId) => {
        const hasVoted = votedFeedbackIds.includes(feedbackId);
        const nextVoteState = !hasVoted;
        setVoteMessage("");

        setVotedFeedbackIds((prev) =>
            nextVoteState ? [...prev, feedbackId] : prev.filter((id) => id !== feedbackId)
        );

        setFeedbacks((prevFeedbacks) =>
            prevFeedbacks.map((feedback) => {
                const currentFeedbackId = feedback.feedbackId ?? feedback.id;
                if (currentFeedbackId !== feedbackId) {
                    return feedback;
                }

                return {
                    ...feedback,
                    voteCount: Math.max(0, (feedback.voteCount || 0) + (nextVoteState ? 1 : -1)),
                };
            })
        );

        try {
            const payload = {
                email: user || localStorage.getItem("user") || "Anonymous",
            };
            await api.post(`/boards/feedback/${feedbackId}/vote`, payload);
            await fetchSingleBoardView();
            setVoteMessage(nextVoteState ? "Vote recorded." : "Vote removed.");
        } catch (error) {
            console.error("Failed to update vote:", error);

            const errorMessageText = error.response?.data?.message || error.message || "";
            const isDuplicateVoteError =
                error.response?.status === 409 ||
                error.response?.status === 400 ||
                error.response?.status === 500 ||
                /duplicate key|unique constraint|already voted/i.test(errorMessageText);

            setVotedFeedbackIds((prev) =>
                nextVoteState ? prev.filter((id) => id !== feedbackId) : [...prev, feedbackId]
            );
            setFeedbacks((prevFeedbacks) =>
                prevFeedbacks.map((feedback) => {
                    const currentFeedbackId = feedback.feedbackId ?? feedback.id;
                    if (currentFeedbackId !== feedbackId) {
                        return feedback;
                    }

                    return {
                        ...feedback,
                        voteCount: Math.max(0, (feedback.voteCount || 0) + (nextVoteState ? -1 : 1)),
                    };
                })
            );

            if (isDuplicateVoteError) {
                await fetchSingleBoardView();
                setVoteMessage("You have already voted for this feedback.");
            } else {
                setVoteMessage("Unable to update vote right now.");
            }
        }
    };

    const handleStatusChange = async (feedbackId, newStatus) => {
        try {
            await api.patch(`/boards/feedback/${feedbackId}/status`, { status: newStatus });
            await fetchSingleBoardView();
            setVoteMessage(`Status updated to ${newStatus}.`);
        } catch (error) {
            console.error("Failed to update status:", error);
            setVoteMessage("Unable to update status right now.");
        }
    };

    const handleDeleteFeedback = async (feedbackId) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this feedback?");
        if (!isConfirmed) {
            return;
        }

        try {
            await api.delete(`/boards/feedback/${feedbackId}`);
            await fetchSingleBoardView();
            setVoteMessage("Feedback deleted.");
        } catch (error) {
            console.error("Failed to delete feedback:", error);
            setVoteMessage("Unable to delete feedback right now.");
        }
    };

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-6">
                <h5 className="text-2xl font-bold">{singleBoardView}</h5>
                <button
                    type="button"
                    onClick={openAddFeedbackModal}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Add new feedback
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold">{editingFeedbackId ? "Edit feedback" : "Add new feedback"}</h3>
                            <button
                                type="button"
                                onClick={resetFeedbackModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(event) => setTitle(event.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter a title"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value)}
                                    className="min-h-28 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Describe your feedback"
                                    required
                                />
                            </div>

                            {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={resetFeedbackModal}
                                    className="rounded-md border border-gray-300 px-4 py-2 text-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300"
                                >
                                    {isSubmitting ? (editingFeedbackId ? "Updating..." : "Submitting...") : editingFeedbackId ? "Update" : "Submit"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <h5 className="text-xl font-semibold mb-4">Feedbacks</h5>
            {voteMessage && <p className="mb-3 text-sm text-blue-600">{voteMessage}</p>}

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-100 text-gray-700 text-sm uppercase text-left">
                        <tr>
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Description</th>
                            <th className="px-6 py-4">Owner</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Votes</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbacks.map((feedback) => {
                            const feedbackId = feedback.feedbackId ?? feedback.id;

                            return (
                                <tr key={feedbackId} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">{feedback.title}</td>
                                    <td className="px-6 py-4">{feedback.description}</td>
                                    <td className="px-6 py-4">
                                        <p>{editedFeedbackIds.includes(feedbackId) ? "Edited by user" : "Submitted by user"}</p>
                                        <h5>{feedback.ownerName}</h5>
                                        {editedFeedbackIds.includes(feedbackId) && <p className="text-xs text-gray-500">Edited / Updated</p>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={feedback.status || "SUBMITTED"}
                                            onChange={(event) => handleStatusChange(feedbackId, event.target.value)}
                                            className={`rounded-md border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                feedback.status === "SUBMITTED"
                                                    ? "border-green-200 bg-green-100 text-green-700"
                                                    : feedback.status === "PLANNED"
                                                    ? "border-purple-200 bg-purple-100 text-purple-700"
                                                    : feedback.status === "IN_PROGRESS"
                                                    ? "border-yellow-200 bg-yellow-100 text-yellow-700"
                                                    : feedback.status === "DONE"
                                                    ? "border-blue-200 bg-blue-100 text-blue-700"
                                                    : "border-red-200 bg-red-100 text-red-700"
                                            }`}
                                        >
                                            <option value="SUBMITTED">SUBMITTED</option>
                                            <option value="PLANNED">PLANNED</option>
                                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                                            <option value="DONE">DONE</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={votedFeedbackIds.includes(feedbackId)}
                                                onChange={() => handleVoteToggle(feedbackId)}
                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="font-semibold text-sm">{feedback.voteCount}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => openEditFeedbackModal(feedback)}
                                                className="rounded p-2 text-blue-600 hover:bg-blue-50"
                                                title="Edit feedback"
                                                aria-label={`Edit feedback ${feedback.title}`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.379-8.379-2.828-2.828z" />
                                                </svg>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteFeedback(feedbackId)}
                                                className="rounded p-2 text-red-600 hover:bg-red-50"
                                                title="Delete feedback"
                                                aria-label={`Delete feedback ${feedback.title}`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M8.586 2.586A2 2 0 0110 2h.001a2 2 0 011.414.586L12 4h3a1 1 0 110 2h-1v9a2 2 0 01-2 2H8a2 2 0 01-2-2V6H5a1 1 0 110-2h3l.586-1.414zM8 6v9h4V6H8zm2-2.414L10.414 4h-.828L10 3.586z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

