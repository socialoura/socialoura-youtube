'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Language } from '@/i18n/config';
import PaymentModal from '@/components/PaymentModal';

type PricingTier = { followers: string; price: string; slug: string };

interface PageProps {
  params: { lang: string; slug: string };
}

function parseFollowersFromSlug(slug: string): number | null {
  const m = slug.match(/youtube-views-(\d+)/);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
}

export default function PackDetailPage({ params }: PageProps) {
  const lang = params.lang as Language;
  const router = useRouter();

  const followers = parseFollowersFromSlug(params.slug);

  const [email, setEmail] = useState('');
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState('');
  const [price, setPrice] = useState<number | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const t = useMemo(() => {
    if (lang === 'fr') {
      return {
        title: 'Pack de vues YouTube',
        subtitle: 'Colle le lien de ta vidéo YouTube, puis passe au paiement sécurisé.',
        back: 'Retour aux packs',
        email: 'Adresse e-mail',
        emailPlaceholder: 'votre@email.com',
        url: 'Lien de la vidéo YouTube',
        urlPlaceholder: 'https://www.youtube.com/watch?v=...',
        buy: 'Payer',
        viewsLabel: 'vues',
        invalidUrl: 'Veuillez entrer un lien YouTube valide.',
        missingEmail: 'Veuillez entrer un e-mail.',
        priceLabel: 'Prix',
      };
    }

    return {
      title: 'YouTube Views Pack',
      subtitle: 'Paste your YouTube video link, then proceed to secure checkout.',
      back: 'Back to packs',
      email: 'Email address',
      emailPlaceholder: 'your@email.com',
      url: 'YouTube video link',
      urlPlaceholder: 'https://www.youtube.com/watch?v=...',
      buy: 'Pay now',
      viewsLabel: 'views',
      invalidUrl: 'Please enter a valid YouTube URL.',
      missingEmail: 'Please enter an email.',
      priceLabel: 'Price',
    };
  }, [lang]);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await fetch('/api/admin/pricing');
        if (!res.ok) {
          setPrice(null);
          return;
        }
        const data = await res.json();
        const youtube = (data.youtube || data.instagram || []) as Array<{ followers: string; price: string }>;
        const tier = youtube
          .map((p) => ({ ...p, slug: `youtube-views-${p.followers}` } as PricingTier))
          .find((p) => p.slug === params.slug);

        if (!tier) {
          setPrice(null);
          return;
        }
        setPrice(Number(tier.price));
      } finally {
        setLoadingPrice(false);
      }
    };

    fetchPricing();
  }, [params.slug]);

  const isValidYoutubeUrl = (url: string) => {
    try {
      const u = new URL(url);
      return u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be');
    } catch {
      return false;
    }
  };

  const handlePay = () => {
    setError(null);

    if (!followers) {
      setError('Pack not available');
      return;
    }

    if (!email.trim()) {
      setError(t.missingEmail);
      return;
    }

    if (!youtubeVideoUrl.trim() || !isValidYoutubeUrl(youtubeVideoUrl.trim())) {
      setError(t.invalidUrl);
      return;
    }

    if (!price || Number.isNaN(price)) {
      setError('Pack not available');
      return;
    }

    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = async (paymentIntentIdParam: string) => {
    setIsPaymentModalOpen(false);

    try {
      await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: youtubeVideoUrl,
          email,
          platform: 'youtube',
          followers: followers || 0,
          amount: price,
          paymentId: paymentIntentIdParam,
          youtubeVideoUrl,
        }),
      });
    } catch {
      // keep silent, payment already succeeded
    }

    router.push(`/${lang}/packs?success=1&payment_id=${encodeURIComponent(paymentIntentIdParam)}`);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Link
            href={`/${lang}/packs`}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← {t.back}
          </Link>

          <div className="mt-6 rounded-2xl bg-gray-800/40 border border-gray-700/50 p-6">
            <h1 className="text-3xl sm:text-4xl font-black text-white">{t.title}</h1>
            <p className="text-gray-400 mt-2">{t.subtitle}</p>

            {!followers ? (
              <div className="mt-6 text-gray-400">Pack not found.</div>
            ) : (
              <>

                <div className="mt-6 flex items-baseline gap-2">
                  <div className="text-2xl font-black text-white">+{followers.toLocaleString()}</div>
                  <div className="text-gray-400">{t.viewsLabel}</div>
                </div>

            <div className="mt-4">
              <div className="text-sm text-gray-400">{t.priceLabel}</div>
              <div className="text-2xl font-black text-white">
                {loadingPrice ? '…' : price ? `${price.toFixed(2)} €` : '—'}
              </div>
            </div>

            <div className="mt-8 grid gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">{t.url}</label>
                <input
                  value={youtubeVideoUrl}
                  onChange={(e) => setYoutubeVideoUrl(e.target.value)}
                  placeholder={t.urlPlaceholder}
                  className="w-full px-4 py-3 rounded-xl bg-gray-900/60 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">{t.email}</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  className="w-full px-4 py-3 rounded-xl bg-gray-900/60 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              {error && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 text-sm">
                  {error}
                </div>
              )}

                  <button
                  onClick={handlePay}
                  className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold py-3 transition-colors"
                >
                  {t.buy}
                </button>
              </div>
              </>
            )}
          </div>
        </div>
      </main>

      {price !== null && followers && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          amount={Math.round(price * 100)}
          currency={lang === 'fr' ? 'eur' : 'usd'}
          onClose={() => setIsPaymentModalOpen(false)}
          onSuccess={handlePaymentSuccess}
          productName={`+${followers} YouTube views`}
          language={lang}
          email={email}
          orderDetails={{
            platform: 'youtube',
            followers,
            username: youtubeVideoUrl,
          }}
        />
      )}
    </div>
  );
}
