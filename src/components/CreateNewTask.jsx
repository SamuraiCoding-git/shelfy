import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DatePicker from "./DatePicker";
import { useTodos } from "../context/TodoContext.jsx";
import ReminderPicker from "./ReminderPicker.jsx";
import AssignTags from "./AssignTags.jsx";
import TagCard from "./TagCard.jsx";
import {useTags} from "../context/TagsContext.jsx";

export default function CreateNewTask({ onClose }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTagPicker, setShowTagPicker] = useState(false);
    const [showReminderPicker, setShowReminderPicker] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentHeight, setCurrentHeight] = useState(35);
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedRepeat, setSelectedRepeat] = useState("None");
    const [selectedReminder, setSelectedReminder] = useState("None");
    const [selectedReminderTime, setSelectedReminderTime] = useState();
    const { selectedTags, deleteSelectedTags, resetSelectedTags } = useTags([]);

    const { createTask } = useTodos(); // Access the createTask function from context

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent f orm submission
        console.log("Hi")
        // Call createTask with title, description, and selected date
        if (taskTitle && taskDescription) {
            createTask(taskTitle, taskDescription, currentDate, selectedTime, selectedTags, selectedRepeat);
            resetSelectedTags()
            onClose(); // Close the modal after task is created
        }
    };

    const handleResetTime = () => {
        setSelectedTime();
        setSelectedRepeat("None");
        setCurrentDate(new Date());
    }

    const toggleExpanded = (flag = false) => {
        const newHeight = isExpanded ? 35 : 50;
        setCurrentHeight(newHeight);
        setIsExpanded(prevState => !prevState);
        if (flag) {
            setShowDatePicker(false);
            setShowReminderPicker(false)
            setShowTagPicker(false)
        }
    };

    const toggleDatePicker = () => {
        const newShowDatePicker = !showDatePicker;
        setShowDatePicker(newShowDatePicker);

        if (newShowDatePicker) {
            setCurrentHeight(100);
        } else {
            setCurrentHeight(isExpanded ? 35 : 50);
        }
    };

    const toggleReminderPicker = () => {
        const newShowReminderPicker = !showReminderPicker;
        setShowReminderPicker(newShowReminderPicker);
        if (newShowReminderPicker) {
            setCurrentHeight(70);
        } else {
            setCurrentHeight(isExpanded ? 35 : 50);
        }
    };

    const toggleTagPicker = () => {
        const newShowTagPicker = !showTagPicker;
        setShowTagPicker(newShowTagPicker);
        if (newShowTagPicker) {
            setCurrentHeight(35);
        } else {
            setCurrentHeight(isExpanded ? 35 : 50);
        }
    };

    // Ensure currentDate is a Date object before calling .toDateString
    const isToday = currentDate instanceof Date && currentDate.toDateString() === new Date().toDateString();

    // Format the date as dd-mm-yyyy
    const formatDate = (date) => {
        if (!(date instanceof Date)) return "Today";  // Ensure it's a valid date object

        // Use Intl.DateTimeFormat to get the abbreviated month and day
        const options = { month: 'short', day: 'numeric' };  // MMM D format
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

        return `${formattedDate}, ${selectedTime}`;
    };

    const formatReminder = () => {
        return `${selectedReminder}, ${selectedReminderTime}`
    }


    return (
        <>
            <motion.form
                initial={{y: "100%", opacity: 0}}
                animate={{
                    y: 0,
                    opacity: 1,
                    backgroundColor: "#101114",
                    height: `${currentHeight}%`
                }}
                exit={{
                    y: "100%",
                    opacity: 0,
                }}
                transition={{
                    duration: 0.4,
                    ease: [0.4, 0.0, 0.2, 1],
                }}
                style={{
                    willChange: "transform, opacity",
                }}
                className="fixed bottom-0 left-0 w-full z-50 p-6 pb-8 bg-[#101114] rounded-t-3xl flex flex-col"
                onSubmit={handleSubmit} // Добавлен обработчик submit
            >
                {/* Top panel */}
                <div
                    className="absolute left-1/2 transform -translate-x-1/2 top-2 w-9 h-1 rounded bg-[#1e1f24] cursor-pointer"
                    onClick={toggleExpanded}
                />
                <div className="flex justify-between items-center">
                    <button onClick={onClose}>
                        <img src="/assets/icons/task/chevron-left.svg" alt="back"/>
                    </button>
                    <p className="text-white text-lg font-semibold leading-6">
                        Create new task
                    </p>
                    <button type="submit" className="text-primary text-[#1D77FF] text-base font-semibold leading-5">
                        Save
                    </button>

                </div>

                {/* Input fields */}
                <div className="flex flex-col gap-3 mt-6">
                    <input
                        type="text"
                        placeholder="Task Title"
                        className="outline-none caret-primary bg-transparent text-white text-lg font-semibold leading-6"
                        value={taskTitle} // Bind to taskTitle state
                        onChange={(e) => setTaskTitle(e.target.value)} // Update state on change
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        className="outline-none caret-primary bg-transparent text-gray-400 text-sm font-medium leading-4"
                        value={taskDescription} // Bind to taskDescription state
                        onChange={(e) => setTaskDescription(e.target.value)} // Update state on change
                    />
                </div>


                {/* Buttons */}
                <div
                    className={`${isExpanded ? "flex flex-col gap-4 mt-4" : "flex flex-row gap-2 mt-6"} whitespace-nowrap`}>
                    {/* Контейнер для Today и Repeat */}
                    <div className={`flex ${isExpanded ? "flex-row" : "flex-row"} gap-2 whitespace-nowrap`}>
                        <button
                            type="button"
                            className={`flex items-center gap-3 ${isExpanded ? "justify-start px-4 py-3" : "justify-center px-3 py-3"} bg-[#1e1f24] rounded-lg`}
                            onClick={toggleDatePicker}
                        >
                            <img
                                src={`${isExpanded ? "/assets/icons/calendar.svg" : "/assets/icons/task/calendar.svg"}`}
                                alt="calendar"
                                className={`${isExpanded ? "w-5 h-5" : "w-6 h-6"}`}
                            />
                            <span className="text-sm font-semibold text-[#1D77FF]">
                                {isToday ? `Today ${selectedTime ? `, ${selectedTime}` : ""}` : formatDate(currentDate)}
                            </span>
                        </button>

                        {selectedRepeat !== "None" && isExpanded && (
                            <>
                                <button
                                    type="button"
                                    className={`flex items-center text-center gap-3 ${isExpanded ? "justify-start px-4 py-3" : "justify-center px-3 py-3"} bg-[#1e1f24] rounded-lg`}
                                    onClick={toggleDatePicker}
                                >
                                    <img
                                        src="/assets/icons/arrow-repeat-blue.svg"
                                        alt="repeat"
                                        className={`${isExpanded ? "w-5 h-5" : "w-6 h-6"}`}
                                    />
                                    <span className="text-sm font-semibold text-[#1D77FF]">
                                        {selectedRepeat}
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    className={`flex items-center justify-center gap-3 w-12 h-12 rounded-lg`}
                                    onClick={handleResetTime}
                                >
                                    <img
                                        className="w-6 h-6"  // Ensure the image fits inside the square button
                                        src="/assets/icons/dismiss-blue.svg"
                                        alt="dismiss-blue"
                                    />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Остальные кнопки */}
                    <div className="flex flex-row gap-3 whitespace-nowrap">
                        <button
                            className={`flex items-center ${isExpanded ? "justify-start px-4 py-3" : "justify-center px-3 py-3"} bg-[#1e1f24] rounded-lg`}
                            onClick={toggleReminderPicker}
                        >
                            <img
                                src={selectedReminder === 'None' || isExpanded ? "/assets/icons/task/notification.svg" : "/assets/icons/notification-blue.svg"}
                                alt="notification"/>
                            {selectedReminder !== "None" && (
                                <span
                                    className={`ml-3 ${isExpanded ? "text-white" : "text-[#1D77FF]"} text-sm font-semibold`}>
                                {formatReminder()}
                                </span>
                            )}
                            {selectedReminder === "None" && (
                                <span className="ml-3 text-white text-sm font-semibold">
                                Add reminder
                                </span>
                            )}
                        </button>
                        {isExpanded && selectedReminder !== "None" && (
                            <button>
                                <img
                                    className="z-20 w-6 h-6"  // Ensure the image fits inside the square button
                                    src="/assets/icons/dismiss.svg"
                                    alt="dismiss"
                                />
                            </button>
                        )}
                    </div>

                    <div
                        className={`flex items-center ${isExpanded ? `${selectedTags.length > 0 ? "w-14 h-14 gap-7" : "w-36"} justify-start px-4 py-3` : "justify-center w-12 h-12"} bg-[#1e1f24] rounded-lg`}
                    >
                        <img
                            src={selectedTags.length > 0 && !isExpanded ? "/assets/icons/tag-blue.svg" : "/assets/icons/task/tag.svg"}
                            alt="tags"
                            onClick={selectedTags.length < 3 && toggleTagPicker}
                        />
                        {!isExpanded && selectedTags.length > 0 && selectedTags.length < 3 && (
                            <span
                                className={`ml-1 ${isExpanded ? "text-white" : "text-[#1D77FF]"} text-sm font-semibold`}>
                                {selectedTags.length}
                            </span>
                        )}
                        {isExpanded && (
                            selectedTags.length === 0 ? (
                                <span onClick={selectedTags.length < 3 && toggleTagPicker} className="ml-3 text-white text-sm font-semibold">
                                    Assign Tags
                                </span>
                            ) : (
                                <div
                                    className="flex flex-row gap-3 max-h-64 scrollbar-thin scrollbar-thumb-[#1D77FF] scrollbar-track-transparent">
                                    {selectedTags.map((tag) => (
                                        tag ? (
                                            <div key={tag.id} className="flex-shrink-0">
                                                <TagCard tag={tag} deleteSelectedTags={deleteSelectedTags}/>
                                            </div>
                                        ) : null
                                    ))}
                                </div>
                            )
                        )}
                    </div>

                    {!isExpanded && (
                        <button
                            className="flex items-center justify-center w-12 h-12 bg-[#1e1f24] rounded-lg"
                            onClick={toggleExpanded}
                        >
                            <img src="/assets/icons/task/more.svg" alt="more"/>
                        </button>
                    )}

                    {/*{isExpanded && (*/}
                    {/*    <button*/}
                    {/*        className="flex items-center w-full justify-start px-4 py-3 bg-[#1e1f24] rounded-lg"*/}
                    {/*        onClick={() => console.log("Make it a habit")}*/}
                    {/*    >*/}
                    {/*        <img src="/assets/icons/habit.svg" alt="habit"/>*/}
                    {/*        <span className="ml-3 text-white text-sm font-semibold">*/}
                    {/*            Make it a habit*/}
                    {/*        </span>*/}
                    {/*    </button>*/}
                    {/*)}*/}
                </div>


                {/* DatePicker Transition */}
                {showDatePicker && (
                    <div
                        className="fixed top-0 left-0 w-full h-full bg-[#101114] p-6 rounded-t-3xl flex flex-col items-start justify-start z-60"
                    >
                        <DatePicker
                            currentDate={currentDate}
                            onClose={toggleExpanded}
                            onChange={(selectedDate) => {
                                console.log("Selected date:", selectedDate);
                                setCurrentDate(selectedDate);
                            }}
                            onSave={(selectedDate, time, repeat) => {
                                console.log("Selected date:", selectedDate);
                                setCurrentDate(selectedDate);
                                setSelectedTime(time);
                                setSelectedRepeat(repeat);
                                setShowDatePicker(false);
                                setIsExpanded(true);
                                setCurrentHeight(50);
                            }}
                        />
                    </div>
                )}

                {showReminderPicker && (
                    <div
                        className="fixed top-0 left-0 w-full h-full bg-[#101114] p-6 rounded-t-3xl flex flex-col items-start justify-start z-60"
                    >
                        <ReminderPicker
                            onClose={() => {
                                setIsExpanded(true);
                                setCurrentHeight(50);
                                setShowReminderPicker(false);
                            }}
                            onSave={(time, reminder) => {
                                setIsExpanded(true);
                                setCurrentHeight(50);
                                setShowReminderPicker(false);
                                setSelectedReminderTime(time);
                                setSelectedReminder(reminder);
                            }}
                        />
                    </div>
                )}

                {showTagPicker && (
                    <div
                        className="fixed top-0 left-0 w-full h-full bg-[#101114] p-6 rounded-t-3xl flex flex-col items-start justify-start z-60"
                    >
                        <AssignTags
                            toggleTag={toggleExpanded}
                            setCurrentHeight={setCurrentHeight}
                            onSave={() => {
                                setShowDatePicker(false);
                                setIsExpanded(true);
                                setCurrentHeight(50);
                                setShowTagPicker(false)
                            }}
                        />
                    </div>
                )}
            </motion.form>
        </>
    );
}
