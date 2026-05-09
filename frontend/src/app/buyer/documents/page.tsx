'use client';

import { useState } from 'react';
import { Lock, Upload, FileText, Trash2, Download, Shield, Search, Filter, FolderOpen, Image, FileSpreadsheet, AlertCircle } from 'lucide-react';

const MOCK_DOCS = [
  { id: '1', name: 'Import_License_2026.pdf', type: 'pdf', size: '2.4 MB', encrypted: true, uploaded: '2026-05-01', category: 'License' },
  { id: '2', name: 'Purchase_Order_001.pdf', type: 'pdf', size: '1.1 MB', encrypted: true, uploaded: '2026-04-28', category: 'Order' },
  { id: '3', name: 'Supplier_Agreement_NusantaraAgro.docx', type: 'docx', size: '856 KB', encrypted: true, uploaded: '2026-04-25', category: 'Agreement' },
  { id: '4', name: 'Quality_Inspection_Report.pdf', type: 'pdf', size: '3.2 MB', encrypted: true, uploaded: '2026-04-20', category: 'Report' },
  { id: '5', name: 'Shipping_Manifest_May.pdf', type: 'pdf', size: '1.8 MB', encrypted: true, uploaded: '2026-04-15', category: 'Shipping' },
  { id: '6', name: 'Product_Photos_Batch1.zip', type: 'zip', size: '12.4 MB', encrypted: true, uploaded: '2026-04-10', category: 'Media' },
];

export default function DocumentVaultPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(MOCK_DOCS.map(d => d.category)))];

  const filteredDocs = MOCK_DOCS.filter(doc => {
    const matchSearch = !searchQuery || doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = filterCategory === 'all' || doc.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const totalSize = MOCK_DOCS.reduce((sum, d) => {
    const num = parseFloat(d.size);
    return sum + (d.size.includes('MB') ? num : num / 1024);
  }, 0).toFixed(1);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-6 h-6 text-red-500" />;
      case 'docx': return <FileText className="w-6 h-6 text-accent-500" />;
      case 'zip': return <FolderOpen className="w-6 h-6 text-amber-500" />;
      case 'xlsx': return <FileSpreadsheet className="w-6 h-6 text-green-500" />;
      case 'jpg': case 'png': return <Image className="w-6 h-6 text-primary-500" />;
      default: return <FileText className="w-6 h-6 text-gray-400" />;
    }
  };

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      License: 'bg-primary-50 text-primary-700', Order: 'bg-accent-50 text-accent-700',
      Agreement: 'bg-green-50 text-green-700', Report: 'bg-amber-50 text-amber-700',
      Shipping: 'bg-purple-50 text-purple-700', Media: 'bg-pink-50 text-pink-700',
    };
    return colors[cat] || 'bg-gray-50 text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Lock className="w-6 h-6 text-amber-600" /> Document Vault
            </h1>
            <p className="text-gray-500 mt-1">AES-256 encrypted document storage</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Upload className="w-5 h-5" /> Upload Document
          </button>
        </div>

        {/* Security Badge */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 mb-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-green-800">End-to-End Encrypted</p>
            <p className="text-xs text-green-600 mt-0.5">All documents are protected with AES-256 encryption. PDPA-aligned security.</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-lg font-bold text-green-700">{MOCK_DOCS.length}</p>
            <p className="text-xs text-green-600">Documents</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-lg font-bold text-green-700">{totalSize} MB</p>
            <p className="text-xs text-green-600">Total Size</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search documents..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-field pl-10" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setFilterCategory(cat)} className={`px-3 py-2 rounded-lg text-xs font-medium transition capitalize ${filterCategory === cat ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Document List */}
        <div className="space-y-3">
          {filteredDocs.map((doc) => (
            <div key={doc.id} className="card flex items-center justify-between hover:shadow-md transition group">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary-50 transition">
                  {getFileIcon(doc.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1 flex-wrap">
                    <span>{doc.size}</span>
                    <span>Uploaded: {doc.uploaded}</span>
                    <span className={`badge text-[10px] ${getCategoryColor(doc.category)}`}>{doc.category}</span>
                    {doc.encrypted && (
                      <span className="badge-success text-[10px] flex items-center gap-0.5">
                        <Lock className="w-2.5 h-2.5" /> Encrypted
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 ml-4">
                <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition" title="Download">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredDocs.length === 0 && (
          <div className="text-center py-16">
            <FolderOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500 mb-1">No documents found</p>
            <p className="text-sm text-gray-400">Upload your first document to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
