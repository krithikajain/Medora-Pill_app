import React, { useState } from 'react';
import client from '../api/client';

const OnboardingForm = ({ onComplete }) => {
    const [formData, setFormData] = useState({
        name: '',
        wake_time: '08:00',
        breakfast_time: '09:00',
        lunch_time: '13:00',
        dinner_time: '19:00',
        sleep_time: '22:00',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await client.post('/api/onboarding', formData);
            onComplete(response.data);
        } catch (err) {
            setError('Failed to save details. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Let's get started</h2>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Wake Time</label>
                        <input
                            type="time"
                            name="wake_time"
                            value={formData.wake_time}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Sleep Time</label>
                        <input
                            type="time"
                            name="sleep_time"
                            value={formData.sleep_time}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Breakfast</label>
                        <input
                            type="time"
                            name="breakfast_time"
                            value={formData.breakfast_time}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Lunch</label>
                        <input
                            type="time"
                            name="lunch_time"
                            value={formData.lunch_time}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Dinner</label>
                        <input
                            type="time"
                            name="dinner_time"
                            value={formData.dinner_time}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                >
                    {loading ? 'Saving...' : 'Continue'}
                </button>
            </form>
        </div>
    );
};

export default OnboardingForm;
