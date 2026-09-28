import { newsData, type NewsItem } from './newsData';
import { useManagerContext } from '../managerStore';
import { useLang } from '../lang';
import { sampleNewsFa } from './newsDataFa';

export default function usePublishedNews(): NewsItem[] {
  const { newsSubmissions, announcements } = useManagerContext();
  const { lang } = useLang();
  const sampleItems = lang === 'fa'
    ? newsData.map(item => ({ ...item, ...sampleNewsFa[item.id] }))
    : newsData;
  const approvedItems: NewsItem[] = newsSubmissions
    .filter(s => s.status === 'approved')
    .map(s => ({
      id: 10000 + s.id,
      category: s.category,
      title: s.title,
      date: s.publishedAt
        ? new Date(s.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : s.submittedAt,
      publishedAt: s.publishedAt,
      desc: s.description,
      image: null,
      featured: false,
      golden: s.golden,
      read: false,
      content: s.description,
    }));

  const managerItems: NewsItem[] = announcements
    .filter(a => a.published)
    .map(a => ({
      id: 1000000 + a.newsId,
      category: a.category,
      title: a.title,
      date: a.date,
      publishedAt: a.publishedAt,
      desc: a.body,
      image: null,
      featured: false,
      golden: a.golden,
      read: false,
      content: a.body,
    }));

  return [...sampleItems, ...approvedItems, ...managerItems];
}
