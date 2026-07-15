import { useState, useEffect, useRef } from 'react';
import { documentsAPI } from '../services/api';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => { loadDocuments(); }, []);

  const loadDocuments = async () => {
    try { const res = await documentsAPI.getAll(); setDocuments(res.data); } catch (err) { console.error(err); }
  };

  const handleUpload = async (file) => {
    if (!file) return;
    setError('');
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'pdf' && ext !== 'txt') { setError('Only PDF and TXT files are supported'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('File size exceeds 5MB limit'); return; }
    setUploading(true);
    try {
      const res = await documentsAPI.upload(file);
      setDocuments((prev) => [res.data, ...prev]);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload document');
    } finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    try { await documentsAPI.delete(id); setDocuments((prev) => prev.filter((d) => d.id !== id)); } catch (err) { console.error(err); }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="app-layout">
      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">Documents</h1>
          <p className="page-subtitle">Upload documents to chat with their content using AI</p>
        </div>
        <div className="page-body">
          <div className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files[0]); }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileInputRef.current?.click()} id="upload-zone">
            <div className="upload-zone-icon">📁</div>
            <h3>Drop files here or click to upload</h3>
            <p>Supports PDF and TXT files up to 5MB</p>
            {uploading && <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><span className="spinner"></span><span style={{ color: 'var(--text-secondary)' }}>Uploading...</span></div>}
            <input ref={fileInputRef} type="file" accept=".pdf,.txt" style={{ display: 'none' }} onChange={(e) => handleUpload(e.target.files[0])} id="file-input" />
          </div>
          {error && <div className="auth-error" style={{ marginTop: '1rem' }}>{error}</div>}
          <div className="document-list">
            {documents.map((doc) => (
              <div key={doc.id} className="document-item fade-in">
                <div className="document-icon">{doc.fileType === 'pdf' ? '📕' : '📄'}</div>
                <div className="document-info">
                  <div className="document-name">{doc.filename}</div>
                  <div className="document-meta">
                    <span>{formatFileSize(doc.fileSize)}</span>
                    <span>{doc.fileType.toUpperCase()}</span>
                    <span>{formatDate(doc.uploadedAt)}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {doc.fileUrl && (
                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-secondary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }} id={`view-doc-${doc.id}`}>View</a>
                  )}
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(doc.id)} id={`delete-doc-${doc.id}`}>Delete</button>
                </div>
              </div>
            ))}
            {documents.length === 0 && <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No documents uploaded yet. Upload a file to get started!</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
