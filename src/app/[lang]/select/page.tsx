import { redirect } from 'next/navigation';

interface PageProps {
  params: { lang: string };
}

export default function SelectPlatformPage({ params }: PageProps) {
  const lang = params.lang;
  redirect(`/${lang}`);
}
