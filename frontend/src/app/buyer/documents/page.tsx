'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Lock, 
  Upload, 
  Trash2, 
  Download, 
  Shield, 
  Search, 
  RefreshCcw, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function DocumentVaultPage() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

  const fetchDocuments = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem('grawizah_token');
      const res = await fetch(`${API_URL}/api/documents?buyer_id=${user.id}`, {
        headers: { ...(token && { 'Authorization': `Bearer ${token}` }) }
      });
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.data || []);
      }
    } catch (err) {
      console.error('Fetch docs error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const allowed = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xls', 'xlsx'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !allowed.includes(ext)) {
      setError('Invalid file type. Allowed: PDF, JPG, PNG, DOCX, XLSX.');
      setTimeout(() => setError(''), 5000);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit.');
      setTimeout(() => setError(''), 5000);
      return;
    }

    setUploading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('buyer_id', user.id);
    formData.append('entity_type', 'buyer');

    try {
      const token = localStorage.getItem('grawizah_token');
      const res = await fetch(`${API_URL}/api/documents/upload`, {
        method: 'POST',
        headers: { ...(token && { 'Authorization': `Bearer ${token}` }) },
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      await fetchDocuments();
    } catch (err: any) {
      setError(err.message || 'Upload error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDownload = async (docId: string, filename: string) => {
    try {
      const token = localStorage.getItem('grawizah_token');
      const res = await fetch(`${API_URL}/api/documents/${docId}/download`, {
        headers: { ...(token && { 'Authorization': `Bearer ${token}` }) }
      });
      if (!res.ok) throw new Error('Download failed');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to securely download document.');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm('Permanently delete this document?')) return;
    try {
      const token = localStorage.getItem('grawizah_token');
      const res = await fetch(`${API_URL}/api/documents/${docId}`, {
        method: 'DELETE',
        headers: { ...(token && { 'Authorization': `Bearer ${token}` }) }
      });
      if (!res.ok) throw new Error('Delete failed');
      setDocuments(prev => prev.filter(d => d.id !== docId));
    } catch (err) {
      setError('Failed to delete document.');
      setTimeout(() => setError(''), 5000);
    }
  };

  const filteredDocs = documents.filter(doc => {
    const name = doc.filename || doc.original_name || 'Document';
    return !searchQuery || name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalSize = documents.reduce((sum, d) => sum + (d.file_size / (1024 * 1024)), 0).toFixed(2);

  if (loading) {
     return (
       <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
         <RefreshCcw className="w-8 h-8 animate-spin text-primary opacity-20" />
         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Decrypting Vault...</p>
       </div>
     );
  }

  return (
    <div className="p-6 md:p-10 w-full min-h-full font-sans relative">
      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-black text-amber-500 uppercase tracking-[0.3em]">SECURE VAULT</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
            Document Vault
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            AES-256 encrypted document storage fully compliant with PDPA security standards.
          </p>
        </div>
        <div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-2 shadow-md shadow-primary/10"
          >
            {uploading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? 'Encrypting...' : 'Upload Document'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-xs font-black uppercase tracking-widest border border-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* Security Info Badge */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 border border-green-200 dark:border-green-800/30 rounded-3xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm font-black text-green-800 dark:text-green-400">End-to-End Encrypted</p>
            <p className="text-xs text-green-600 dark:text-green-500 font-medium mt-0.5">All files are processed with server-side AES-256 keys.</p>
          </div>
        </div>
        <div className="flex gap-8">
          <div>
            <p className="text-2xl font-black text-green-700 dark:text-green-400">{documents.length}</p>
            <p className="text-[10px] font-black text-green-600/60 dark:text-green-500/60 uppercase tracking-widest mt-0.5">Files</p>
          </div>
          <div>
            <p className="text-2xl font-black text-green-700 dark:text-green-400">{totalSize} MB</p>
            <p className="text-[10px] font-black text-green-600/60 dark:text-green-500/60 uppercase tracking-widest mt-0.5">Vault Size</p>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-8 bg-white dark:bg-dark-surface-container rounded-2xl border border-gray-100 dark:border-dark-surface-variant/20 p-2 flex items-center shadow-sm">
        <Search className="w-5 h-5 text-gray-400 ml-3" />
        <input 
          type="text" 
          placeholder="Search encrypted documents..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          className="w-full bg-transparent border-none outline-none px-3 text-sm text-gray-900 dark:text-white" 
        />
      </div>

      {/* Documents Grid */}
      {filteredDocs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDocs.map((doc: any) => (
            <div key={doc.id} className="bg-white dark:bg-dark-surface-container p-6 rounded-3xl border border-gray-100 dark:border-dark-surface-variant/20 shadow-sm flex flex-col justify-between group hover:border-primary/30 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-50 dark:bg-dark-surface-container-high rounded-2xl flex items-center justify-center flex-shrink-0 border border-gray-100 dark:border-dark-surface-variant/10">
                  <FileText className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-black text-sm text-gray-900 dark:text-white truncate" title={doc.filename || doc.original_name || 'Document'}>
                    {doc.filename || doc.original_name || 'Document'}
                  </h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                    {(doc.file_size / (1024 * 1024)).toFixed(2)} MB &bull; {new Date(doc.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-50 dark:border-dark-surface-variant/10 flex justify-end gap-3">
                <button 
                  onClick={() => handleDownload(doc.id, doc.filename || doc.original_name || 'document.pdf')}
                  className="p-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-dark-surface-container-high dark:hover:bg-dark-surface-container-highest rounded-xl text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-dark-surface-variant/10 transition-colors"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(doc.id)}
                  className="p-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/30 rounded-xl text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/20 transition-colors"
                  title="Delete File"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-dark-surface-container rounded-3xl border border-gray-100 dark:border-dark-surface-variant/20 shadow-sm">
          <Lock className="w-12 h-12 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
          <p className="text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">No Documents Found</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Upload verified trade documents to proceed securely.</p>
        </div>
      )}
    </div>
  );
}
