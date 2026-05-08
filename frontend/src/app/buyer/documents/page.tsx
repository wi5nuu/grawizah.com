'use client';

import { useState } from 'react';
import { Lock, Upload, FileText, Trash2, Download, Shield } from 'lucide-react';

const MOCK_DOCS = [
  { id: '1', name: 'Import_License_2026.pdf', type: 'pdf', size: '2.4 MB', encrypted: true, uploaded: '2026-05-01' },
  { id: '2', name: 'Purchase_Order_001.pdf', type: 'pdf', size: '1.1 MB', encrypted: true, uploaded: '2026-04-28' },
  { id: '3', name: 'Supplier_Agreement_NusantaraAgro.docx', type: 'docx', size: '856 KB', encrypted: true, uploaded: '2026-04-25' },
  { id: '4', name: 'Quality_Inspection_Report.pdf', type: 'pdf', size: '3.2 MB', encrypted: true, uploaded: '2026-04-20' },
];

export default function DocumentVaultPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
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
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <Shield className="w-6 h-6 text-green-600" />
          <div>
            <p className="text-sm font-semibold text-green-800">End-to-End Encrypted</p>
            <p className="text-xs text-green-600">All documents are protected with AES-256 encryption. PDPA-aligned security.</p>
          </div>
        </div>

        {/* Document List */}
        <div className="space-y-3">
          {MOCK_DOCS.map((doc) => (
            <div key={doc.id} className="card flex items-center justify-between hover:shadow-md transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                    <span>{doc.size}</span>
                    <span>Uploaded: {doc.uploaded}</span>
                    {doc.encrypted && (
                      <span className="badge-success text-[10px]"><Lock className="w-2.5 h-2.5 mr-0.5" /> Encrypted</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
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
      </div>
    </div>
  );
}
