import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function CreateNewTask({ onClose }) {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTagsPicker, setShowTagsPicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [tags, setTags] = useState([]);

    const toggleDatePicker = () => setShowDatePicker((prev) => !prev);
    const toggleTagsPicker = () => setShowTagsPicker((prev) => !prev);

    return (
        <motion.form
            initial={{ y: '100%', opacity: 0, backgroundColor: 'rgba(0,0,0,0)' }}
            animate={{ y: 0, opacity: 1, backgroundColor: '#101114' }}
            exit={{ y: '100%', opacity: 0, backgroundColor: 'rgba(0,0,0,0)' }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 w-full z-100 p-6 pb-8 bg-[#101114] rounded-t-3xl flex flex-col transition-transform"
        >
            {/* Main Form */}
            {!showDatePicker && !showTagsPicker && (
                <>
                    <div
                        className="absolute left-1/2 transform -translate-x-1/2 top-2 w-9 h-1 rounded bg-[#1e1f24] cursor-pointer"
                        onClick={() => console.log('Handle drag')}
                    />
                    <div className="flex justify-between items-center">
                        <button onClick={onClose}>
                            <img src="/assets/icons/task/chevron-left.svg" alt="back" />
                        </button>
                        <p className="text-white text-lg font-semibold leading-6">
                            Create new task
                        </p>
                        <button className="text-primary text-base font-semibold leading-5">
                            Save
                        </button>
                    </div>

                    <div className="flex flex-col gap-3 mt-6">
                        <input
                            type="text"
                            placeholder="Task Title"
                            className="outline-none caret-primary bg-transparent text-white text-lg font-semibold leading-6"
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            className="outline-none caret-primary bg-transparent text-gray-400 text-sm font-medium leading-4"
                        />
                    </div>

                    <div className="flex gap-2 mt-6">
                        <button
                            className="flex items-center gap-1 px-3 py-2 bg-[#1e1f24] rounded-lg text-white text-sm font-semibold"
                            onClick={toggleDatePicker}
                        >
                            <img src="/assets/icons/task/calendar.svg" alt="calendar" />
                            {selectedDate ? selectedDate : 'Today'}
                        </button>
                        <button
                            className="flex items-center gap-1 px-3 py-2 bg-[#1e1f24] rounded-lg text-white text-sm font-semibold"
                            onClick={toggleTagsPicker}
                        >
                            <img src="/assets/icons/task/clock.svg" alt="tags" />
                            Tags
                        </button>
                    </div>
                </>
            )}

            {/* Date Picker */}
            {showDatePicker && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={toggleDatePicker}>
                            <img src="/assets/icons/task/chevron-left.svg" alt="back" />
                        </button>
                        <p className="text-white text-lg font-semibold leading-6">
                            Pick a Date
                        </p>
                    </div>
                    <div className="bg-[#1e1f24] p-4 rounded-lg">
                        {/* Replace with DatePicker component */}
                        <p className="text-white text-sm">Date Picker Component</p>
                    </div>
                </div>
            )}

            {/* Tags Picker */}
            {showTagsPicker && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={toggleTagsPicker}>
                            <img src="/assets/icons/task/chevron-left.svg" alt="back" />
                        </button>
                        <p className="text-white text-lg font-semibold leading-6">
                            Pick Tags
                        </p>
                    </div>
                    <div className="bg-[#1e1f24] p-4 rounded-lg">
                        {/* Replace with TagsPicker component */}
                        <p className="text-white text-sm">Tags Picker Component</p>
                    </div>
                </div>
            )}
        </motion.form>
    );
}
