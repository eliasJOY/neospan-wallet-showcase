import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { analyzeReceipt } from '../gemini/sendData'; // Import the function to analyze receipts
import PassDetailsModal from '../components/PassDetailsModal'; // Import your modal component

// A simple spinner component
const Spinner = () => (
  <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
);

const GeminiPassLoader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [passData, setPassData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const processMedia = async () => {
      // Get the file from the navigation state
      const mediaFile = location.state?.mediaFile;

      if (!mediaFile) {
        setError("No media file found. Please go back and capture again.");
        setIsLoading(false);
        return;
      }

      try {
        // IMPORTANT: Get your API key from a secure source
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        const result = await analyzeReceipt(mediaFile, apiKey);
        setPassData(result);
        setIsModalOpen(true); // Open the modal with the results
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    processMedia();
  }, [location.state, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-4">
        <Spinner />
        <p className="text-lg">Analyzing your pass...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-4 p-4 text-center">
        <p className="text-red-500 text-lg">An Error Occurred</p>
        <p className="text-muted-foreground">{error}</p>
        <button
          onClick={() => navigate(-1)} // Go back to the previous page
          className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {isModalOpen && passData && (
        <PassDetailsModal
          initialData={passData}
          onClose={() => {
            setIsModalOpen(false);
            navigate('/home'); // Navigate home after closing
          }}
          onSave={(editedData) => {
            console.log("Saving edited pass data:", editedData);
            // Add your logic to save the pass to your backend/state
            setIsModalOpen(false);
            navigate('/home'); // Navigate home after saving
          }}
        />
      )}
    </div>
  );
};

export default GeminiPassLoader;