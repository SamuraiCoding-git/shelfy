import React from 'react';

const ProgressCard = ({ progress }) => {
    // Ensure progress is within the 0-100 range
    const validProgress = Math.min(Math.max(progress, 0), 100);

    return (
        <div className="bg-[#1E79FF] text-white rounded-3xl p-4 shadow-lg">
            <h2 className="text-lg font-semibold">Get one step closer to your goal today!</h2>
            <div className="mt-4">
                <div className="flex justify-between items-center">
                    <p className="text-sm">Progress today</p>
                    <p className="font-bold text-lg">{validProgress}%</p>
                </div>
                <div className="relative w-full h-2 bg-black rounded-full mt-2">
                    <div
                        className="absolute top-0 left-0 h-full bg-white rounded-full"
                        style={{ width: `${validProgress}%` }}
                    ></div>
                    {/* Circle indicator */}
                    <div
                        className="absolute top-1/2 transform -translate-y-1/2 bg-white rounded-full"
                        style={{
                            width: '16px',
                            height: '16px',
                            left: `calc(${validProgress}% - 8px)`, // Adjusting for circle's radius
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default ProgressCard;
