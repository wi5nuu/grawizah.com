import { useState, useEffect } from 'react';
import { Inquiry, InquiryAnalytics } from '@/types/inquiry';
import { InquiryService } from '@/services/InquiryService';

const inquiryService = new InquiryService();

export const useInquiry = (supplierId?: string) => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [analytics, setAnalytics] = useState<InquiryAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (supplierId) {
      fetchInquiries();
      fetchAnalytics();
    }
  }, [supplierId]);

  const fetchInquiries = async () => {
    if (!supplierId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await inquiryService.getInquiriesBySupplier(supplierId);
      setInquiries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch inquiries');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    if (!supplierId) return;
    
    try {
      const data = await inquiryService.getAnalytics(supplierId);
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    }
  };

  const createInquiry = async (data: Partial<Inquiry>) => {
    try {
      setLoading(true);
      setError(null);
      const newInquiry = await inquiryService.createInquiry(data);
      setInquiries(prev => [newInquiry, ...prev]);
      return newInquiry;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create inquiry');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const respondToInquiry = async (inquiryId: string, message: string) => {
    try {
      setLoading(true);
      setError(null);
      const updated = await inquiryService.respondToInquiry(inquiryId, message);
      setInquiries(prev => 
        prev.map(inq => inq.id === inquiryId ? updated : inq)
      );
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to respond');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const markAsConverted = async (inquiryId: string) => {
    try {
      await inquiryService.markAsConverted(inquiryId);
      setInquiries(prev => 
        prev.map(inq => 
          inq.id === inquiryId ? { ...inq, converted_to_deal: true } : inq
        )
      );
      fetchAnalytics(); // Refresh analytics
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark as converted');
      throw err;
    }
  };

  return {
    inquiries,
    analytics,
    loading,
    error,
    createInquiry,
    respondToInquiry,
    markAsConverted,
    refresh: fetchInquiries
  };
};
