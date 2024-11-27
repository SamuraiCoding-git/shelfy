import React, { useState } from "react";

const DatePicker = () => {
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState("");
    const [repeat, setRepeat] = useState("None");

    const saveCalendar = () => {
        alert(`Date: ${date.toDateString()}, Time: ${time}, Repeat: ${repeat}`);
    };

    return (
        <div className="flex flex-col items-center p-6 bg-gray-900 text-white rounded-lg max-w-md mx-auto shadow-lg">
            {/* Calendar */}
            <div className="w-full text-center mb-6">
                <div className="text-xl font-semibold mb-2">{date.toLocaleString("default", { month: "long", year: "numeric" })}</div>
                <div className="grid grid-cols-7 gap-1 text-gray-400">
                    {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
                        <div key={day} className="text-sm font-medium">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1 mt-2">
                    {Array.from({ length: 31 }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setDate(new Date(date.getFullYear(), date.getMonth(), i + 1))}
                            className={`py-1 rounded ${
                                date.getDate() === i + 1 ? "bg-blue-500 text-white" : "hover:bg-gray-800"
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>

            {/* Time and Repeat Options */}
            <div className="w-full bg-gray-800 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-3">
          <span className="flex items-center gap-2">
            <span className="material-icons">access_time</span>
            Time
          </span>
                    <select
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="bg-gray-900 text-white border-none rounded px-2 py-1 focus:outline-none"
                    >
                        <option value="">None</option>
                        {Array.from({ length: 24 }, (_, h) =>
                            ["00", "15", "30", "45"].map((m) => (
                                <option key={`${h}:${m}`} value={`${h}:${m}`}>
                                    {`${h.toString().padStart(2, "0")}:${m}`}
                                </option>
                            ))
                        )}
                    </select>
                </div>
                <div className="flex justify-between items-center">
          <span className="flex items-center gap-2">
            <span className="material-icons">autorenew</span>
            Add repeats
          </span>
                    <select
                        value={repeat}
                        onChange={(e) => setRepeat(e.target.value)}
                        className="bg-gray-900 text-white border-none rounded px-2 py-1 focus:outline-none"
                    >
                        <option value="None">None</option>
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                    </select>
                </div>
            </div>

            {/* Save Button */}
            <button
                onClick={saveCalendar}
                className="w-full py-3 bg-blue-500 rounded-lg text-lg font-semibold hover:bg-blue-700"
            >
                Save
            </button>
        </div>
    );
};

export default DatePicker;
