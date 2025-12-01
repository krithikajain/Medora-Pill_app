import React, { useState, useEffect } from 'react';

const ScheduleView = ({ medications: initialMedications, onConfirm }) => {
    const [medications, setMedications] = useState(initialMedications);

    useEffect(() => {
        setMedications(initialMedications);
    }, [initialMedications]);

    const handleMedicationChange = (index, field, value) => {
        const updatedMeds = [...medications];
        updatedMeds[index] = { ...updatedMeds[index], [field]: value };
        setMedications(updatedMeds);
    };

    const handleTimeChange = (medIndex, timeIndex, value) => {
        const updatedMeds = [...medications];
        const updatedSchedule = [...updatedMeds[medIndex].schedule];
        updatedSchedule[timeIndex] = value;
        updatedMeds[medIndex] = { ...updatedMeds[medIndex], schedule: updatedSchedule };
        setMedications(updatedMeds);
    };

    const addTime = (medIndex) => {
        const updatedMeds = [...medications];
        updatedMeds[medIndex].schedule.push("08:00"); // Default time
        setMedications(updatedMeds);
    };

    const removeTime = (medIndex, timeIndex) => {
        const updatedMeds = [...medications];
        updatedMeds[medIndex].schedule.splice(timeIndex, 1);
        setMedications(updatedMeds);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Review & Edit Schedule</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {medications.map((med, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
                        <div className="mb-4">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Medication Name</label>
                            <input
                                type="text"
                                value={med.name}
                                onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Dosage</label>
                            <input
                                type="text"
                                value={med.dosage}
                                onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Frequency</label>
                            <input
                                type="text"
                                value={med.frequency}
                                onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Schedule:</h4>
                            <ul className="space-y-2">
                                {med.schedule.map((time, i) => (
                                    <li key={i} className="flex items-center space-x-2">
                                        <input
                                            type="time"
                                            value={time}
                                            onChange={(e) => handleTimeChange(index, i, e.target.value)}
                                            className="p-1 border rounded text-sm"
                                        />
                                        <button
                                            onClick={() => removeTime(index, i)}
                                            className="text-red-500 hover:text-red-700"
                                            title="Remove time"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => addTime(index)}
                                className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-semibold flex items-center"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Add Time
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-12 text-center">
                <button
                    onClick={() => onConfirm(medications)}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition flex items-center mx-auto"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Confirm Schedule
                </button>
            </div>
        </div>
    );
};

export default ScheduleView;
