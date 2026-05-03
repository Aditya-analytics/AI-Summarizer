import CONFIG from '../config';

const BASE = CONFIG.API_BASE_URL;
const getToken = () => localStorage.getItem('nova_token');

// ── Standard JSON fetch (auth, quiz, delete) ──────────────────────────────────
const apiFetch = async (method, path, body = null) => {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
    body: body ? JSON.stringify(body) : null,
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Request failed: ${res.status}`);
  }
  return res.json();
};

// ── Streaming fetch (summarize, ask, notes) ───────────────────────────────────
// Returns a ReadableStream reader — use with readStream() utility
const apiStream = async (method, path, body = null, isFormData = false) => {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
    },
    body: isFormData ? body : (body ? JSON.stringify(body) : null),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Stream failed: ${res.status}`);
  }
  return res.body.getReader();
};

const api = {

  // ── Auth ───────────────────────────────────────────────────────────────────
  signup: (email, password) =>
    apiFetch('POST', '/authentication/signup', { email, password }),

  login: async (email, password) => {
    const form = new URLSearchParams({ username: email, password });
    const res = await fetch(`${BASE}/authentication/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json(); // { access_token, token_type }
  },

  // ── Documents ──────────────────────────────────────────────────────────────
  // Returns: [{id, name, type, created_at}]
  getDocuments: () =>
    apiFetch('GET', '/summarization/documents'),

  deleteDocument: (id) =>
    apiFetch('DELETE', `/summarization/documents/${id}`),

  // ── Summarization (Streaming) ──────────────────────────────────────────────
  uploadPdf: (file, length = 'standard', language = 'English') => {
    const form = new FormData();
    form.append('file', file);
    form.append('length', length);
    form.append('language', language);
    return apiStream('POST', '/summarization/pdf', form, true);
  },

  summarizeUrl: (url, length = 'standard', language = 'English') =>
    apiStream('POST', '/summarization/url', { url, length, language }),

  summarizeYoutube: (url, length = 'standard', language = 'English') =>
    apiStream('POST', '/summarization/youtube_url', { url, length, language }),

  summarizeText: (text, length = 'standard', language = 'English') =>
    apiStream('POST', '/summarization/text', { text, length, language }),

  // ── Q&A (Streaming) ────────────────────────────────────────────────────────
  // Note: backend expects document_id (not docId)
  askQuestion: (document_id, question) =>
    apiStream('POST', '/qa/ask', { document_id, question }),

  // ── Quiz (JSON — NOT streaming) ────────────────────────────────────────────
  // Note: document_id is a QUERY PARAM, difficulty goes in the body
  getQuiz: (document_id, difficulty = 'medium') =>
    apiStream('POST', `/qa/quiz?document_id=${document_id}`, { difficulty }),

  // ── Notes (Streaming) ──────────────────────────────────────────────────────
  // Note: document_id is a QUERY PARAM, config goes in the body
  getNotes: (document_id, length = 'standard', language = 'English') =>
    apiStream('POST', `/qa/notes?document_id=${document_id}`, { length, language }),

  // ── Summary & Artifacts ───────────────────────────────────────────────────
  getArtifacts: (document_id) =>
    apiFetch('GET', `/qa/document/${document_id}/artifacts`),

  getRawText: (document_id) =>
    apiFetch('GET', `/qa/document/${document_id}/raw`),

  getSummary: (document_id, length = 'standard', language = 'English') =>
    apiStream('POST', `/qa/summary?document_id=${document_id}`, { length, language }),

  clearChat: (document_id) =>
    apiFetch('DELETE', `/qa/document/${document_id}/chat`),
};

export default api;
