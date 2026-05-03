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
  const { fetchDocuments, documents } = useWorkspace();

  const handleStream = async (readerPromise) => {
    setIsUploading(true);
    setStreamingText('');
    setUploadError('');
    console.log("LOG: Initiating analysis...");

    try {
      const reader = await readerPromise;
      console.log("LOG: Stream reader acquired.");
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
    try {
      // 1. FRONTEND DUPLICATE CHECK
      if (Array.isArray(documents) && (type === 'url' || type === 'youtube')) {
        const existing = documents.find(d => d.name === value || d.source === value);
        if (existing) {
          console.log("LOG: Document exists, navigating...");
          navigate(`/workspace/${existing.id}`);
          return;
        }
      }
      if (Array.isArray(documents) && type === 'pdf' && file) {
        const existing = documents.find(d => d.name === file.name);
        if (existing) {
          console.log("LOG: File exists, navigating...");
          navigate(`/workspace/${existing.id}`);
          return;
        }
      }

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
    } catch (err) {
      console.error("Ingest initial error:", err);
      console.error("Ingest initial error:", err);
      setIsUploading(false);
      setIsUploading(false);
    }
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
