import React, { useState, useEffect } from 'react';

const CalendarSync = ({ medications }) => {
    const [syncing, setSyncing] = useState(false);
    const [synced, setSynced] = useState(false);
    const [error, setError] = useState(null);
    const [gapiInited, setGapiInited] = useState(false);
    const [gisInited, setGisInited] = useState(false);
    const [tokenClient, setTokenClient] = useState(null);

    const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const API_KEY = ""; // Not needed for this flow if using access token directly, or can be left empty
    const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
    const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

    useEffect(() => {
        const initializeGapiClient = async () => {
            await window.gapi.client.init({
                discoveryDocs: [DISCOVERY_DOC],
            });
            setGapiInited(true);
        };

        const gapiLoaded = () => {
            window.gapi.load('client', initializeGapiClient);
        };

        const gisLoaded = () => {
            const client = window.google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: SCOPES,
                callback: '', // defined later
            });
            setTokenClient(client);
            setGisInited(true);
        };

        // Check if scripts are loaded
        if (window.gapi) gapiLoaded();
        if (window.google) gisLoaded();

        // In case scripts load after component mount (unlikely with async defer but possible)
        // A robust solution would use script load listeners, but for now we assume they are present
        // or the user refreshes.
    }, [CLIENT_ID]);

    const handleAuthClick = () => {
        setError(null);
        if (!tokenClient) {
            setError("Google API not initialized. Please refresh the page.");
            return;
        }

        tokenClient.callback = async (resp) => {
            if (resp.error) {
                throw resp;
            }
            await createEvents();
        };

        if (window.gapi.client.getToken() === null) {
            // Prompt the user to select a Google Account and ask for consent to share their data
            // when establishing a new session.
            tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
            // Skip display of account chooser and consent dialog for an existing session.
            tokenClient.requestAccessToken({ prompt: '' });
        }
    };

    const createEvents = async () => {
        setSyncing(true);
        try {
            // Get today's date string for the event
            const today = new Date().toISOString().split('T')[0];

            for (const med of medications) {
                for (const time of med.schedule) {
                    // Construct DateTime
                    // time is "HH:MM", we need "YYYY-MM-DDTHH:MM:00"
                    const startDateTime = `${today}T${time}:00`;
                    // End time 15 mins later
                    const startDate = new Date(startDateTime);
                    const endDate = new Date(startDate.getTime() + 15 * 60000);
                    const endDateTime = endDate.toISOString().split('.')[0]; // remove ms

                    const event = {
                        'summary': `Take ${med.name} (${med.dosage})`,
                        'description': `Frequency: ${med.frequency}`,
                        'start': {
                            'dateTime': startDateTime,
                            'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone,
                        },
                        'end': {
                            'dateTime': endDateTime,
                            'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone,
                        },
                    };

                    // Add recurrence if present
                    if (med.recurrence) {
                        event.recurrence = [med.recurrence];
                    }

                    const request = window.gapi.client.calendar.events.insert({
                        'calendarId': 'primary',
                        'resource': event,
                    });

                    await request;
                }
            }
            setSynced(true);
        } catch (err) {
            console.error("Error creating events", err);
            setError("Failed to create calendar events. Please try again.");
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

            {!CLIENT_ID || CLIENT_ID.includes("YOUR_") ? (
                <div className="bg-yellow-100 text-yellow-800 p-4 rounded mb-6 text-left text-sm">
                    <strong>Configuration Required:</strong><br />
                    Please add your <code>VITE_GOOGLE_CLIENT_ID</code> to the <code>frontend/.env</code> file to enable Google Calendar sync.
                </div>
            ) : (
                <p className="text-gray-600 mb-8">
                    You have confirmed your schedule. Ready to add it to your Google Calendar?
                </p>
            )}

            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

            <button
                onClick={handleAuthClick}
                disabled={syncing || !gapiInited || !gisInited || !CLIENT_ID || CLIENT_ID.includes("YOUR_")}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-green-700 transition flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
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
