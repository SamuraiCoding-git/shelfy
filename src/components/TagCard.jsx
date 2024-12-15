import React, { useEffect, useState } from "react";

const TagCard = ({
                     tag,
                     handleSelect = null,
                     handleEdit = false,
                     disabled,
                     onShowEdit, // New prop to indicate if this tag is being edited
                 }) => {
    const [checked, setChecked] = useState(tag.checked || false);

    useEffect(() => {
        setChecked(tag.checked || false);
    }, [tag]);

    const toggleTagStatus = () => {
        setChecked(!checked);
        handleSelect(tag);
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                {/* Checkbox */}
                {handleSelect && !onShowEdit && (
                    <div className="relative">
                        <label htmlFor={`tag-${tag.name}`}>
                            <input
                                type="checkbox"
                                id={`tag-${tag.tag_id}`}
                                checked={checked}
                                onChange={toggleTagStatus}
                                disabled={disabled}
                                className="appearance-none z-20 w-6 h-6 opacity-0 cursor-pointer"
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

                {/* Tag Card Content */}
                <div
                    className="w-full h-10 px-3 gap-1 flex items-center justify-center rounded-xl font-semibold text-sm"
                    style={{ backgroundColor: tag.color }}
                >
                    <span className="px-0.5">{tag.name}</span>
                </div>
            </div>

            {/* Edit Button */}
            {handleEdit && (
                <button className="ml-3 p-2" onClick={onShowEdit}>
                    <img src="/assets/icons/tag/edit.svg" alt="edit tag" className="w-5 h-5" />
                </button>
            )}
        </div>
    );
};

export default TagCard;
