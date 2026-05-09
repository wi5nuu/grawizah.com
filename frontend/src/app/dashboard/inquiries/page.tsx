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
      case 'pending': return 'bg-error-container/20 text-error';
      case 'responded': return 'bg-primary-container/20 text-primary';
      case 'converted': return 'bg-tertiary-container/20 text-tertiary-container';
      default: return 'bg-surface-variant text-on-surface-variant';
    }
  };

  const getAvatarColor = (index: number) => {
    const colors = ['bg-secondary-container/20 text-secondary', 'bg-tertiary-container/20 text-tertiary', 'bg-secondary-fixed-dim/30 text-on-secondary-fixed', 'bg-primary-fixed-dim/30 text-on-primary-fixed'];
    return colors[index % colors.length];
  };

  const stats = [
    { label: 'Pending Inquiries', value: inquiries.filter(i => i.status === 'pending').length, icon: 'schedule', iconStyle: { fontVariationSettings: "'FILL' 1" }, bg: 'bg-error-container text-on-error-container' },
    { label: 'Responded', value: inquiries.filter(i => i.status === 'responded').length, icon: 'mark_email_read', iconStyle: { fontVariationSettings: "'FILL' 1" }, bg: 'bg-primary-container/20 text-primary' },
    { label: 'Converted Leads', value: inquiries.filter(i => i.status === 'converted').length, icon: 'check_circle', iconStyle: { fontVariationSettings: "'FILL' 1" }, bg: 'bg-tertiary-container/20 text-tertiary-container' },
  ];

  const handleConvert = async (id: string) => {
    try {
      const service = new InquiryService();
      await service.markAsConverted(id);
      setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: 'converted' as InquiryStatus } : inq));
    } catch { }
  };

  return (
    <div className="p-8 max-w-[1440px] mx-auto w-full">
      {/* Header */}
      <header className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-display font-bold text-on-background mb-2">Supplier Inquiries Inbox</h2>
          <p className="text-on-surface-variant font-body">Manage and respond to buyer requests for quotes and product information.</p>
        </div>
        <div className="flex gap-4">
          <button className="border border-outline text-on-surface font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-[20px]">filter_list</span> Filter
          </button>
          <button className="border border-outline text-on-surface font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-[20px]">download</span> Export
          </button>
        </div>
      </header>

      {/* Stats Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface-container-lowest border border-surface-variant/50 rounded-xl p-6 shadow-sm shadow-primary/5 hover:-translate-y-1 hover:shadow-md transition-all duration-200 flex items-center justify-between">
            <div>
              <p className="text-on-surface-variant font-medium mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-on-background">{stat.value}</h3>
            </div>
            <div className={`${stat.bg} w-12 h-12 rounded-full flex items-center justify-center`}>
              <span className="material-symbols-outlined" style={stat.iconStyle}>{stat.icon}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Inquiries Table */}
      <section className="bg-surface-container-lowest border border-surface-variant/50 rounded-xl shadow-sm shadow-primary/5 overflow-hidden">
        <div className="p-6 border-b border-surface-variant/30 flex justify-between items-center">
          <h3 className="font-display font-semibold text-lg text-on-background">Recent Inquiries</h3>
          <div className="relative w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-on-surface-variant/70 text-on-surface"
              placeholder="Search inquiries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-surface-variant/30 text-on-surface-variant text-sm font-medium">
                <th className="p-4 pl-6 w-1/4">Buyer Info</th>
                <th className="p-4 w-1/4">Product Reference</th>
                <th className="p-4 w-1/3">Message Snippet</th>
                <th className="p-4 w-[100px]">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant/20 text-sm">
              {inquiries.map((inq, index) => (
                <tr key={inq.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${getAvatarColor(index)} flex items-center justify-center font-bold`}>
                        {getInitials(inq.buyer_name)}
                      </div>
                      <div>
                        <p className="font-semibold text-on-background">{inq.buyer_name}</p>
                        <p className="text-xs text-on-surface-variant">{inq.buyer_company} • {inq.buyer_country}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-on-surface">
                    <p className="font-medium">{inq.product_name}</p>
                    <p className="text-xs text-on-surface-variant">Qty: {inq.quantity}</p>
                  </td>
                  <td className="p-4 text-on-surface-variant truncate max-w-[200px]">
                    &ldquo;{inq.message}&rdquo;
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 ${getStatusBadge(inq.status)} rounded-full text-xs font-semibold whitespace-nowrap capitalize`}>
                      {inq.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    {inq.status === 'pending' ? (
                      <button className="text-primary hover:text-primary/80 font-medium flex items-center justify-end gap-1 ml-auto">
                        Reply <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </button>
                    ) : inq.status === 'responded' ? (
                      <button onClick={() => handleConvert(inq.id)} className="text-tertiary-container hover:text-tertiary font-medium flex items-center justify-end gap-1 ml-auto">
                        Convert <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      </button>
                    ) : (
                      <button className="text-on-surface-variant hover:text-on-surface font-medium flex items-center justify-end gap-1 ml-auto">
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
        <div className="p-4 border-t border-surface-variant/30 flex items-center justify-between text-sm text-on-surface-variant bg-surface-container-lowest">
          <span>Showing 1 to {inquiries.length} of {inquiries.length} entries</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-outline/50 rounded hover:bg-surface-container-high disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-outline/50 rounded hover:bg-surface-container-high">Next</button>
          </div>
        </div>
      </section>
    </div>
  );
}
