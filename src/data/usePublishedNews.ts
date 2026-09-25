import { newsData, type NewsItem } from './newsData';
import { useManagerContext } from '../managerStore';

export default function usePublishedNews(): NewsItem[] {
  const { newsSubmissions } = useManagerContext();
  const approvedItems: NewsItem[] = newsSubmissions
    .filter(s => s.status === 'approved')
    .map(s => ({
      id: 10000 + s.id,
      category: s.category,
      title: s.title,
      date: s.submittedAt,
      desc: s.description,
      image: null,
      featured: false,
      golden: s.golden,
      read: false,
      content: s.description,
    }));

  return [...newsData, ...approvedItems];

}
