import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
    const [documents, setDocuments] = useState([]);   // Real docs from backend
    const [activeDoc, setActiveDoc] = useState(null); // The selected document
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
        fetchDocuments();
    }, [fetchDocuments]);

    const deleteDocument = async (id) => {
        await api.deleteDocument(id);
        setDocuments(prev => prev.filter(d => d.id !== id));
        if (activeDoc?.id === id) setActiveDoc(null);
    };

    const addDocument = (doc) => {
        setDocuments(prev => [doc, ...prev]);
    };

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

            // Legacy aliases so Dashboard/WorkspacePage don't crash
            workspaces: documents,
            activeWorkspace: activeDoc,
            setActiveWorkspace: setActiveDoc,
            stats: { mastery: `${documents.length * 10}%`, insights: documents.length * 8 },
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
