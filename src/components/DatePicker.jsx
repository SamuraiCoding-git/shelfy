import React, { useState } from "react";

const DatePicker = () => {
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [date, setDate] = useState(new Date());

    const incrementHour = () => setHours((prev) => (prev + 1) % 24);
    const decrementHour = () => setHours((prev) => (prev - 1 + 24) % 24);
    const incrementMinute = () => setMinutes((prev) => (prev + 1) % 60);
    const decrementMinute = () => setMinutes((prev) => (prev - 1 + 60) % 60);

    const saveCalendar = () => {
        console.log("Saved date:", date);
        console.log("Time:", `${hours}:${minutes}`);
    };

    return (
        <div className="text-white">
            <div className="flex items-center justify-center gap-2 mb-4">
                <div className="flex flex-col items-center justify-center gap-1">
                    <button
                        className="bg-blue-500 text-white border-none p-1 rounded cursor-pointer hover:bg-blue-700 text-lg"
                        onClick={incrementHour}
                    >
                        ▲
                    </button>
                    <div className="font-sans text-xl">{hours.toString().padStart(2, "0")}</div>
                    <button
                        className="bg-blue-500 text-white border-none p-1 rounded cursor-pointer hover:bg-blue-700 text-lg"
                        onClick={decrementHour}
                    >
                        ▼
                    </button>
                </div>
                <span className="text-xl">:</span>
                <div className="flex flex-col items-center justify-center gap-1">
                    <button
                        className="bg-blue-500 text-white border-none p-1 rounded cursor-pointer hover:bg-blue-700 text-lg"
                        onClick={incrementMinute}
                    >
                        ▲
                    </button>
                    <div className="font-sans text-xl">{minutes.toString().padStart(2, "0")}</div>
                    <button
                        className="bg-blue-500 text-white border-none p-1 rounded cursor-pointer hover:bg-blue-700 text-lg"
                        onClick={decrementMinute}
                    >
                        ▼
                    </button>
                </div>
            </div>

            <div className="max-w-full mb-4">
                <input
                    type="date"
                    className="w-full p-2 border rounded bg-gray-800 text-white"
                    value={date.toISOString().split("T")[0]}
                    onChange={(e) => setDate(new Date(e.target.value))}
                />
            </div>

            <button
                className="w-full mt-6 bg-blue-500 text-white font-bold text-lg py-3 rounded text-center hover:bg-blue-700"
                onClick={saveCalendar}
            >
                Save
            </button>
        </div>
    );
};

export default DatePicker;
