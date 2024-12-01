import React, { useState } from 'react';

const TimePicker = ({ onTimeSelect, onClose }) => {
    const [hour, setHour] = useState(12);
    const [minute, setMinute] = useState(0);

    const handleTimeChange = () => {
        const selectedTime = `${hour}:${minute < 10 ? '0' + minute : minute}`;
        onTimeSelect(selectedTime);
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
        </div>
    );
};

export default TimePicker;
