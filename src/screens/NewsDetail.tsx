import type { NavProps } from '../App';
import { useTheme } from '../theme';
import { useLang } from '../lang';
import usePublishedNews from '../data/usePublishedNews';

const catColor: Record<string, string> = { Water: '#2D7A9E', Gas: '#8A5E3A', Energy: '#7A5EA0', General: '#5E7A3A' };

export default function NewsDetail({ goBack, params }: NavProps) {
  const { t } = useTheme();
  const { tr, isRTL } = useLang();
  const newsData = usePublishedNews();
  const id = params.newsId ?? 1;
  const item = newsData.find(n => n.id === id) ?? newsData[0];

  const catLabels: Record<string, string> = {
    Water: tr('news_cat_water'),
    Gas: tr('news_cat_gas'),
    Energy: tr('news_cat_energy'),
    General: tr('news_cat_general'),
    Golden: tr('news_cat_golden'),
  };

  const isGolden = (item as { golden?: boolean }).golden === true;
  const color = isGolden ? '#B8860B' : (catColor[item.category] || t.textMuted);
  const categoryLabel = catLabels[item.category] ?? item.category;

  return (
    <div style={{ background: t.bg, minHeight: '100%', paddingBottom: 32, transition: 'background 0.3s' }}>
      <div style={{ padding: '14px 24px 0' }}>
        <button onClick={goBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 16 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.primary} strokeWidth="2" strokeLinecap="round" style={{ transform: isRTL ? 'scaleX(-1)' : undefined }}><path d="M15 18l-6-6 6-6" /></svg>
          <span style={{ fontSize: 12, color: t.textMuted }}>{tr('news_breadcrumb')}</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color, textTransform: 'uppercase', background: `${color}18`, padding: '3px 10px', borderRadius: 12, border: `1px solid ${color}30` }}>
            {categoryLabel}
          </span>
          <span style={{ fontSize: 12, color: t.textFaint }}>{item.date}</span>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 700, color: t.text, lineHeight: 1.3, marginBottom: 16 }}>{item.title}</h1>
      </div>

      {item.image && (
        <div style={{ margin: '0 24px 18px', height: 190, borderRadius: 16, overflow: 'hidden', background: t.bgAlt }}>
          <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      <div style={{ padding: '0 24px' }}>
        <div style={{ background: t.card, border: `1.5px solid ${t.cardBorder}`, borderRadius: 16, padding: '18px', transition: 'background 0.3s' }}>
          {item.content.split('\n\n').map((para, i, arr) => (
            <p key={i} style={{ fontSize: 14, color: para.endsWith(':') ? t.text : t.textMuted, lineHeight: 1.7, fontWeight: para.endsWith(':') ? 600 : 400, marginBottom: i < arr.length - 1 ? 16 : 0 }}>
              {para}
            </p>
          ))}
        </div>

        <div style={{ marginTop: 14, background: t.paidBg, border: `1.5px solid ${t.paidDot}30`, borderRadius: 14, padding: '14px 16px', display: 'flex', gap: 12 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.paidText} strokeWidth="1.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p style={{ fontSize: 12, color: t.paidText, lineHeight: 1.5 }}>
            {tr('news_contact_footer')}
          </p>
        </div>
      </div>
    </div>
  );
}
