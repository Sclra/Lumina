import { useState } from 'react';
import type { NavProps } from '../App';
import { useTheme } from '../theme';
import { useLang } from '../lang';
import { newsData, newsDateTimestamp, type NewsCategory, type NewsItem } from '../data/newsData';
import { useManagerContext } from '../managerStore';

const catColor: Record<string, string> = {
  Water: '#2D7A9E', Gas: '#8A5E3A', Energy: '#7A5EA0', General: '#5E7A3A',
  Golden: '#B8860B',
};
const catBgLight: Record<string, string> = {
  Water: '#E8F2FA', Gas: '#F5EDE0', Energy: '#F3EEF8', General: '#EEF5E8',
  Golden: '#FDF6E3',
};
const catBgDark: Record<string, string> = {
  Water: '#0A1E2A', Gas: '#1E160A', Energy: '#1A102A', General: '#0A1E10',
  Golden: '#1A1400',
};

const GOLDEN_GRADIENT = 'linear-gradient(135deg, #B8860B 0%, #DAA520 50%, #B8860B 100%)';

export default function News({ navigate }: NavProps) {
  const { t, darkMode } = useTheme();
  const { tr } = useLang();
  const { newsSubmissions } = useManagerContext();
  const [activeCategory, setActiveCategory] = useState<NewsCategory>('All');

  const CATEGORIES: { key: NewsCategory; label: string }[] = [
    { key: 'All',     label: tr('news_cat_all') },
    { key: 'Golden',  label: tr('news_cat_golden') },
    { key: 'Gas',     label: tr('news_cat_gas') },
    { key: 'Water',   label: tr('news_cat_water') },
    { key: 'Energy',  label: tr('news_cat_energy') },
    { key: 'General', label: tr('news_cat_general') },
  ];

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

  const allNews = [...newsData, ...approvedItems];

  const categoryItems = activeCategory === 'All'
    ? allNews
    : activeCategory === 'Golden'
      ? allNews.filter(n => n.golden)
      : allNews.filter(n => n.category === activeCategory);

  const filtered = [...categoryItems].sort((a, b) =>
    newsDateTimestamp(b.date) - newsDateTimestamp(a.date) || b.id - a.id
  );

  return (
    <div style={{ background: t.bg, minHeight: '100%', paddingBottom: 80, transition: 'background 0.3s', position: 'relative' }}>
      <div style={{ padding: '16px 24px 14px' }}>
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: t.primary, textTransform: 'uppercase', marginBottom: 4 }}>{tr('app_name_upper')}</p>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: t.text, marginBottom: 2 }}>{tr('news_title')}</h1>
        <p style={{ fontSize: 13, color: t.textFaint }}>{tr('news_subtitle')}</p>
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 6, padding: '0 24px', marginBottom: 18, overflowX: 'auto' }} className="scrollbar-hide">
        {CATEGORIES.map(({ key, label }) => {
          const isActive = key === activeCategory;
          const isGolden = key === 'Golden';

          let bg: string, border: string, color: string;
          if (isGolden && isActive) {
            bg = GOLDEN_GRADIENT;
            border = 'transparent';
            color = '#FFFFFF';
          } else if (isGolden) {
            bg = darkMode ? '#1A1400' : '#FDF6E3';
            border = '#DAA520';
            color = '#B8860B';
          } else if (isActive) {
            bg = t.primary;
            border = t.primary;
            color = '#FFFFFF';
          } else {
            bg = t.card;
            border = t.cardBorder;
            color = t.textMuted;
          }

          return (
            <button key={key} onClick={() => setActiveCategory(key)}
              style={{ padding: '7px 16px', borderRadius: 20, flexShrink: 0, background: bg, border: `1.5px solid ${border}`, color, fontWeight: isActive ? 600 : 400, fontSize: 13, cursor: 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: 5 }}>
              {isGolden && <span style={{ fontSize: 12 }}>★</span>}
              {label}
            </button>
          );
        })}
      </div>

      {/* News cards */}
      <div style={{ padding: '0 24px' }}>
        {filtered.map((item) => {
          const isGoldenItem = item.golden;
          return (
            <div key={item.id} onClick={() => navigate('news-detail', { newsId: item.id })}
              style={{
                background: t.card,
                border: isGoldenItem ? `1.5px solid #DAA52060` : `1.5px solid ${t.cardBorder}`,
                borderLeft: isGoldenItem ? `4px solid #DAA520` : undefined,
                borderRadius: 18, overflow: 'hidden', marginBottom: 12, cursor: 'pointer',
                opacity: item.read ? 0.82 : 1, transition: 'background 0.3s',
              }}>
              {item.image && (
                <div style={{ height: 130, background: t.bgAlt, position: 'relative' }}>
                  <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {isGoldenItem && (
                    <div style={{ position: 'absolute', top: 10, right: 10, background: GOLDEN_GRADIENT, borderRadius: 20, padding: '3px 10px', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 10, color: '#FFF' }}>★</span>
                      <span style={{ fontSize: 9, fontWeight: 700, color: '#FFF', letterSpacing: '0.1em' }}>{tr('news_cat_golden').toUpperCase()}</span>
                    </div>
                  )}
                </div>
              )}
              <div style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6, flexWrap: 'wrap' }}>
                  {isGoldenItem ? (
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: '#B8860B', textTransform: 'uppercase', background: darkMode ? '#1A1400' : '#FDF6E3', padding: '2px 8px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 3 }}>
                      <span>★</span> {tr('news_cat_golden')}
                    </span>
                  ) : (
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: catColor[item.category], textTransform: 'uppercase', background: darkMode ? catBgDark[item.category] : catBgLight[item.category], padding: '2px 8px', borderRadius: 8 }}>
                      {tr(`news_cat_${item.category.toLowerCase()}` as any) || item.category}
                    </span>
                  )}
                  <span style={{ fontSize: 10, color: t.textFaint }}>•</span>
                  <span style={{ fontSize: 11, color: t.textFaint }}>{item.date}</span>
                  {item.featured && !isGoldenItem && (
                    <>
                      <span style={{ fontSize: 10, color: t.textFaint }}>•</span>
                      <span style={{ fontSize: 9, fontWeight: 700, color: '#8A5E3A', letterSpacing: '0.08em', background: darkMode ? '#1E160A' : '#F5EDE0', padding: '2px 7px', borderRadius: 10 }}>{tr('word_featured')}</span>
                    </>
                  )}
                  {!item.read && (
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: isGoldenItem ? '#DAA520' : t.primary, marginLeft: 'auto', flexShrink: 0 }} />
                  )}
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: t.text, lineHeight: 1.4, marginBottom: 5 }}>{item.title}</h3>
                <p style={{ fontSize: 12, color: t.textFaint, lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAB: Create News */}
      <button
        onClick={() => navigate('news-create')}
        style={{
          position: 'fixed',
          bottom: 88,
          right: 24,
          background: t.primary,
          color: '#fff',
          border: 'none',
          borderRadius: 28,
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          zIndex: 10,
        }}
      >
        <span style={{ fontSize: 20, lineHeight: 1 }}>+</span>
        <span>Create News</span>
      </button>
    </div>
  );
}
