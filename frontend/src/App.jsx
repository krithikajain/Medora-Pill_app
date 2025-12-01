import React, { useState } from 'react';
import OnboardingForm from './components/OnboardingForm';
import FileUpload from './components/FileUpload';
import ScheduleView from './components/ScheduleView';
import CalendarSync from './components/CalendarSync';
import client from './api/client';

function App() {
  const [step, setStep] = useState('onboarding');
  const [session, setSession] = useState(null);
  const [medications, setMedications] = useState([]);

  const handleOnboardingComplete = (sessionData) => {
    setSession(sessionData);
    setStep('upload');
  };

  const handleUploadSuccess = (data) => {
    // We expect data to contain medications directly now, as we removed the PAUSED logic
    setMedications(data.medications);
    setStep('review'); // New step name for clarity
  };

  const handleConfirmSchedule = (confirmedMedications) => {
    setMedications(confirmedMedications);
    setStep('sync');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-blue-600">medora.ai</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {step === 'onboarding' && (
          <OnboardingForm onComplete={handleOnboardingComplete} />
        )}

        {step === 'upload' && (
          <FileUpload session={session} onUploadSuccess={handleUploadSuccess} />
        )}

        {step === 'review' && (
          <ScheduleView medications={medications} onConfirm={handleConfirmSchedule} />
        )}

        {step === 'sync' && (
          <CalendarSync medications={medications} />
        )}
      </main>
    </div>
  );
}

export default App;
