'use client';

import { useState } from 'react';
import { Language } from '@/i18n/config';
import { useRouter } from 'next/navigation';
import { Plus, Minus, BarChart3, Calendar, MessageCircle, HeadphonesIcon, Play, CheckCircle2, ArrowRight, Star, ShieldCheck, Zap, X } from 'lucide-react';
import ChatWidget from '@/components/ChatWidget';
import ReviewsSection from '@/components/ReviewsSection';
import TrustedBrands from '@/components/TrustedBrands';
import GoalSelectionModal from '@/components/GoalSelectionModal';
import PaymentModal from '@/components/PaymentModal';

interface PageProps {
  params: { lang: string };
}

export default function HomePage({ params }: PageProps) {
  const lang = params.lang as Language;
  const router = useRouter();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<{ followers: number; price: number } | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<string>('');
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const normalizeYoutubeUrlInput = (value: string) => {
    const trimmed = value.trimStart();
    if (trimmed.startsWith('https://')) {
      return `http://${trimmed.slice('https://'.length)}`;
    }
    return value;
  };

  const handleContinue = () => {
    if (youtubeVideoUrl.trim().length > 0) {
      setIsGoalModalOpen(true);
    }
  };

  const getCurrency = () => (lang === 'fr' ? 'eur' : 'usd');

  const handleGoalSelected = (goal: { followers: number; price: number }, emailParam: string) => {
    setSelectedGoal(goal);
    setSelectedEmail(emailParam);
    setIsGoalModalOpen(false);
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
          email: selectedEmail,
          platform: 'youtube',
          followers: selectedGoal?.followers || 0,
          amount: selectedGoal?.price || 0,
          paymentId: paymentIntentIdParam,
          youtubeVideoUrl,
        }),
      });
    } catch {
      // keep silent, payment already succeeded
    }

    router.push(`/${lang}?success=1&payment_id=${encodeURIComponent(paymentIntentIdParam)}`);
  };
  
  const content = {
    en: {
      hero: {
        headline: 'YouTube Video Visibility',
        subheadline: 'Choose an exposure package, paste your video link, and run a compliant visibility campaign with secure checkout.',
        cta: 'Start visibility campaign',
      },
      services: {
        title: 'Our Services',
        subtitle: 'A simple workflow designed for YouTube video discovery',
        items: [
          {
            title: 'Visibility Packages',
            description: 'Select an exposure level aligned with your goals. We focus on reach and discovery, not artificial engagement.',
            icon: BarChart3,
          },
          {
            title: 'Fast Delivery',
            description: 'Campaigns start quickly after payment and are delivered progressively for a natural-looking distribution.',
            icon: Calendar,
          },
          {
            title: 'Secure Payments',
            description: 'Checkout securely with Stripe. No password needed, only your video link.',
            icon: MessageCircle,
          },
          {
            title: '24/7 Support',
            description: 'Our dedicated support team is always ready to help you maximize your results.',
            icon: HeadphonesIcon,
          },
        ],
      },
      faq: {
        title: 'Frequently Asked Questions',
        subtitle: 'Everything you need to know about our visibility packages',
        items: [
          {
            question: 'Is your service safe for my account?',
            answer: 'We use a compliant, marketing-first approach focused on visibility and discovery. You never share your password with us.',
          },
          {
            question: 'How quickly will I see results?',
            answer: 'Most campaigns start quickly after checkout. Results depend on content quality, niche relevance, and consistency.',
          },
          {
            question: 'Can I cancel my subscription anytime?',
            answer: 'Absolutely! You can cancel your subscription at any time with no questions asked. No hidden fees or commitments.',
          },
          {
            question: 'Do you offer a free trial?',
            answer: 'Yes, we offer a 7-day free trial on all our plans so you can test our services risk-free.',
          },
          {
            question: 'What makes you different from competitors?',
            answer: 'We focus on authentic audience development with strategic targeting, provide superior customer support, and offer transparent pricing with no hidden costs.',
          },
          {
            question: 'Which platforms do you support?',
            answer: 'We currently focus on YouTube video visibility packages.',
          },
        ],
      },
    },
    fr: {
      hero: {
        headline: 'Visibilité de votre vidéo YouTube',
        subheadline: 'Choisissez un forfait d\'exposition, collez le lien de votre vidéo et lancez une campagne de visibilité conforme avec paiement sécurisé.',
        cta: 'Lancer la campagne',
      },
      services: {
        title: 'Nos Services',
        subtitle: 'Un parcours simple pensé pour la découverte sur YouTube',
        items: [
          {
            title: 'Forfaits de visibilité',
            description: 'Choisissez un niveau d\'exposition selon vos objectifs. Nous privilégions la portée et la découverte, pas l\'engagement artificiel.',
            icon: BarChart3,
          },
          {
            title: 'Livraison rapide',
            description: 'Les campagnes démarrent rapidement après paiement et sont livrées progressivement pour une diffusion naturelle.',
            icon: Calendar,
          },
          {
            title: 'Paiement sécurisé',
            description: 'Paiement sécurisé via Stripe. Aucun mot de passe requis, seulement le lien de la vidéo.',
            icon: MessageCircle,
          },
          {
            title: 'Support 24/7',
            description: 'Notre équipe d\'assistance est disponible pour t\'aider à maximiser tes résultats.',
            icon: HeadphonesIcon,
          },
        ],
      },
      faq: {
        title: 'Questions Fréquemment Posées',
        subtitle: 'Tout ce que vous devez savoir sur nos forfaits de visibilité',
        items: [
          {
            question: 'Votre service est-il sûr pour mon compte ?',
            answer: 'Notre approche est marketing-first et axée sur la visibilité et la découverte. Vous ne partagez jamais votre mot de passe.',
          },
          {
            question: 'À quelle vitesse verrai-je des résultats ?',
            answer: 'La plupart des campagnes démarrent rapidement après paiement. Les résultats dépendent du contenu, de la niche et de la régularité.',
          },
          {
            question: 'Puis-je annuler mon abonnement à tout moment ?',
            answer: 'Absolument ! Vous pouvez annuler votre abonnement à tout moment sans poser de questions. Aucun frais caché ni engagement.',
          },
          {
            question: 'Offrez-vous un essai gratuit ?',
            answer: 'Oui, nous offrons un essai gratuit de 7 jours sur tous nos forfaits afin que vous puissiez tester nos services sans risque.',
          },
          {
            question: 'Qu\'est-ce qui vous différencie de la concurrence ?',
            answer: 'Nous nous concentrons sur le développement d\'audience authentique avec un ciblage stratégique, offrons un support client supérieur et proposons des prix transparents sans frais cachés.',
          },
          {
            question: 'Quelles plateformes supportez-vous ?',
            answer: 'Nous proposons actuellement des forfaits de visibilité pour les vidéos YouTube.',
          },
        ],
      },
    },
  };

  const t = content[lang];
  const serviceItems = t.services.items;

  const scrollToHero = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_10%_20%,rgba(239,68,68,0.10),transparent_55%),radial-gradient(900px_circle_at_90%_35%,rgba(239,68,68,0.06),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(2,6,23,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(2,6,23,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30 dark:opacity-15" />
        <div className="absolute inset-0 [mask-image:radial-gradient(60%_55%_at_50%_35%,black,transparent)] bg-gradient-to-b from-white/0 via-white/40 to-white dark:from-gray-950/0 dark:via-gray-950/70 dark:to-gray-950" />

        <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-16 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs text-gray-600 shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  {lang === 'fr' ? 'Pour YouTube' : 'For YouTube'}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-500 dark:text-gray-400">{lang === 'fr' ? 'Visibilité vidéo' : 'Video visibility'}</span>
              </div>

              <h1 className="mt-6 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-white">
                {t.hero.headline}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-gray-600 max-w-xl dark:text-gray-300">
                {t.hero.subheadline}
              </p>

              <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex-1">
                    <div className="relative">
                      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                        <Play className="h-5 w-5" />
                      </div>
                      <input
                        type="text"
                        value={youtubeVideoUrl}
                        onChange={(e) => setYoutubeVideoUrl(normalizeYoutubeUrlInput(e.target.value))}
                        placeholder={lang === 'fr' ? 'Lien de votre vidéo YouTube' : 'Your YouTube video link'}
                        className="w-full rounded-xl bg-transparent py-4 pl-12 pr-4 text-base text-gray-900 placeholder-gray-400 outline-none dark:text-white dark:placeholder-gray-500"
                        onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleContinue}
                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 px-7 py-4 text-base font-black text-white shadow-sm transition-all"
                  >
                    <span>{t.hero.cta}</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="inline-flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>4.9/5</span>
                </div>
                <div className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  <span>{lang === 'fr' ? 'Paiement sécurisé' : 'Secure payment'}</span>
                </div>
                <div className="inline-flex items-center gap-2">
                  <Zap className="h-4 w-4 text-gray-900 dark:text-gray-200" />
                  <span>{lang === 'fr' ? 'Mise en place en quelques minutes' : 'Setup in minutes'}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{lang === 'fr' ? 'Aperçu' : 'Preview'}</div>
                    <div className="mt-1 text-lg font-black text-gray-900 dark:text-white">{lang === 'fr' ? 'Votre campagne' : 'Your campaign'}</div>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-red-50 text-red-700 border border-red-200 px-3 py-1 text-xs font-bold dark:bg-red-950/40 dark:text-red-200 dark:border-red-900">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    YouTube
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-28 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="h-7 w-7 text-red-600" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400">{lang === 'fr' ? 'Lien vidéo' : 'Video link'}</div>
                      <div className="mt-1 truncate text-sm font-semibold text-gray-900 dark:text-white">
                        {youtubeVideoUrl.trim().length > 0 ? youtubeVideoUrl : (lang === 'fr' ? 'Collez un lien pour générer l\'aperçu' : 'Paste a link to generate a preview')}
                      </div>
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        {lang === 'fr' ? 'Choisissez ensuite un forfait et validez le paiement.' : 'Then choose a package and checkout.'}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
                      <div className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">{lang === 'fr' ? 'Démarrage' : 'Kickoff'}</div>
                      <div className="mt-2 text-sm font-black text-gray-900 dark:text-white">{lang === 'fr' ? 'Rapide' : 'Fast'}</div>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
                      <div className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">{lang === 'fr' ? 'Rythme' : 'Pacing'}</div>
                      <div className="mt-2 text-sm font-black text-gray-900 dark:text-white">{lang === 'fr' ? 'Progressif' : 'Progressive'}</div>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
                      <div className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">{lang === 'fr' ? 'Paiement' : 'Payment'}</div>
                      <div className="mt-2 text-sm font-black text-gray-900 dark:text-white">Stripe</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-black text-gray-900 dark:text-white">60k+</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{lang === 'fr' ? 'campagnes' : 'campaigns'}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-gray-900 dark:text-white">4.9/5</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{lang === 'fr' ? 'avis' : 'rating'}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-gray-900 dark:text-white">24/7</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{lang === 'fr' ? 'support' : 'support'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-20 sm:py-28 bg-white relative overflow-hidden dark:bg-gray-950">
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_0%,rgba(239,68,68,0.08),transparent_55%)]" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl mb-4 dark:text-white">
              {lang === 'fr' ? 'Choisissez votre forfait' : 'Choose your package'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
              {lang === 'fr'
                ? 'Des options simples pour lancer une campagne de visibilité vidéo. Vous gardez le contrôle et la mise en place est rapide.'
                : 'Simple options to start a video visibility campaign. You stay in control and setup is fast.'}
            </p>
            <div className="w-20 h-1 bg-red-600 mx-auto rounded-full mt-6" />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="text-sm font-black text-gray-900 dark:text-white">{lang === 'fr' ? 'Starter' : 'Starter'}</div>
                  <div className="mt-2 text-4xl font-black text-gray-900 dark:text-white">
                    {lang === 'fr' ? '9,90€' : '$9.90'}
                  </div>
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {lang === 'fr' ? 'Pour tester et valider le flow.' : 'For testing and validating the flow.'}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center dark:bg-gray-900 dark:border-gray-800">
                  <Zap className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-200">{lang === 'fr' ? 'Démarrage rapide' : 'Fast start'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-200">{lang === 'fr' ? 'Exposition progressive' : 'Progressive exposure'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-200">{lang === 'fr' ? 'Paiement sécurisé Stripe' : 'Secure Stripe checkout'}</span>
                </div>
              </div>

              <button
                onClick={scrollToHero}
                className="mt-8 w-full rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-black py-3 px-5 transition-colors"
              >
                {lang === 'fr' ? 'Commencer' : 'Get started'}
              </button>
              <div className="mt-3 text-xs text-gray-500 text-center dark:text-gray-400">
                {lang === 'fr' ? 'Collez le lien de votre vidéo dans le champ en haut.' : 'Paste your video link in the field above.'}
              </div>
            </div>

            <div className="rounded-3xl border-2 border-red-200 bg-white p-8 shadow-sm relative dark:bg-gray-950 dark:border-red-900">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <div className="rounded-full bg-red-600 text-white text-[10px] font-black px-3 py-1 uppercase tracking-wider">
                  {lang === 'fr' ? 'Populaire' : 'Most popular'}
                </div>
              </div>

              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="text-sm font-black text-gray-900 dark:text-white">{lang === 'fr' ? 'Plus' : 'Plus'}</div>
                  <div className="mt-2 text-4xl font-black text-gray-900 dark:text-white">
                    {lang === 'fr' ? '29,90€' : '$29.90'}
                  </div>
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {lang === 'fr' ? 'Un bon équilibre pour booster la découverte.' : 'A balanced option to boost discovery.'}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center dark:bg-red-950/40 dark:border-red-900">
                  <BarChart3 className="w-6 h-6 text-red-700" />
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-200">{lang === 'fr' ? 'Exposition renforcée' : 'Enhanced exposure'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-200">{lang === 'fr' ? 'Pacing progressif' : 'Progressive pacing'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-200">{lang === 'fr' ? 'Support prioritaire' : 'Priority support'}</span>
                </div>
              </div>

              <button
                onClick={scrollToHero}
                className="mt-8 w-full rounded-xl bg-red-600 hover:bg-red-700 text-white font-black py-3 px-5 transition-colors shadow-sm"
              >
                {lang === 'fr' ? 'Choisir Plus' : 'Choose Plus'}
              </button>
              <div className="mt-3 text-xs text-gray-500 text-center dark:text-gray-400">
                {lang === 'fr' ? 'Le prix final dépend du forfait choisi dans l’étape suivante.' : 'Final price depends on the package selected in the next step.'}
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="text-sm font-black text-gray-900 dark:text-white">{lang === 'fr' ? 'Pro' : 'Pro'}</div>
                  <div className="mt-2 text-4xl font-black text-gray-900 dark:text-white">
                    {lang === 'fr' ? '59,90€' : '$59.90'}
                  </div>
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {lang === 'fr' ? 'Pour les lancements et contenus importants.' : 'For launches and important content.'}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center dark:bg-gray-900 dark:border-gray-800">
                  <ShieldCheck className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-200">{lang === 'fr' ? 'Volume d’exposition élevé' : 'Higher exposure volume'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-200">{lang === 'fr' ? 'Suivi et accompagnement' : 'Tracking and guidance'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-200">{lang === 'fr' ? 'Paiement sécurisé Stripe' : 'Secure Stripe checkout'}</span>
                </div>
              </div>

              <button
                onClick={scrollToHero}
                className="mt-8 w-full rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-black py-3 px-5 transition-colors dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-white"
              >
                {lang === 'fr' ? 'Contacter' : 'Contact'}
              </button>
              <div className="mt-3 text-xs text-gray-500 text-center dark:text-gray-400">
                {lang === 'fr' ? 'Idéal pour une stratégie plus complète.' : 'Ideal for a more complete strategy.'}
              </div>
            </div>
          </div>

          <div className="mt-12 rounded-3xl border border-gray-200 bg-gray-50 p-8 dark:border-gray-800 dark:bg-gray-900">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {(serviceItems || []).slice(0, 3).map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div key={`${item.title}-${idx}`} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center dark:bg-gray-950 dark:border-gray-800">
                      <IconComponent className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-gray-900 dark:text-white">{item.title}</div>
                      <div className="mt-1 text-sm text-gray-600 leading-relaxed dark:text-gray-300">{item.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-gray-50 relative overflow-hidden dark:bg-gray-950">
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_80%_20%,rgba(239,68,68,0.06),transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl mb-4 dark:text-white">
              {lang === 'fr' ? 'Comparaison' : 'Comparison'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
              {lang === 'fr'
                ? 'Une approche orientée visibilité et découverte, avec un setup simple et un paiement sécurisé.'
                : 'A visibility and discovery-oriented approach, with simple setup and secure checkout.'}
            </p>
            <div className="w-20 h-1 bg-red-600 mx-auto rounded-full mt-6" />
          </div>

          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <div className="grid grid-cols-4 gap-0 border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
              <div className="p-5 text-sm font-bold text-gray-600 dark:text-gray-300">{lang === 'fr' ? 'Critère' : 'Criteria'}</div>
              <div className="p-5 text-sm font-black text-gray-900 dark:text-white">ViewPlex</div>
              <div className="p-5 text-sm font-bold text-gray-600 dark:text-gray-300">{lang === 'fr' ? 'Sponsoring' : 'Sponsorships'}</div>
              <div className="p-5 text-sm font-bold text-gray-600 dark:text-gray-300">{lang === 'fr' ? 'Options aléatoires' : 'Random options'}</div>
            </div>

            {[
              {
                label: lang === 'fr' ? 'Mise en place' : 'Setup',
                a: lang === 'fr' ? 'En quelques minutes' : 'In minutes',
                b: lang === 'fr' ? 'Variable' : 'Varies',
                c: lang === 'fr' ? 'Souvent longue' : 'Often slow',
                okA: true,
                okB: false,
                okC: false,
              },
              {
                label: lang === 'fr' ? 'Paiement sécurisé' : 'Secure payment',
                a: 'Stripe',
                b: lang === 'fr' ? 'Pas toujours' : 'Not always',
                c: lang === 'fr' ? 'Pas clair' : 'Unclear',
                okA: true,
                okB: false,
                okC: false,
              },
              {
                label: lang === 'fr' ? 'Accès au compte requis' : 'Account access required',
                a: lang === 'fr' ? 'Non' : 'No',
                b: lang === 'fr' ? 'Parfois' : 'Sometimes',
                c: lang === 'fr' ? 'Parfois' : 'Sometimes',
                okA: true,
                okB: false,
                okC: false,
              },
              {
                label: lang === 'fr' ? 'Rythme progressif' : 'Progressive pacing',
                a: lang === 'fr' ? 'Oui' : 'Yes',
                b: lang === 'fr' ? 'Variable' : 'Varies',
                c: lang === 'fr' ? 'Non' : 'No',
                okA: true,
                okB: false,
                okC: false,
              },
              {
                label: lang === 'fr' ? 'Support' : 'Support',
                a: '24/7',
                b: lang === 'fr' ? 'Selon le partenaire' : 'Partner-dependent',
                c: lang === 'fr' ? 'Limité' : 'Limited',
                okA: true,
                okB: false,
                okC: false,
              },
            ].map((row, idx) => (
              <div key={idx} className="grid grid-cols-4 gap-0 border-b border-gray-100 last:border-b-0 dark:border-gray-800">
                <div className="p-5 text-sm font-semibold text-gray-900 dark:text-white">{row.label}</div>
                <div className="p-5 text-sm text-gray-700 flex items-center justify-between gap-3">
                  <span className="truncate">{row.a}</span>
                  {row.okA ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <X className="h-5 w-5 text-gray-300" />}
                </div>
                <div className="p-5 text-sm text-gray-700 flex items-center justify-between gap-3">
                  <span className="truncate">{row.b}</span>
                  {row.okB ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <X className="h-5 w-5 text-gray-300" />}
                </div>
                <div className="p-5 text-sm text-gray-700 flex items-center justify-between gap-3">
                  <span className="truncate">{row.c}</span>
                  {row.okC ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <X className="h-5 w-5 text-gray-300" />}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <button
              onClick={scrollToHero}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 px-7 py-4 text-base font-black text-white shadow-sm transition-all"
            >
              <span>{lang === 'fr' ? 'Lancer une campagne' : 'Start a campaign'}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 sm:py-28 bg-gray-50 relative overflow-hidden dark:bg-gray-950">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl" />
        
        <div className="relative mx-auto max-w-4xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl mb-4 dark:text-white">
              {t.faq.title}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t.faq.subtitle}
            </p>
            <div className="w-20 h-1 bg-red-600 mx-auto rounded-full mt-6" />
          </div>
          
          <dl className="space-y-4">
            {t.faq.items.map((item, index) => (
              <div
                key={index}
                className="rounded-3xl bg-white border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors shadow-sm dark:bg-gray-950 dark:border-gray-800 dark:hover:border-gray-700"
              >
                <dt>
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between text-left p-6 hover:bg-gray-50 transition-colors dark:hover:bg-gray-900"
                  >
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {item.question}
                    </span>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${openFaqIndex === index ? 'bg-red-600 rotate-180' : 'bg-gray-100'}`}>
                      {openFaqIndex === index ? (
                        <Minus className="h-4 w-4 text-white" />
                      ) : (
                        <Plus className="h-4 w-4 text-gray-700" />
                      )}
                    </div>
                  </button>
                </dt>
                {openFaqIndex === index && (
                  <dd className="px-6 pb-6 text-base leading-7 text-gray-600 dark:text-gray-300">
                    {item.answer}
                  </dd>
                )}
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-28 bg-white relative overflow-hidden dark:bg-gray-950">
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_10%_30%,rgba(239,68,68,0.06),transparent_55%)]" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl mb-4 dark:text-white">
              {lang === 'fr' ? 'Comment ça marche' : 'How it works'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
              {lang === 'fr'
                ? 'Un parcours clair en 3 étapes, pensé pour rester simple et conforme.'
                : 'A clear 3-step flow designed to stay simple and compliant.'}
            </p>
            <div className="w-20 h-1 bg-red-600 mx-auto rounded-full mt-6" />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 border border-red-200">
                  <Play className="h-6 w-6 text-red-700" />
                </div>
                <div>
                  <div className="text-sm font-black text-gray-900 dark:text-white">{lang === 'fr' ? '1) Vidéo' : '1) Video'}</div>
                  <div className="mt-2 text-sm text-gray-600 leading-relaxed dark:text-gray-300">
                    {lang === 'fr'
                      ? 'Vous collez le lien de votre vidéo. Aucune connexion, aucun mot de passe.'
                      : 'Paste your video link. No login, no password.'}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 border border-gray-200 dark:bg-gray-900 dark:border-gray-800">
                  <BarChart3 className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                </div>
                <div>
                  <div className="text-sm font-black text-gray-900 dark:text-white">{lang === 'fr' ? '2) Objectif' : '2) Goal'}</div>
                  <div className="mt-2 text-sm text-gray-600 leading-relaxed dark:text-gray-300">
                    {lang === 'fr'
                      ? 'Vous choisissez un niveau d\'exposition selon votre besoin (progressif).' 
                      : 'Choose an exposure level based on your needs (progressive pacing).'}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 border border-gray-200 dark:bg-gray-900 dark:border-gray-800">
                  <CheckCircle2 className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                </div>
                <div>
                  <div className="text-sm font-black text-gray-900 dark:text-white">{lang === 'fr' ? '3) Paiement' : '3) Checkout'}</div>
                  <div className="mt-2 text-sm text-gray-600 leading-relaxed dark:text-gray-300">
                    {lang === 'fr'
                      ? 'Paiement sécurisé Stripe. Vous recevez un suivi et une confirmation.'
                      : 'Secure Stripe checkout. You get tracking and confirmation.'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-3xl border border-gray-200 bg-gray-50 p-8 dark:border-gray-800 dark:bg-gray-900">
            <div className="text-base font-black text-gray-900 dark:text-white">{lang === 'fr' ? 'Transparence & conformité' : 'Transparency & compliance'}</div>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 max-w-3xl dark:text-gray-300">
              {lang === 'fr'
                ? 'Nous mettons l\'accent sur la visibilité et la découverte. Les résultats dépendent du contenu, de la niche et de la régularité. Nous ne promettons pas de métriques spécifiques.'
                : 'We focus on visibility and discovery. Results depend on content quality, niche relevance, and consistency. We do not promise specific metrics.'}
            </p>
          </div>
        </div>
      </section>

      {/* Trusted Brands */}
      <section className="py-16 sm:py-20 bg-gray-50 relative overflow-hidden dark:bg-gray-950">
        <div className="absolute inset-0 bg-[radial-gradient(800px_circle_at_50%_50%,rgba(239,68,68,0.06),transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white">
              {lang === 'fr' ? 'Ils nous font confiance' : 'Trusted by creators'}
            </h2>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
              {lang === 'fr' ? 'Marques et créateurs avec qui nous collaborons.' : 'Brands and creators we collaborate with.'}
            </p>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <TrustedBrands lang={lang} />
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 sm:py-20 bg-white relative overflow-hidden dark:bg-gray-950">
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_50%,rgba(239,68,68,0.06),transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white">
              {lang === 'fr' ? 'Avis' : 'Reviews'}
            </h2>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
              {lang === 'fr' ? 'Retours d\'expérience sur nos campagnes.' : 'Feedback on our campaigns.'}
            </p>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <ReviewsSection lang={lang} platform="all" />
          </div>
        </div>
      </section>

      {/* Chat Widget */}
      <ChatWidget lang={lang} />

      {/* Goal Selection Modal */}
      <GoalSelectionModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSelectGoal={handleGoalSelected}
        username={youtubeVideoUrl}
        platform="youtube"
        language={lang}
      />

      {/* Payment Modal */}
      {selectedGoal && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          amount={Math.round(selectedGoal.price * 100)}
          currency={getCurrency()}
          onClose={() => setIsPaymentModalOpen(false)}
          onSuccess={handlePaymentSuccess}
          productName={`YouTube visibility package (+${selectedGoal.followers})`}
          language={lang}
          email={selectedEmail}
          orderDetails={{
            platform: 'youtube',
            followers: selectedGoal.followers,
            username: youtubeVideoUrl,
          }}
        />
      )}
    </div>
  );
}
