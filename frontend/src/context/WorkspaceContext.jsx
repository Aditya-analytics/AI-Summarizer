import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import api from '../services/api';

const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
    const [documents, setDocuments] = useState([]);   // Real docs from backend
    const [activeDoc, setActiveDoc] = useState(null); // The selected document
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sessionCache, setSessionCache] = useState({}); // { docId: { summary, quiz, notes } }
    const [seekTo, setSeekTo] = useState(null); // Timestamp to seek to: { time: seconds }

    // Fetch the real document list from backend
    const fetchDocuments = useCallback(async () => {
        const token = localStorage.getItem('nova_token');
        if (!token) return; // Not logged in, skip
        setLoading(true);
        setError(null);
        try {
            const docs = await api.getDocuments();
            setDocuments(docs);
        } catch (err) {
            console.error('Failed to fetch documents:', err);
            setError('Could not load documents.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Only fetch if not already loading and we don't have documents yet
        if (documents.length === 0) {
            fetchDocuments();
        }
    }, [fetchDocuments, documents.length]);

    const deleteDocument = async (id) => {
        console.log("LOG: Attempting to delete document:", id);
        // Optimistic UI Update
        const previousDocs = [...documents];
        setDocuments(prev => prev.filter(d => d.id !== id));
        if (activeDoc?.id === id) setActiveDoc(null);

        try {
            console.log("LOG: Calling API to delete document:", id);
            await api.deleteDocument(id);
            console.log("LOG: Successfully deleted document:", id);
        } catch (err) {
            console.error('Failed to delete document:', err);
            // Rollback on failure
            setDocuments(previousDocs);
        }
    };

    const updateCache = (id, data) => {
        setSessionCache(prev => ({
            ...prev,
            [id]: { ...(prev[id] || {}), ...data }
        }));
    };

    const addDocument = (doc) => {
        setDocuments(prev => [doc, ...prev]);
    };

    const clearWorkspace = () => {
        setDocuments([]);
        setActiveDoc(null);
        setSessionCache({});
    };

    const login = async (token, email) => {
        localStorage.setItem('nova_token', token);
        localStorage.setItem('nova_user_email', email);
        await fetchDocuments();
    };

    const stats = useMemo(() => ({
        mastery: `${documents.length * 10}%`,
        insights: documents.length * 8
    }), [documents.length]);

    return (
        <WorkspaceContext.Provider value={{
            documents,
            activeDoc,
            setActiveDoc,
            loading,
            error,
            fetchDocuments,
            deleteDocument,
            addDocument,
            sessionCache,
            updateCache,
            clearWorkspace,
            login,
            seekTo,
            setSeekTo,

            // Legacy aliases so Dashboard/WorkspacePage don't crash
            workspaces: documents,
            activeWorkspace: activeDoc,
            setActiveWorkspace: setActiveDoc,
            stats,
        }}>
            {children}
        </WorkspaceContext.Provider>
    );
};

export const useWorkspace = () => {
    const context = useContext(WorkspaceContext);
    if (!context) throw new Error('useWorkspace must be used within a WorkspaceProvider');
    return context;
};
