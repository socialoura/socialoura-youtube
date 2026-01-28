'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Language } from '@/i18n/config';

type PricingTier = { followers: string; price: string; slug?: string };

interface PageProps {
  params: { lang: string };
}

export default function PacksPage({ params }: PageProps) {
  const lang = params.lang as Language;
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(true);

  const t = useMemo(() => {
    if (lang === 'fr') {
      return {
        title: 'Packs de vues YouTube',
        subtitle: 'Choisis un pack et booste la visibilité de ta vidéo.',
        cta: 'Choisir ce pack',
        viewsLabel: 'vues',
        currency: '€',
        empty: 'Aucun pack disponible pour le moment.',
      };
    }

    return {
      title: 'YouTube Views Packs',
      subtitle: 'Pick a pack and boost your video visibility.',
      cta: 'Choose this pack',
      viewsLabel: 'views',
      currency: '€',
      empty: 'No packs available right now.',
    };
  }, [lang]);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await fetch('/api/admin/pricing');
        if (!res.ok) {
          setTiers([]);
          return;
        }
        const data = await res.json();
        const youtube = (data.youtube || data.instagram || []) as Array<{ followers: string; price: string }>;
        setTiers(
          youtube.map((p) => ({
            followers: p.followers,
            price: p.price,
            slug: `youtube-views-${p.followers}`,
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950">
      <main className="pt-20 pb-16">
        <section className="px-4 sm:px-6 lg:px-8 mb-10">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">{t.title}</h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">{t.subtitle}</p>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {loading ? (
              <div className="text-center text-gray-400">Loading...</div>
            ) : tiers.length === 0 ? (
              <div className="text-center text-gray-400">{t.empty}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {tiers.map((tier) => (
                  <div
                    key={tier.slug}
                    className="rounded-2xl bg-gray-800/40 border border-gray-700/50 p-6 hover:border-red-500/50 transition-colors"
                  >
                    <div className="text-3xl font-black text-white">+{Number(tier.followers).toLocaleString()}</div>
                    <div className="text-sm text-gray-400 mt-1">{t.viewsLabel}</div>

                    <div className="mt-6 flex items-end gap-2">
                      <div className="text-3xl font-black text-white">{tier.price}</div>
                      <div className="text-gray-400 pb-1">{t.currency}</div>
                    </div>

                    <Link
                      href={`/${lang}/packs/${tier.slug}`}
                      className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold py-3 transition-colors"
                    >
                      {t.cta}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
