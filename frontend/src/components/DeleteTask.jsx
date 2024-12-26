import React, {useEffect} from "react";
import {useTags} from "../context/TagsContext.jsx";

const DeleteTask = ( { onClose, setCurrentHeight, task}) => {
    const { deleteTodo } = useTags();

    const handleDeleteTask = () => {
        deleteTodo(task);
        onClose();
    }

    useEffect(() => {
        setCurrentHeight(25);
    }, []);

    return (
        <>
            <div className="container mx-auto p-4">
                <h1 className="text-lg font-semibold -mt-4 mb-4 text-center">Do you really want to delete this task?</h1>
                <div className="mt-8 flex flex-row justify-between gap-3">
                    <button
                        className="w-full px-6 py-3 bg-[#1E1F24] text-white font-bold rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl focus:outline-none"
                    >
                        Cancel
                    </button>
                    <button
                        className={`w-full px-6 py-3 font-bold rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl focus:outline-none text-[#FF3E3D] bg-[#30141C]`}
                        onClick={handleDeleteTask}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </>
    )
}

export default DeleteTask;