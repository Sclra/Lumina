import type { NavProps } from '../App';
import { useTheme } from '../theme';
import { useLang } from '../lang';
import { newsData } from '../data/newsData';

const catColor: Record<string, string> = {
  Water: '#2D7A9E', Gas: '#8A5E3A', Energy: '#7A5EA0', General: '#5E7A3A', Golden: '#B8860B',
};

const GOLDEN_GRADIENT = 'linear-gradient(135deg, #B8860B 0%, #DAA520 50%, #B8860B 100%)';

// Latest news = all items sorted by id desc, first 3
const latestNews = [...newsData].sort((a, b) => b.id - a.id).slice(0, 3);

export default function Home({ navigate }: NavProps) {
  const { t } = useTheme();
  const { tr } = useLang();
  const s = (style: object) => ({ ...style, transition: 'background 0.3s, border-color 0.3s, color 0.3s' });

  return (
    <div style={{ background: t.bg, minHeight: '100%', paddingBottom: 16 }}>
      {/* Header */}
      <div style={{ padding: '16px 24px 20px', background: t.bg }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: t.primary, textTransform: 'uppercase', marginBottom: 4 }}>{tr('app_name_upper')}</p>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: t.text, lineHeight: 1.15, marginBottom: 8 }}>{tr('home_hello')}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: t.primary, background: t.primaryPale, padding: '3px 10px', borderRadius: 20 }}>{tr('home_unit')}</span>
              <button style={{ fontSize: 12, color: t.primary, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>{tr('btn_view_details')}</button>
            </div>
          </div>
          <button style={{ background: t.card, border: `1.5px solid ${t.cardBorder}`, borderRadius: 12, padding: 10, cursor: 'pointer', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.text} strokeWidth="1.5" strokeLinecap="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              <circle cx="18" cy="5" r="3" fill="#C94A2E" stroke={t.bg} strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Amenity Status */}
      <div style={{ padding: '0 24px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: t.textFaint, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{tr('home_amenity_status')}</p>
          <button onClick={() => navigate('reservations')} style={{ fontSize: 12, color: t.primary, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>{tr('btn_view_details')}</button>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { name: tr('home_pool'),    status: tr('word_booked'), statusColor: t.primary, statusBg: t.primaryPale },
            { name: tr('home_rooftop'), status: tr('word_open'),   statusColor: '#5E7A3A', statusBg: '#EEF5E8' },
          ].map((a) => (
            <div key={a.name} style={s({ display: 'flex', alignItems: 'center', gap: 6, background: t.card, border: `1.5px solid ${t.cardBorder}`, borderRadius: 20, padding: '7px 14px' })}>
              <span style={{ fontSize: 12, fontWeight: 500, color: t.text }}>{a.name}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: a.statusColor, background: a.statusBg, padding: '2px 7px', borderRadius: 10, letterSpacing: '0.05em' }}>{a.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Utilities Overview */}
      <div style={{ padding: '0 24px 18px' }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: t.textFaint, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>{tr('home_utilities')}</p>
        {[
          { icon: 'water', label: tr('home_water_label'), sub: tr('home_water_sub'), status: 'PAID', amount: '$42.5', due: 'Oct 15, 2026', iconBg: '#E8F2FA', iconStroke: '#2D7A9E' },
          { icon: 'energy', label: tr('home_energy_label'), sub: tr('home_energy_sub'), status: 'DUE', amount: '$118.9', due: 'Oct 15, 2026', iconBg: '#F5EEF8', iconStroke: '#7A5EA0' },
        ].map((u) => {
          const isPaid = u.status === 'PAID';
          return (
            <div key={u.label} onClick={() => navigate('payments')}
              style={s({ background: t.card, border: `1.5px solid ${t.cardBorder}`, borderRadius: 16, padding: '16px', marginBottom: 10, cursor: 'pointer' })}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: u.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {u.icon === 'water'
                      ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={u.iconStroke} strokeWidth="1.5" strokeLinecap="round"><path d="M12 2C6 9 4 13 4 16a8 8 0 0 0 16 0c0-3-2-7-8-14z" /></svg>
                      : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={u.iconStroke} strokeWidth="1.5" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 1 }}>{u.label}</p>
                    <p style={{ fontSize: 11, color: t.textFaint }}>{u.sub}</p>
                  </div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, letterSpacing: '0.05em', background: isPaid ? t.paidBg : t.dueBg, color: isPaid ? t.paidText : t.dueText }}>
                  {isPaid ? tr('word_paid') : tr('word_due')}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: 9, fontWeight: 700, color: t.textFaint, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{tr('home_due_date')}</p>
                  <p style={{ fontSize: 12, color: t.textMuted }}>{u.due}</p>
                </div>
                <p style={{ fontSize: 26, fontWeight: 700, color: t.text, lineHeight: 1 }}>{u.amount}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Latest News — includes Golden items with their badge */}
      <div style={{ padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: t.textFaint, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{tr('home_latest_news')}</p>
          <button onClick={() => navigate('news')} style={{ fontSize: 12, color: t.primary, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>{tr('btn_view_all')}</button>
        </div>
        {latestNews.map((item) => {
          const isGolden = item.golden;
          const color = isGolden ? '#B8860B' : (catColor[item.category] || t.textMuted);
          return (
            <div key={item.id} onClick={() => navigate('news-detail', { newsId: item.id })}
              style={s({
                background: t.card,
                border: isGolden ? `1.5px solid #DAA52040` : `1.5px solid ${t.cardBorder}`,
                borderLeft: isGolden ? `4px solid #DAA520` : item.featured ? `4px solid ${t.paidDot}` : `1.5px solid ${t.cardBorder}`,
                borderRadius: 14, padding: '13px 14px', marginBottom: 10, cursor: 'pointer',
              })}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                {isGolden ? (
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#B8860B', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 3 }}>
                    ★ {tr('news_cat_golden').toUpperCase()}
                  </span>
                ) : (
                  <span style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{item.category}</span>
                )}
                <span style={{ fontSize: 10, color: t.textFaint }}>•</span>
                <span style={{ fontSize: 10, color: t.textFaint }}>{item.date}</span>
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, color: t.text, lineHeight: 1.4 }}>{item.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
