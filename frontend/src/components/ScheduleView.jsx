import React from 'react';

import client from '../api/client';

const ScheduleView = ({ medications }) => {
    const handleAddToCalendar = async () => {
        try {
            await client.post('/api/add-to-calendar', medications);
            alert('Successfully added to calendar!');
        } catch (err) {
            console.error(err);
            alert('Failed to add to calendar.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Your Medication Schedule</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {medications.map((med, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{med.name}</h3>
                        <div className="text-sm text-gray-600 mb-4">
                            <p><span className="font-semibold">Dosage:</span> {med.dosage}</p>
                            <p><span className="font-semibold">Frequency:</span> {med.frequency}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Schedule:</h4>
                            <ul className="space-y-1">
                                {med.schedule.map((time, i) => (
                                    <li key={i} className="flex items-center text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm w-max">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {time}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-12 text-center">
                <button
                    onClick={handleAddToCalendar}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-green-700 transition flex items-center mx-auto"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Add to Google Calendar
                </button>
            </div>
        </div>
    );
};

export default ScheduleView;
