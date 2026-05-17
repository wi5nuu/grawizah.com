'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  FileText,
  Upload,
  Download,
  Trash2,
  ShieldCheck,
  RefreshCcw,
  AlertCircle,
  FileBadge
} from 'lucide-react';

export default function DocumentVaultPage() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  
  // Dynamic API URL resolver that adapts to local network testing (e.g. when hosted on 0.0.0.0)
  const getApiUrl = () => {
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
        return `http://${hostname}:8081`;
      }
    }
    return 'http://localhost:8081';
  };

  const API_URL = getApiUrl();

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
  }, [user, API_URL]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Allowed extensions check on frontend
    const allowed = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xls', 'xlsx'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !allowed.includes(ext)) {
      setError('Invalid file type. Allowed: PDF, JPG, PNG, DOCX, XLSX.');
      setTimeout(() => setError(''), 5000);
      return;
    }

    // Size limit frontend check: 10MB
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
    // Assuming role matches the required 'entity_type' (buyer/supplier)
    formData.append('entity_type', user.role || 'supplier');

    try {
      const token = localStorage.getItem('grawizah_token');
      const res = await fetch(`${API_URL}/api/documents/upload`, {
        method: 'POST',
        headers: { ...(token && { 'Authorization': `Bearer ${token}` }) },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Upload failed');
      }

      await fetchDocuments(); // Refresh list
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message);
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
      console.error(err);
      setError('Failed to securely download document.');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm('Permanently delete this secure document?')) return;
    try {
      const token = localStorage.getItem('grawizah_token');
      const res = await fetch(`${API_URL}/api/documents/${docId}`, {
        method: 'DELETE',
        headers: { ...(token && { 'Authorization': `Bearer ${token}` }) }
      });
      if (!res.ok) throw new Error('Delete failed');
      setDocuments(prev => prev.filter(d => d.id !== docId));
    } catch (err) {
      console.error(err);
      setError('Failed to delete document.');
      setTimeout(() => setError(''), 5000);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <RefreshCcw className="w-8 h-8 animate-spin text-primary opacity-20" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Decrypting Vault...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 w-full min-h-full font-sans">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-6">
        <div>
           <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                 <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em]">AES-256 GCM Encrypted</span>
           </div>
           <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Document Vault</h2>
           <p className="text-sm text-gray-500 font-medium mt-1">Securely manage your trade credentials, KYC docs, and certifications.</p>
        </div>
        
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
          className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-xl hover:opacity-90 disabled:opacity-50 transition-all"
        >
          {uploading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? 'Encrypting...' : 'Secure Upload'}
        </button>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-xs font-black uppercase tracking-widest border border-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <div className="bg-white dark:bg-dark-surface-container-low rounded-[2.5rem] border border-gray-100 dark:border-dark-surface-variant/20 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-gray-50/50 dark:bg-white/5 text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-black">
                     <th className="px-8 py-5">Secure File</th>
                     <th className="px-8 py-5">Upload Date</th>
                     <th className="px-8 py-5">Size</th>
                     <th className="px-8 py-5 text-right">Access</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                  {documents.length > 0 ? documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50/80 dark:hover:bg-white/5 transition-colors group">
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
                                <FileBadge className="w-5 h-5" />
                             </div>
                             <div>
                                <p className="text-[13px] font-black text-gray-900 dark:text-white leading-none">{doc.original_name}</p>
                                <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase">ID: {doc.id.substring(0,8)}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <p className="text-[12px] font-bold text-gray-500 dark:text-gray-400">{new Date(doc.created_at).toLocaleDateString()}</p>
                       </td>
                       <td className="px-8 py-6">
                          <p className="text-[12px] font-bold text-gray-500 dark:text-gray-400">{(doc.file_size / 1024).toFixed(1)} KB</p>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2">
                             <button onClick={() => handleDownload(doc.id, doc.original_name)} className="p-2.5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all" title="Decrypt & Download">
                                <Download className="w-4 h-4" />
                             </button>
                             <button onClick={() => handleDelete(doc.id)} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Permanently Delete">
                                <Trash2 className="w-4 h-4" />
                             </button>
                          </div>
                       </td>
                    </tr>
                  )) : (
                    <tr>
                       <td colSpan={4} className="px-8 py-20 text-center">
                          <div className="flex flex-col items-center gap-3">
                             <FileText className="w-10 h-10 text-gray-200 mb-2" />
                             <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Vault is Empty</p>
                             <p className="text-xs text-gray-400 font-medium max-w-sm">Securely upload your KYC and product certifications. Files are encrypted with AES-256 before storage.</p>
                          </div>
                       </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
