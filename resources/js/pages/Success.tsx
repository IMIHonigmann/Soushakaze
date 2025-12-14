import React from 'react';

const Success: React.FC = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="max-w-md rounded-lg bg-white p-8 text-center shadow-md">
                <div className="mb-4">
                    <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h1 className="mb-2 text-2xl font-bold text-gray-800">Success!</h1>
                <p className="mb-6 text-gray-600">Your operation completed successfully.</p>
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
