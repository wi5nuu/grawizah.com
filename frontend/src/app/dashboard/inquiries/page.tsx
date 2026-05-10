'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { InquiryService } from '@/services/InquiryService';

type InquiryStatus = 'pending' | 'responded' | 'converted' | 'open' | 'closed';

const MOCK_INQUIRIES = [
  { id: '1', buyer_name: 'John Doe', buyer_company: 'Acme Corp', buyer_country: 'USA', product_name: 'Industrial Valves X-200', quantity: '500 units', message: 'We are looking to place a bulk order for the X-200 series for our upcoming...', status: 'pending' as InquiryStatus, created_at: '2024-01-15' },
  { id: '2', buyer_name: 'Maria Silva', buyer_company: 'Global Tech Imports', buyer_country: 'Brazil', product_name: 'Circuit Boards Model B', quantity: '10,000 units', message: 'Can you confirm the lead time for 10k units shipped via sea freight to...', status: 'responded' as InquiryStatus, created_at: '2024-01-14' },
  { id: '3', buyer_name: 'Chen Wei', buyer_company: 'Sinopec Trading', buyer_country: 'China', product_name: 'Raw Material Grade A', quantity: '2 Tons', message: 'Please send the MSDS and the latest pricing for Grade A material...', status: 'converted' as InquiryStatus, created_at: '2024-01-12' },
  { id: '4', buyer_name: 'Aisha Khan', buyer_company: 'Desert Oasis Retail', buyer_country: 'UAE', product_name: 'Textile Samples Lot 4', quantity: 'Requesting Samples', message: 'Interested in feeling the texture of Lot 4 before committing to a larger...', status: 'pending' as InquiryStatus, created_at: '2024-01-10' },
];

