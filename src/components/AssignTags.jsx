import React, { useEffect } from "react";
import { useTags } from "../context/TagsContext";
import TagCard from "./TagCard.jsx";

const AssignTags = ({ toggleTag, setCurrentHeight, onSave }) => {
    const {
        tags, // Tags from context (with checked state)
        selectedTags, // Selected tags (checked ones)
        updateTag,
        selectTag,
    } = useTags();

    useEffect(() => {
        setCurrentHeight(60); // Adjust height for UI (if needed)
    }, [tags]);

    // Handle tag selection (toggle checked state)
    const handleSelectTag = (tag) => {
        if (selectedTags.includes(tag)) {
            // Deselect the tag if it's already selected
            selectTag(tag); // This will remove the tag from selectedTags
        } else if (selectedTags.length < 2) {
            // Select the tag if there are less than 2 tags selected
            selectTag(tag); // This will add the tag to selectedTags
        }
    };

    const isSaveButtonActive = selectedTags.length > 0;
    const isDisabled = selectedTags.length >= 2; // Disable all checkboxes when there are 2 selected tags

    return (
        <>
            <div
                className="absolute left-1/2 transform -translate-x-1/2 top-2 w-9 h-1 rounded bg-[#1e1f24] cursor-pointer"
                onClick={() => toggleTag(true)}
            />
            <div className="container mx-auto p-4">
                <h1 className="text-lg font-semibold -mt-4 mb-4 text-center">Assign Tags</h1>

                {tags.length > 0 ? (
                    <div className="space-y-3">
                        <div
                            className={`flex flex-col gap-3 ${tags.length > 5 ? 'overflow-y-auto' : ''} max-h-64`}
                        >
                            {tags.map((tag) => (
                                <li key={tag.id} className="w-full flex flex-col gap-3">
                                    <TagCard
                                        tag={tag}
                                        handleSelect={handleSelectTag} // Pass the handler to toggle checked state
                                        handleEdit={updateTag}
                                        disabled={isDisabled && !selectedTags.includes(tag)} // Disable checkbox if 2 tags selected and tag not in selectedTags
                                    />
                                </li>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col justify-center items-center mt-8 w-full max-w-lg mx-auto">
                        <h2 className="text-[14px] text-center py-3 w-full">You don&#39;t have any tags yet</h2>
                        <button
                            className="px-6 py-2 bg-[#1D77FF] text-white font-bold rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl hover:from-[#8BC34A] hover:to-[#4CAF50] focus:outline-none flex items-center justify-center gap-2 w-1/2"
                        >
                            <img
                                src="/assets/icons/add.svg"
                                alt="Add"
                                className="w-5 h-5"
                            />
                            Create tag
                        </button>
                    </div>
                )}
                <div className="mt-8 flex flex-row justify-between gap-3">
                    <button
                        className="w-full px-6 py-3 bg-[#1E1F24] text-white font-bold rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl focus:outline-none"
                    >
                        Create Tag
                    </button>
                    <button
                        className={`w-full px-6 py-3 font-bold rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl focus:outline-none ${isSaveButtonActive ? 'bg-[#1D77FF] text-white' : 'bg-[#1E1F24] text-[#AEAEB4]'}`}
                        onClick={() => onSave(selectedTags)}
                        disabled={!isSaveButtonActive}
                    >
                        Save
                    </button>
                </div>
            </div>
        </>
    );
};

export default AssignTags;
