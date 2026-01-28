import { redirect } from 'next/navigation';

interface PageProps {
  params: { lang: string; slug: string };
}

export default function PackDetailPage({ params }: PageProps) {
  redirect(`/${params.lang}`);
}
