'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { InquiryStatus } from '@/types';
import Link from 'next/link';
import { InquiryService } from '@/services/InquiryService';
import { API_BASE_URL } from '@/lib/constants';
import {
  Mail,
  Search,
  Filter,
  Download,
  Clock,
  CheckCircle2,
  MessageSquare,
  ArrowRight,
  MoreVertical,
  User,
  ShieldCheck,
  RefreshCcw,
  X,
  Sparkles,
  Send,
  Zap
} from 'lucide-react';

export default function InquiriesPage() {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // [H-01] Per-inquiry quality score state: tracks loading + error per inquiry ID
  const [qualityScores, setQualityScores] = useState<Record<string, any>>({});
  const [qualityLoading, setQualityLoading] = useState<Record<string, boolean>>({});
  const [qualityErrors, setQualityErrors] = useState<Record<string, boolean>>({});

  // [B-01] Buyer profile cache — maps buyer_id → { company_name, country }
  const [buyerProfiles, setBuyerProfiles] = useState<Record<string, any>>({});

  const [loading, setLoading] = useState(true);

  // Reply Modal States
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSending, setIsSending] = useState(false); // [L-04] prevent double-submit

  const itemsPerPage = 6;

  // ── [H-01] Batch quality score fetcher ────────────────────────────────────
  // Fetches quality scores only for the inquiries VISIBLE on the current page.
  // Uses Promise.allSettled so one failure doesn't block the others.
  const fetchQualityScores = useCallback(async (visibleInquiries: any[]) => {
    // Filter out scores we already have (no re-fetch on page nav if cached)
    const toFetch = visibleInquiries.filter(
      (inq) => !qualityScores[inq.id] && !qualityLoading[inq.id]
    );
    if (toFetch.length === 0) return;

    // Mark them as loading
    const loadingInit = toFetch.reduce((acc, inq) => ({ ...acc, [inq.id]: true }), {});
    setQualityLoading((prev) => ({ ...prev, ...loadingInit }));

    const token = localStorage.getItem('grawizah_token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const results = await Promise.allSettled(
      toFetch.map((inq) =>
        fetch(`${API_BASE_URL}/api/buyers/${inq.buyer_id}/quality-score`, { headers })
          .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
          .then((data) => ({ id: inq.id, data }))
      )
    );

    const newScores: Record<string, any> = {};
    const newErrors: Record<string, boolean> = {};
    const doneLoading: Record<string, boolean> = {};

    results.forEach((result, i) => {
      const inqId = toFetch[i].id;
      doneLoading[inqId] = false;
      if (result.status === 'fulfilled') {
        newScores[inqId] = result.value.data;
      } else {
        newErrors[inqId] = true;
      }
    });

    setQualityScores((prev) => ({ ...prev, ...newScores }));
    setQualityErrors((prev) => ({ ...prev, ...newErrors }));
    setQualityLoading((prev) => ({ ...prev, ...doneLoading }));
  }, [qualityScores, qualityLoading]);
  // ── End H-01 ──────────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchInquiries = async () => {
      if (!user) return;
      try {
        const service = new InquiryService();
        const data = await service.getInquiriesBySupplier(user.id);
        const list = Array.isArray(data) ? data : [];
        setInquiries(list);

        // [B-01] Batch fetch unique buyer profiles to enrich the table display
        const uniqueBuyerIds = [...new Set(list.map((inq: any) => inq.buyer_id).filter(Boolean))];
        if (uniqueBuyerIds.length > 0) {
          const token = localStorage.getItem('grawizah_token');
          const headers: Record<string, string> = { 'Content-Type': 'application/json' };
          if (token) headers['Authorization'] = `Bearer ${token}`;
          const results = await Promise.allSettled(
            uniqueBuyerIds.map((id) =>
              fetch(`${API_BASE_URL}/api/buyers/${id}`, { headers })
                .then((r) => r.ok ? r.json() : Promise.reject())
                .then((b) => ({ id, profile: b }))
            )
          );
          const profileMap: Record<string, any> = {};
          results.forEach((res) => {
            if (res.status === 'fulfilled') {
              profileMap[res.value.id] = res.value.profile;
            }
          });
          setBuyerProfiles(profileMap);
        }
      } catch (err) {
        console.error('Fetch inquiries error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, [user]);

  // Filtering and pagination
  const filteredInquiries = inquiries.filter(
    (inq) =>
      (inq.buyer_id || '').toLowerCase().includes(search.toLowerCase()) ||
      (inq.message || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);
  const displayedInquiries = filteredInquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // [H-01] Trigger batch fetch whenever the visible page changes
  useEffect(() => {
    if (displayedInquiries.length > 0) {
      fetchQualityScores(displayedInquiries);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, inquiries]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
      case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200/50';
      case 'responded': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200/50';
      case 'converted': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200/50';
      default: return 'bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-gray-400 border border-gray-200/50';
    }
  };

  const handleConvert = async (id: string) => {
    try {
      const service = new InquiryService();
      await service.markAsConverted(id);
      setInquiries((prev) => prev.map((inq) => (inq.id === id ? { ...inq, status: 'converted' } : inq)));
    } catch {}
  };

  const handleReply = (inq: any) => {
    setSelectedInquiry(inq);
    setReplyMessage('');
    setIsReplyModalOpen(true);
  };

  const generateAiResponse = async () => {
    if (!selectedInquiry) return;
    setIsAiLoading(true);
    try {
      const service = new InquiryService();
      const result = await service.getAIResponseSuggestion(selectedInquiry.id);
      setReplyMessage(result.suggested_response);
    } catch (err) {
      console.error('AI Suggestion failed:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!selectedInquiry || !replyMessage || isSending) return; // [L-04] guard
    setIsSending(true); // [L-04] lock button immediately
    try {
      const service = new InquiryService();
      await service.respondToInquiry(selectedInquiry.id, replyMessage);
      setInquiries((prev) =>
        prev.map((inq) =>
          inq.id === selectedInquiry.id ? { ...inq, status: 'responded' } : inq
        )
      );
      setIsReplyModalOpen(false);
    } catch (err) {
      console.error('Failed to send reply:', err);
    } finally {
      setIsSending(false); // [L-04] always unlock
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <RefreshCcw className="w-8 h-8 animate-spin text-primary opacity-20" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Scanning Secure Inbound...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 w-full min-h-full font-sans">
      {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-6">
        <div>
           <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                 <Mail className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Communication Hub</span>
           </div>
           <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Supplier Inquiries Inbox</h2>
           <p className="text-sm text-gray-500 font-medium mt-1">Manage and respond to secure buyer requests with AI-assisted workflows.</p>
        </div>
        <div className="flex gap-3">
           <button className="px-5 py-2.5 bg-white dark:bg-dark-surface-container-low border border-gray-200 dark:border-dark-surface-variant/20 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm">
              <Filter className="w-4 h-4" /> Filter
           </button>
           <button className="px-5 py-2.5 bg-white dark:bg-dark-surface-container-low border border-gray-200 dark:border-dark-surface-variant/20 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm">
              <Download className="w-4 h-4" /> Export
           </button>
        </div>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
         {[
           { label: 'Pending Response', value: inquiries.filter((i) => i.status === 'open' || i.status === 'pending').length, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
           { label: 'Total Responded', value: inquiries.filter((i) => i.status === 'responded').length, icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50' },
           { label: 'Deals Converted', value: inquiries.filter((i) => i.status === 'converted').length, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' }
         ].map((stat, i) => (
           <div key={i} className="bg-white dark:bg-dark-surface-container-low p-6 rounded-[2rem] border border-gray-100 dark:border-dark-surface-variant/20 shadow-sm flex items-center justify-between group">
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                 <h3 className="text-3xl font-black text-gray-900 dark:text-white">{stat.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} dark:bg-opacity-10 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                 <stat.icon className="w-6 h-6" />
              </div>
           </div>
         ))}
      </div>

      {/* Main Table Area */}
      <div className="bg-white dark:bg-dark-surface-container-low rounded-[2.5rem] border border-gray-100 dark:border-dark-surface-variant/20 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-50 dark:border-dark-surface-variant/10 flex flex-col md:flex-row justify-between items-center gap-4">
           <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Inbound Requests</h3>
           <div className="relative w-full md:w-80 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input
                 type="text"
                 placeholder="Search by buyer ID or message..."
                 className="w-full bg-gray-50 dark:bg-dark-surface-container border border-transparent focus:border-primary/20 focus:bg-white text-xs font-semibold pl-10 pr-4 py-2.5 rounded-xl outline-none transition-all"
                 value={search}
                 onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              />
           </div>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-gray-50/50 dark:bg-white/5 text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-black">
                    <th className="px-8 py-5">Buyer Identity</th>
                    <th className="px-8 py-5">Request Details</th>
                    <th className="px-8 py-5">Compliance</th>
                    <th className="px-8 py-5 text-center">Status</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                 {displayedInquiries.length > 0 ? displayedInquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-gray-50/80 dark:hover:bg-white/5 transition-colors group">
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-white/5 dark:to-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 font-black text-xs border border-gray-200 dark:border-white/10 group-hover:from-primary group-hover:to-primary/80 group-hover:text-white transition-all">
                               {buyerProfiles[inq.buyer_id]?.company_name
                                  ? buyerProfiles[inq.buyer_id].company_name[0]?.toUpperCase()
                                  : (inq.buyer_id?.substring(0, 2).toUpperCase() ?? '??')}
                             </div>
                             <div>
                                <p className="text-[13px] font-black text-gray-900 dark:text-white leading-none">
                                  {buyerProfiles[inq.buyer_id]?.company_name || `Buyer #${inq.id.substring(0, 6).toUpperCase()}`}
                                </p>
                                <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-tighter">
                                  {buyerProfiles[inq.buyer_id]?.country
                                    ? `📍 ${buyerProfiles[inq.buyer_id].country}`
                                    : `ID: ${inq.buyer_id?.substring(0, 12)}...`}
                                </p>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6 max-w-[300px]">
                          <p className="text-[12px] text-gray-700 dark:text-gray-300 font-medium italic line-clamp-2 leading-relaxed">
                             &ldquo;{inq.message}&rdquo;
                          </p>
                          <div className="flex items-center gap-4 mt-3">
                             <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                                <Clock className="w-3 h-3" /> {new Date(inq.created_at).toLocaleDateString()}
                             </div>
                          </div>
                       </td>

                       {/* [H-01] Per-row quality score with skeleton + error states */}
                       <td className="px-8 py-6">
                          {qualityLoading[inq.id] ? (
                             <div className="w-9 h-9 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" />
                          ) : qualityErrors[inq.id] ? (
                             <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-400 text-xs font-black" title="Score unavailable">—</div>
                          ) : qualityScores[inq.id] ? (
                             <div className="flex items-center gap-2">
                                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black text-xs">
                                   {qualityScores[inq.id].overall_score}
                                </div>
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                             </div>
                          ) : (
                             <div className="w-9 h-9 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" />
                          )}
                       </td>

                       <td className="px-8 py-6 text-center">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusBadge(inq.status)}`}>
                             {inq.status}
                          </span>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2">
                             {inq.status === 'open' || inq.status === 'pending' ? (
                                <button
                                   onClick={() => handleReply(inq)}
                                   className="px-4 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2"
                                >
                                   Respond <ArrowRight className="w-3 h-3" />
                                </button>
                             ) : inq.status === 'responded' ? (
                                <button
                                   onClick={() => handleConvert(inq.id)}
                                   className="px-4 py-2 border border-emerald-500 text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-2"
                                >
                                   Convert <CheckCircle2 className="w-3 h-3" />
                                </button>
                             ) : (
                                <button className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                   <MoreVertical className="w-5 h-5" />
                                </button>
                             )}
                          </div>
                       </td>
                    </tr>
                 )) : (
                    <tr>
                       <td colSpan={5} className="px-8 py-20 text-center">
                          <div className="flex flex-col items-center gap-3">
                             <Mail className="w-10 h-10 text-gray-200 mb-2" />
                             <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">No Inbound Requests</p>
                             <p className="text-xs text-gray-400 font-medium">Your authenticated inquiries will appear here.</p>
                          </div>
                       </td>
                    </tr>
                 )}
              </tbody>
           </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-6 bg-gray-50/50 dark:bg-white/5 border-t border-gray-50 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
           <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              {filteredInquiries.length > 0
                ? <>Showing <span className="text-gray-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-gray-900 dark:text-white">{Math.min(currentPage * itemsPerPage, filteredInquiries.length)}</span> of {filteredInquiries.length} Intelligence Nodes</>
                : 'No results'}
           </p>
           <div className="flex gap-2">
              <button
                 disabled={currentPage === 1}
                 onClick={() => setCurrentPage((p) => p - 1)}
                 className="px-4 py-2 bg-white dark:bg-dark-surface border border-gray-200 dark:border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30"
              >
                 Prev
              </button>
              <button
                 disabled={currentPage >= totalPages}
                 onClick={() => setCurrentPage((p) => p + 1)}
                 className="px-4 py-2 bg-white dark:bg-dark-surface border border-gray-200 dark:border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30"
              >
                 Next
              </button>
           </div>
        </div>
      </div>

      {/* Reply Modal */}
      {isReplyModalOpen && selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-dark-surface rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-in border border-gray-100 dark:border-dark-surface-variant/20">
            <div className="p-8 border-b border-gray-50 dark:border-dark-surface-variant/10 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Intelligence Response</h3>
                <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">Responding to #{selectedInquiry.id.substring(0, 8).toUpperCase()}</p>
              </div>
              <button onClick={() => setIsReplyModalOpen(false)} className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 flex items-center justify-center text-gray-400 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Original Message */}
              <div className="bg-primary/5 dark:bg-primary/10 p-6 rounded-3xl border border-primary/10">
                <div className="flex items-center gap-2 mb-3">
                   <User className="w-3 h-3 text-primary" />
                   <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Original Buyer Message</p>
                </div>
                <p className="text-[13px] italic text-gray-700 dark:text-gray-300 leading-relaxed">&ldquo;{selectedInquiry.message}&rdquo;</p>
              </div>

              {/* Reply Textarea */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Drafting Your Response</label>
                  {user?.role === 'free_trader' ? (
                     <Link href="/pricing" className="flex items-center gap-2 px-4 py-1.5 bg-purple-50 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-purple-100 transition-all border border-purple-200">
                        <Zap className="w-3 h-3" /> Upgrade to Pro for AI Assist
                     </Link>
                  ) : (
                    <button
                      onClick={generateAiResponse}
                      disabled={isAiLoading}
                      className="flex items-center gap-2 px-4 py-1.5 bg-purple-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-purple-500/20"
                    >
                      {isAiLoading ? <RefreshCcw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      {isAiLoading ? 'AI Reasoning...' : 'Grawizah AI Assist'}
                    </button>
                  )}
                </div>
                <div className="relative group">
                   <textarea
                     value={replyMessage}
                     onChange={(e) => setReplyMessage(e.target.value)}
                     className="w-full h-48 p-6 rounded-[2rem] border-2 border-gray-100 dark:border-dark-surface-variant/20 bg-gray-50/30 dark:bg-dark-surface-container-high focus:border-primary focus:bg-white text-[13px] text-gray-900 dark:text-white font-medium outline-none transition-all leading-relaxed"
                     placeholder="Orchestrate your response here..."
                   />
                </div>
              </div>
            </div>

            <div className="p-8 bg-gray-50/50 dark:bg-white/5 border-t border-gray-50 dark:border-white/10 flex justify-end gap-3">
              <button onClick={() => setIsReplyModalOpen(false)} className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors">Abort</button>
              <button
                 onClick={handleSendReply}
                 disabled={!replyMessage || isSending}
                 className="px-10 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                 {isSending ? (
                   <><RefreshCcw className="w-3 h-3 animate-spin" /> Sending...</>
                 ) : (
                   <>Transmit <Send className="w-3 h-3" /></>
                 )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
