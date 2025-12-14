import React from 'react';
import { FaCheck } from 'react-icons/fa';

const Success: React.FC = () => {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="max-w-md rounded-lg bg-white p-8 text-center shadow-md">
                <div className="mb-4 flex justify-center">
                    <FaCheck className="rounded-full border-2 border-zinc-800/30 p-2 text-7xl text-green-500" />
                </div>
                <h1 className="mb-2 font-hitmarker-condensed text-2xl font-bold text-gray-800">Success!</h1>
                <p className="text-gray-600">Thank you for your purchase!</p>
                <p className="mb-6 text-gray-600">Your order is being processed shortly</p>
                <button
                    onClick={() => window.history.back()}
                    className="rounded bg-green-500 px-6 py-2 font-semibold text-white transition duration-200 hover:bg-green-600"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default Success;
