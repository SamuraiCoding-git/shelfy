import React, { useState } from 'react';

const ColorPicker = ({ chosenColor, handleColor }) => {
    const [clr, setClr] = useState('');

    const colors = [
        '#1E79FF',
        '#1EAEFF',
        '#6949FF',
        '#EF3DFF',
        '#FF3E3D',
        '#FF9C07',
        '#33D72F',
        '#0ABF7E',
    ];

    const selectColor = (color) => {
        setClr(color);
        handleColor(color); // Emit the selected color
    };

    return (
        <div className="absolute flex gap-4 items-center p-2 bg-[#1E1F24] rounded-xl">
            {colors.map((color) => (
                <div
                    key={color}
                    className="relative w-6 h-6 rounded-lg"
                    style={{ backgroundColor: color }}
                    onClick={() => selectColor(color)}
                    onKeyUp={(e) => e.key === 'Enter' && selectColor(color)}
                    tabIndex={0}
                >
                    {(chosenColor === color || clr === color) && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <img
                                src="/assets/icons/tag/select.svg"
                                alt="selected color"
                                className="w-4 h-4"
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ColorPicker;
