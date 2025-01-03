import React, { useState } from 'react';

const TimePicker = ({ onTimeSelect, onClose }) => {
    const [hour, setHour] = useState(12);
    const [minute, setMinute] = useState(0);
    const [selectedTime, setSelectedTime] = useState(null);

    const handleTimeChange = () => {
        const selectedTime = `${hour}:${minute < 10 ? '0' + minute : minute}`;
        setSelectedTime(selectedTime); // Update the selected time
        onTimeSelect(selectedTime); // Call the onTimeSelect prop to pass the selected time
        onClose(); // Close after selecting time
    };

    // Update hour to 24-hour format
    const incrementHour = () => setHour((prev) => (prev === 23 ? 0 : prev + 1));
    const decrementHour = () => setHour((prev) => (prev === 0 ? 23 : prev - 1));

    // Update minutes (0-59)
    const incrementMinute = () => setMinute((prev) => (prev === 59 ? 0 : prev + 1));
    const decrementMinute = () => setMinute((prev) => (prev === 0 ? 59 : prev - 1));

    return (
        <div className="bg-[#1E1F24] px-[calc(18%)] py-[calc(15%)] rounded-lg shadow-lg">
            <div className="flex flex-col items-center text-white space-y-4">
                {/* Display selected time */}
                <div className="text-lg font-medium">
                    {selectedTime ? selectedTime : 'Select Time'}
                </div>

                {/* Time selection */}
                <div className="flex justify-between gap-12 text-[24px] font-medium">
                    <div className="flex flex-col items-center">
                        <img
                            src="/assets/icons/arrow-up.svg" // Replace with your actual path
                            alt="Increment Hour"
                            className="cursor-pointer"
                            onClick={incrementHour}
                        />
                        <div>{hour < 10 ? '0' + hour : hour}</div>
                        <img
                            src="/assets/icons/arrow-down.svg" // Replace with your actual path
                            alt="Decrement Hour"
                            className="cursor-pointer"
                            onClick={decrementHour}
                        />
                    </div>
                    <div className="flex flex-col items-center">
                        <img
                            src="/assets/icons/arrow-up.svg" // Replace with your actual path
                            alt="Increment Minute"
                            className="cursor-pointer"
                            onClick={incrementMinute}
                        />
                        <div>{minute < 10 ? '0' + minute : minute}</div>
                        <img
                            src="/assets/icons/arrow-down.svg" // Replace with your actual path
                            alt="Decrement Minute"
                            className="cursor-pointer"
                            onClick={decrementMinute}
                        />
                    </div>
                </div>

                {/* Confirm selection button */}
                <button
                    onClick={handleTimeChange}
                    className="bg-[#1D77FF] text-white px-6 py-2 rounded-lg mt-4"
                >
                    Confirm Time
                </button>
            </div>
        </div>
    );
};

export default TimePicker;