export default function InquiriesPage() {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState(MOCK_INQUIRIES);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const service = new InquiryService();
        const data = await service.getInquiriesBySupplier(user?.id || 'mock-supplier');
        if (data && data.length > 0) setInquiries(data as any);
      } catch { }
    };
    fetchInquiries();
  }, [user?.id]);

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-error-container/20 text-error dark:bg-red-900/20 dark:text-red-400';
      case 'responded': return 'bg-primary-container/20 text-primary dark:bg-primary-900/20 dark:text-primary-400';
      case 'converted': return 'bg-tertiary-container/20 text-tertiary-container dark:bg-emerald-900/20 dark:text-emerald-400';
      default: return 'bg-surface-variant text-on-surface-variant dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getAvatarColor = (index: number) => {
    const colors = ['bg-secondary-container/20 text-secondary dark:bg-blue-900/20 dark:text-blue-400', 'bg-tertiary-container/20 text-tertiary dark:bg-emerald-900/20 dark:text-emerald-400', 'bg-secondary-fixed-dim/30 text-on-secondary-fixed dark:bg-indigo-900/20 dark:text-indigo-400', 'bg-primary-fixed-dim/30 text-on-primary-fixed dark:bg-purple-900/20 dark:text-purple-400'];
    return colors[index % colors.length];
  };

  const stats = [
    { label: 'Pending Inquiries', value: inquiries.filter(i => i.status === 'pending').length, icon: 'schedule', iconStyle: { fontVariationSettings: "'FILL' 1" }, bg: 'bg-error-container text-on-error-container dark:bg-red-900/30 dark:text-red-400' },
    { label: 'Responded', value: inquiries.filter(i => i.status === 'responded').length, icon: 'mark_email_read', iconStyle: { fontVariationSettings: "'FILL' 1" }, bg: 'bg-primary-container/20 text-primary dark:bg-primary-900/30 dark:text-primary-400' },
    { label: 'Converted Leads', value: inquiries.filter(i => i.status === 'converted').length, icon: 'check_circle', iconStyle: { fontVariationSettings: "'FILL' 1" }, bg: 'bg-tertiary-container/20 text-tertiary-container dark:bg-emerald-900/30 dark:text-emerald-400' },
  ];

  const handleConvert = async (id: string) => {
    try {
      const service = new InquiryService();
      await service.markAsConverted(id);
      setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: 'converted' as InquiryStatus } : inq));
    } catch { }
  };

  const handleReply = (id: string) => {
    alert(`Opening reply dialog for inquiry #${id}`);
    setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: 'responded' as InquiryStatus } : inq));
  };

  const handleView = (id: string) => {
    alert(`Opening detailed view for inquiry #${id}`);
  };

  const handleFilter = () => {
    alert('Opening advanced filter panel...');
  };

  const handleExport = () => {
    alert('Exporting inquiries data to CSV...');
  };

  const filteredInquiries = inquiries.filter(inq => 
    inq.buyer_name.toLowerCase().includes(search.toLowerCase()) || 
    inq.product_name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);
  const displayedInquiries = filteredInquiries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-8 max-w-[1440px] mx-auto w-full font-body">
      {/* Header */}
      <header className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-dark-on-surface mb-2">Supplier Inquiries Inbox</h2>
          <p className="text-gray-500 dark:text-dark-on-surface-variant font-body">Manage and respond to buyer requests for quotes and product information.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={handleFilter} className="border border-gray-200 dark:border-dark-surface-variant/30 text-gray-700 dark:text-dark-on-surface font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors">
            <span className="material-symbols-outlined text-[20px]">filter_list</span> Filter
          </button>
          <button onClick={handleExport} className="border border-gray-200 dark:border-dark-surface-variant/30 text-gray-700 dark:text-dark-on-surface font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors">
            <span className="material-symbols-outlined text-[20px]">download</span> Export
          </button>
        </div>
      </header>

      {/* Stats Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-surface-variant/30 rounded-xl p-6 shadow-sm shadow-primary/5 hover:-translate-y-1 hover:shadow-md transition-all duration-200 flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-dark-on-surface-variant font-medium mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
            </div>
            <div className={`${stat.bg} w-12 h-12 rounded-full flex items-center justify-center`}>
              <span className="material-symbols-outlined" style={stat.iconStyle}>{stat.icon}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Inquiries Table */}
      <section className="bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-surface-variant/30 rounded-xl shadow-sm shadow-primary/5 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-dark-surface-variant/30 flex justify-between items-center">
          <h3 className="font-display font-semibold text-lg text-gray-900 dark:text-white">Recent Inquiries</h3>
          <div className="relative w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">search</span>
            <input
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-dark-surface-container-high border-none rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
              placeholder="Search inquiries..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-dark-surface-container-high border-b border-gray-100 dark:border-dark-surface-variant/30 text-gray-500 dark:text-gray-400 text-sm font-medium">
                <th className="p-4 pl-6 w-1/4">Buyer Info</th>
                <th className="p-4 w-1/4">Product Reference</th>
                <th className="p-4 w-1/3">Message Snippet</th>
                <th className="p-4 w-[100px]">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-surface-variant/20 text-sm">
              {displayedInquiries.map((inq, index) => (
                <tr key={inq.id} className="hover:bg-gray-50/50 dark:hover:bg-dark-surface-container-high/50 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${getAvatarColor(index)} flex items-center justify-center font-bold`}>
                        {getInitials(inq.buyer_name)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{inq.buyer_name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{inq.buyer_company} • {inq.buyer_country}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-700 dark:text-gray-300">
                    <p className="font-medium">{inq.product_name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Qty: {inq.quantity}</p>
                  </td>
                  <td className="p-4 text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                    &ldquo;{inq.message}&rdquo;
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 ${getStatusBadge(inq.status)} rounded-full text-xs font-semibold whitespace-nowrap capitalize`}>
                      {inq.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    {inq.status === 'pending' ? (
                      <button onClick={() => handleReply(inq.id)} className="text-primary dark:text-primary-400 hover:text-primary/80 font-medium flex items-center justify-end gap-1 ml-auto">
                        Reply <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </button>
                    ) : inq.status === 'responded' ? (
                      <button onClick={() => handleConvert(inq.id)} className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-medium flex items-center justify-end gap-1 ml-auto">
                        Convert <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      </button>
                    ) : (
                      <button onClick={() => handleView(inq.id)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium flex items-center justify-end gap-1 ml-auto">
                        View <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 dark:border-dark-surface-variant/30 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-dark-surface">
          <span>Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredInquiries.length)} of {filteredInquiries.length} entries</span>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-200 dark:border-dark-surface-variant/50 rounded hover:bg-gray-50 dark:hover:bg-dark-surface-container-high disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 border border-gray-200 dark:border-dark-surface-variant/50 rounded hover:bg-gray-50 dark:hover:bg-dark-surface-container-high disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
