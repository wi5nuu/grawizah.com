import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

export default function InfoPage({ params }: { params: { slug: string } }) {
  const formattedTitle = params.slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="min-h-screen flex flex-col bg-surface dark:bg-[#050505] text-on-surface dark:text-white font-body selection:bg-primary/30">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24 relative overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/10 dark:bg-primary/5 blur-[120px] mix-blend-screen" />
        </div>

        <div className="max-w-[800px] mx-auto px-8 relative z-10 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
            {formattedTitle}
          </h1>
          
          <div className="bg-white/40 dark:bg-[#151520]/80 backdrop-blur-lg rounded-[2rem] border border-white/40 dark:border-white/10 p-8 md:p-12 shadow-xl dark:shadow-[0_20px_40px_rgba(83,0,183,0.05)] text-gray-700 dark:text-gray-300 space-y-6 text-lg leading-relaxed">
            <p>
              Welcome to the <strong>{formattedTitle}</strong> page. This section of the Grawizah platform provides essential information regarding our services, policies, and operations.
            </p>
            <p>
              We are currently in the process of finalizing our public documentation for this section. The complete details for {formattedTitle} will be published here shortly.
            </p>
            <div className="pt-8 border-t border-gray-200 dark:border-white/10 mt-8">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                If you require immediate assistance regarding {formattedTitle}, please reach out to our dedicated support team via the Contact page or email us directly at support@grawizah.com.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
