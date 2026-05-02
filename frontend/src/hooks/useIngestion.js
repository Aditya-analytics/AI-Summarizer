import { useState } from 'react';
import api from '../services/api';
import { readStream } from '../utils/streamReader';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';

export const useIngestion = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [uploadError, setUploadError] = useState('');
  const navigate = useNavigate();
  const { fetchDocuments } = useWorkspace();

  const handleStream = async (readerPromise) => {
    setIsUploading(true);
    setStreamingText('');
    setUploadError('');
    
    try {
      const reader = await readerPromise;
      await readStream(
        reader,
        (chunk) => {
          // Progress updates from backend
          if (chunk.includes('[DONE]')) {
             // Handle completion signal
          } else {
             setStreamingText(prev => prev + chunk);
          }
        },
        async () => {
          await fetchDocuments();
          setIsUploading(false);
          
          // Get the latest documents to find the new one
          const docs = await api.getDocuments();
          if (docs && docs.length > 0) {
            const newDoc = docs[0];
            // Navigate to workspace - we DON'T summarize yet.
            // Just open the workspace for the document.
            navigate(`/workspace/${newDoc.id}`, { 
              state: { doc: newDoc, activeTab: 'chat' } // Default to chat or overview
            });
          }
        }
      );
    } catch (err) {
      setUploadError(err.message || 'Processing failed. Please check your connection or AI server (Ollama).');
      setIsUploading(false);
    }
  };

  const ingest = async ({ type, value, file, length, language }) => {
    let promise;
    switch (type) {
      case 'pdf':
        promise = api.uploadPdf(file, length, language);
        break;
      case 'url':
        promise = api.summarizeUrl(value, length, language);
        break;
      case 'youtube':
        promise = api.summarizeYoutube(value, length, language);
        break;
      case 'text':
        promise = api.summarizeText(value, length, language);
        break;
      default:
        return;
    }
    await handleStream(promise);
  };

  const resetIngestion = () => {
    setIsUploading(false);
    setStreamingText('');
    setUploadError('');
  };

  return {
    isUploading,
    streamingText,
    uploadError,
    ingest,
    resetIngestion
  };
};
