import React, { useEffect, useState } from "react";
import { useTags } from "../context/TagsContext";
import ColorPicker from "./ColorPicker.jsx";
import DeleteTag from "./DeleteTag.jsx";

const CreateTag = ({ toggleTag, setCurrentHeight, editTag = false, tag = false }) => {
    const { tags, addTag, updateTag } = useTags();
    const [tagColor, setTagColor] = useState('#1E79FF');
    const [tagName, setTagName] = useState('');
    const [isChooseColorClicked, setIsChooseColorClicked] = useState(false);
    const [showDeleteTag, setShowDeleteTag] = useState(false);

    // Set tag data when `tag` changes and ensure controlled inputs are never undefined
    useEffect(() => {
        setCurrentHeight(40); // Adjust height for UI (if needed)
        if (tag) {
            setTagName(tag.name || '');
            setTagColor(tag.color || '#1E79FF'); // Set default color if no tag.color
        } else {
            setTagName(''); // Default empty string if no tag
            setTagColor('#1E79FF'); // Set default color if no tag
        }
    }, [tags, tag, setCurrentHeight]);

    const chooseColor = (color) => {
        setTagColor(color);
        setIsChooseColorClicked(!isChooseColorClicked);
    };

    const toggleChooseColor = () => {
        setIsChooseColorClicked(!isChooseColorClicked);
    };

    const isSaveButtonActive = tagName !== "";

    const handleAddTag = () => {
        addTag({ "name": tagName, "color": tagColor });
        toggleTag(true);
    };

    const handleEditTag = () => {
        updateTag(tag.tag_id, { "name": tagName, "color": tagColor });
        console.log(`updateTag: ${tag.tag_id, { "name": tagName, "color": tagColor }}`)
        toggleTag(true);
    };

    const handleShowDeleteTag = () => {
        setShowDeleteTag(!showDeleteTag);
    };

    return (
        <>
            <div
                className="absolute left-1/2 transform -translate-x-1/2 top-2 w-9 h-1 rounded bg-[#1e1f24] cursor-pointer"
                onClick={() => toggleTag(true)}
            />
            <div className="container mx-auto p-4">
                <h1 className="text-lg font-semibold -mt-4 mb-4 text-center">{editTag ? "Edit Tag" : "Create Tag"}</h1>
                {/* Input Section */}
                <div className="flex items-center mb-2 py-3 mt-6 text-[#47474E] border-[#2C2D35] px-3 rounded-xl border-2 w-full">
                    <button className="color-preview" onClick={toggleChooseColor}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="url(#paint0_radial)" />
                            <circle cx="12" cy="12" r="7" fill={tagColor} stroke="#101114" strokeWidth="2" />
                            <defs>
                                <linearGradient id="paint0_radial" cx="50%" cy="50%" r="50%" gradientUnits="userSpaceOnUse">
                                    <stop offset="0%" stopColor="#0ABF7E" />
                                    <stop offset="12.5%" stopColor="#33D72F" />
                                    <stop offset="25%" stopColor="#FF9C07" />
                                    <stop offset="37.5%" stopColor="#FF3E3D" />
                                    <stop offset="50%" stopColor="#EF3DFF" />
                                    <stop offset="62.5%" stopColor="#6F3DFF" />
                                    <stop offset="75%" stopColor="#1E79FF" />
                                    <stop offset="87.5%" stopColor="#1EAEFF" />
                                    <stop offset="100%" stopColor="#0ABF7E" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </button>

                    <div className="flex items-center w-full">
                        <input
                            type="text"
                            className="outline-none caret-primary text-white bg-transparent ml-2 cursor-pointer w-full"
                            placeholder="Title"
                            value={tagName}
                            onChange={(e) => setTagName(e.target.value)}
                            onFocus={() => setCurrentHeight(80)}
                            onBlur={() => setCurrentHeight(30)}
                        />
                    </div>
                </div>
                {/* Save Button */}
                <div className="mt-8 flex flex-row justify-between gap-3">
                    {editTag && (
                        <button
                            className={`w-full px-6 py-3 font-bold rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl focus:outline-none text-[#FF3E3D] bg-[#30141C]`}
                            onClick={handleShowDeleteTag}
                        >
                            Delete
                        </button>
                    )}
                    <button
                        className={`w-full px-6 py-3 font-bold rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl focus:outline-none ${isSaveButtonActive ? 'bg-[#1D77FF] text-white' : 'bg-[#1E1F24] text-[#AEAEB4]'} border-2 border-[#2C2D35]`}
                        disabled={!isSaveButtonActive}
                        onClick={editTag ? handleEditTag : handleAddTag}
                    >
                        Save
                    </button>
                </div>
            </div>

            {/* Move Color Picker to the right */}
            {isChooseColorClicked && (
                <div className="absolute ml-4">
                    <ColorPicker
                        handleColor={chooseColor}
                        chosenColor={tagColor}
                    />
                </div>
            )}

            {showDeleteTag && (
                <div className="fixed top-0 left-0 w-full h-full bg-[#101114] p-6 rounded-t-3xl flex flex-col items-start justify-start z-60">
                    <DeleteTag
                        toggleTag={toggleTag}
                        setCurrentHeight={setCurrentHeight}
                        tag={tag}
                    />
                </div>
            )}
        </>
    );
};

export default CreateTag;
