import React, { useState } from 'react';
import client from '../api/client';

const CalendarSync = ({ medications }) => {
    const [syncing, setSyncing] = useState(false);
    const [synced, setSynced] = useState(false);
    const [error, setError] = useState(null);

    const handleSync = async () => {
        setSyncing(true);
        setError(null);
        try {
            // Assuming the backend endpoint is /api/add-to-calendar or similar
            // The previous ScheduleView used /api/add-to-calendar
            await client.post('/api/add-to-calendar', medications);
            setSynced(true);
        } catch (err) {
            console.error(err);
            setError('Failed to sync with Google Calendar. Please try again.');
        } finally {
            setSyncing(false);
        }
    };

    if (synced) {
        return (
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
                <div className="text-green-500 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Sync Complete!</h2>
                <p className="text-gray-600 mb-6">Your medication schedule has been added to your Google Calendar.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                >
                    Start Over
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Sync to Calendar</h2>
            <p className="text-gray-600 mb-8">
                You have confirmed your schedule. Ready to add it to your Google Calendar?
            </p>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

            <button
                onClick={handleSync}
                disabled={syncing}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-green-700 transition flex items-center justify-center disabled:bg-gray-400"
            >
                {syncing ? (
                    <span>Syncing...</span>
                ) : (
                    <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Sync to Google Calendar
                    </>
                )}
            </button>
        </div>
    );
};

export default CalendarSync;
