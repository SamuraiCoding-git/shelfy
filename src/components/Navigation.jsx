import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import CreateNewTask from '../components/CreateNewTask';

const Navigation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [buttons, setButtons] = useState([]);
    const [showCreateTask, setShowCreateTask] = useState(false);

    const absoluteIconPath = '/assets/icons/navigation';

    useEffect(() => {
        const initialButtons = [
            {
                path: '/',
                icon: `${absoluteIconPath}/home.svg`,
                activeIcon: `${absoluteIconPath}/home-active.svg`,
                active: false,
            },
            {
                path: '/calendar',
                icon: `${absoluteIconPath}/calendar.svg`,
                activeIcon: `${absoluteIconPath}/calendar-active.svg`,
                active: false,
            },
            {
                path: 'add',
                icon: `${absoluteIconPath}/add.svg`,
                active: false,
                add: true,
            },
            {
                path: '/leaderboard',
                icon: `${absoluteIconPath}/leaderboard.svg`,
                activeIcon: `${absoluteIconPath}/leaderboard-active.svg`,
                active: false,
            },
            {
                path: '/features',
                icon: `${absoluteIconPath}/features.svg`,
                activeIcon: `${absoluteIconPath}/features-active.svg`,
                active: false,
            },
        ];

        const updatedButtons = initialButtons.map((button) => ({
            ...button,
            active: location.pathname === button.path,
        }));
        setButtons(updatedButtons);
    }, [location.pathname]);

    const navigateTo = (path) => {
        if (path === 'add') {
            setShowCreateTask(true);
        } else {
            navigate(path);
        }
    };

    const closeCreateTask = () => {
        setShowCreateTask(false);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow pb-16">
                <Outlet />
            </main>

            {/* Animated CreateNewTask */}
            <AnimatePresence>
                {showCreateTask && (
                    <motion.div
                        initial={{ y: '100%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: '100%', opacity: 0 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        className="fixed inset-x-0 bottom-0 bg-[#101114] shadow-lg z-20 p-6 rounded-t-2xl"
                    >
                        <CreateNewTask onClose={closeCreateTask} />
                    </motion.div>
                )}
            </AnimatePresence>

            <footer className="fixed bottom-0 left-0 w-full h-16 bg-gray-900 bg-opacity-90 backdrop-blur-md z-10">
                <div className="flex justify-between px-8 py-3">
                    {buttons.map((button, index) => (
                        <button
                            key={index}
                            className={`border-none outline-none p-0 ${
                                button.add
                                    ? 'bg-blue-600 rounded-full p-3 -translate-y-1/2'
                                    : ''
                            }`}
                            onClick={() => navigateTo(button.path)}
                            tabIndex="0"
                        >
                            <img
                                src={button.active ? button.activeIcon : button.icon}
                                alt="icon"
                                aria-label={button.path}
                                className="h-6 w-6"
                            />
                        </button>
                    ))}
                </div>
            </footer>
        </div>
    );
};

export default Navigation;
