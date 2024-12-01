import React, { useState } from 'react';

const TimePicker = ({ onClose }) => {
    // State to keep track of the selected item
    const [selected, setSelected] = useState('None');

    // Handler for selecting an item
    const handleSelect = (value) => {
        setSelected(value);
    };

    return (
        <div className="bg-[#1E1F24] px-[calc(10%)] py-[calc(8%)] rounded-lg shadow-lg">
            <ul className="text-white space-y-1">
                {/* Example list items */}
                {['None', 'Daily', 'Weekly', 'Monthly'].map((value) => (
                    <li
                        key={value}
                        className={`flex items-center justify-between cursor-pointer rounded-lg gap-48 py-2 font-medium mr-2 
                            ${selected === value ? 'text-[#1D77FF]' : 'text-white'} 
                            transition-all`}
                        onClick={() => handleSelect(value)}
                    >
                        <span className="-ml-2">{value}</span>
                        {selected === value && (
                            <img
                                src="/assets/icons/tick.svg" // Replace with the correct path
                                alt="Selected"
                                className="w-6 h-6"
                            />
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TimePicker;
