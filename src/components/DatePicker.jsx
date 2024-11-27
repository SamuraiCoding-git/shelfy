import React, { useState } from "react";

export default function DatePicker({ onClose, onSave }) {
    const [selectedDays, setSelectedDays] = useState([]);
    const [time, setTime] = useState("12:00");

    const daysOfWeek = ["1", "8", "15", "22", "29"]; // Example days to match weekly repeat logic.

    const toggleDay = (day) => {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    const handleSave = () => {
        onSave({ selectedDays, time });
        onClose();
    };

    return (
        <div className="p-4 bg-[#101114] rounded-lg">
            <div className="text-white font-semibold mb-4">May 2024</div>
            <div className="grid grid-cols-7 gap-2 text-center">
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`py-2 rounded ${
                            selectedDays.includes(day.toString())
                                ? "bg-[#1D77FF] text-white"
                                : daysOfWeek.includes(day.toString())
                                    ? "bg-[#1e1f24] text-[#1D77FF]"
                                    : "bg-[#1e1f24] text-white"
                        }`}
                    >
                        {day}
                    </button>
                ))}
            </div>
            <div className="mt-4">
                <label htmlFor="time" className="block text-white text-sm mb-2">
                    Time
                </label>
                <input
                    type="time"
                    id="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-2 rounded bg-[#1e1f24] text-white"
                />
            </div>
            <div className="flex justify-end mt-4">
                <button
                    onClick={handleSave}
                    className="bg-[#1D77FF] text-white py-2 px-4 rounded mr-2"
                >
                    Save
                </button>
                <button
                    onClick={onClose}
                    className="bg-[#1e1f24] text-white py-2 px-4 rounded"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};
