'use client';

import React, { useState } from 'react';
import { FileText, Upload, Download, Lock, Trash2, Eye } from 'lucide-react';

interface Document {
  id: string;
  filename: string;
  type: string;
  size: string;
  uploadedAt: string;
  encrypted: boolean;
}

export default function DocumentVaultPage() {
  const [documents] = useState<Document[]>([
    {
      id: '1',
      filename: 'Import_License_2026.pdf',
      type: 'License',
      size: '2.4 MB',
      uploadedAt: '2026-04-20',
      encrypted: true,
    },
    {
      id: '2',
      filename: 'Certificate_of_Origin.pdf',
      type: 'Certificate',
      size: '1.8 MB',
      uploadedAt: '2026-04-18',
      encrypted: true,
    },
    {
      id: '3',
      filename: 'Purchase_Order_PO12345.pdf',
      type: 'Purchase Order',
      size: '856 KB',
      uploadedAt: '2026-04-15',
      encrypted: true,
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Document Vault</h1>
            <p className="text-gray-600 mt-1">Secure storage for your trade documents</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload Document
          </button>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">End-to-End Encryption</h3>
            <p className="text-sm text-blue-700">
              All documents are encrypted at rest and in transit. Only you have access to your files.
            </p>
          </div>
        </div>

        {/* Storage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Lock className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Encrypted Files</p>
                <p className="text-2xl font-bold text-gray-900">
                  {documents.filter(d => d.encrypted).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Storage Used</p>
                <p className="text-2xl font-bold text-gray-900">5.1 MB</p>
                <p className="text-xs text-gray-500">of 10 GB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Security</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>No documents uploaded yet</p>
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-gray-900">{doc.filename}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="badge badge-primary">{doc.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doc.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {doc.encrypted && (
                        <span className="flex items-center gap-1 text-green-600 text-sm">
                          <Lock className="w-3 h-3" />
                          Encrypted
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
