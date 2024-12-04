// TagCard.jsx

import React, { useEffect, useState } from "react";

const TagCard = ({ tag, handleSelect = null, handleEdit = null, deleteSelectedTags = null, disabled }) => {
    const [checked, setChecked] = useState(tag.checked);

    useEffect(() => {
        setChecked(tag.checked); // Sync checked state with the parent state
    }, [tag]);

    const toggleTagStatus = () => {
        setChecked(!checked); // Toggle local checked state
        handleSelect(tag); // Pass the tag to parent to update the checked state
    };

    const handleDeleteTag = () => {
        deleteSelectedTags(tag);
    }

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                {/* Checkbox Wrapper */}
                {handleSelect && (
                    <div className="relative">
                        <label htmlFor={`tag-${tag.name}`}>
                            <input
                                type="checkbox"
                                id={`tag-${tag.name}`}
                                checked={checked}
                                onChange={toggleTagStatus}
                                disabled={disabled}
                                className="appearance-none w-6 h-6 opacity-0 cursor-pointer"
                            />
                            <img
                                src={
                                    checked
                                        ? "/assets/icons/checkbox-filled.svg"
                                        : "/assets/icons/checkbox-empty.svg"
                                }
                                alt="checkbox"
                                className="w-6 h-6 cursor-pointer -mt-7"
                            />
                        </label>
                    </div>
                )}

                {/* Tag Card */}
                <div
                    className="w-full h-10 px-3 gap-1 flex items-center justify-center rounded-xl font-semibold text-sm"
                    style={{backgroundColor: tag.color}}
                >
                    <span className="px-0.5">{tag.name}</span>
                    {!handleSelect && (
                        <button onClick={handleDeleteTag} className="w-5 h-5">
                            <img className="z-50 w-5 h-5" src="/assets/icons/dismiss.svg" alt="Delete"/>
                        </button>
                    )}
                </div>
            </div>

            {/* Edit Button */}
            {handleEdit && (
                <button
                    className="ml-3 p-2"
                    onClick={() => handleEdit(tag)}
                >
                    <img
                        src="/assets/icons/tag/edit.svg"
                        alt="edit tag"
                        className="w-5 h-5"
                    />
                </button>
            )}
        </div>
    );
};

export default TagCard;
