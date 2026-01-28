import { redirect } from 'next/navigation';

interface PageProps {
  params: { lang: string };
}

export default function PacksPage({ params }: PageProps) {
  redirect(`/${params.lang}`);
}
