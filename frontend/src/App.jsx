import React, { useState } from 'react';
import Layout from './components/Layout';
import OnboardingForm from './components/OnboardingForm';
import FileUpload from './components/FileUpload';
import ScheduleView from './components/ScheduleView';

function App() {
  const [step, setStep] = useState('onboarding');
  const [session, setSession] = useState(null);
  const [medications, setMedications] = useState([]);

  const handleOnboardingComplete = (sessionData) => {
    setSession(sessionData);
    setStep('upload');
  };

  const handleUploadComplete = (meds) => {
    setMedications(meds);
    setStep('results');
  };

  return (
    <Layout>
      {step === 'onboarding' && (
        <OnboardingForm onComplete={handleOnboardingComplete} />
      )}
      {step === 'upload' && (
        <FileUpload session={session} onComplete={handleUploadComplete} />
      )}
      {step === 'results' && (
        <ScheduleView medications={medications} />
      )}
    </Layout>
  );
}

export default App;
