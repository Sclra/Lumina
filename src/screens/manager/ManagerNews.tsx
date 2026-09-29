import { useState } from 'react';
import type { NavProps } from '../../App';
import { useTheme } from '../../theme';
import { useManager } from '../../managerStore';
import { compareNewsNewestFirst, displayNewsDate } from '../../data/newsData';
import usePublishedNews from '../../data/usePublishedNews';
import { ManagerHeader } from './mui';
import { useLang } from '../../lang';

const catColor = { Water: '#2D7A9E', Gas: '#8A5E3A', Energy: '#7A5EA0', General: '#5E7A3A' };
const catBgLight = { Water: '#E8F2FA', Gas: '#F5EDE0', Energy: '#F3EEF8', General: '#EEF5E8' };
const catBgDark = { Water: '#0A1E2A', Gas: '#1E160A', Energy: '#1A102A', General: '#0A1E10' };
const categoryKeys = { Water: 'news_cat_water', Gas: 'news_cat_gas', Energy: 'news_cat_energy', General: 'news_cat_general' } as const;

export default function ManagerNews({ navigate }: NavProps) {
  const { t, darkMode } = useTheme();
  const { tr, lang } = useLang();
  const { newsSubmissions, reviewSubmission } = useManager();
  const published = [...usePublishedNews()].sort(compareNewsNewestFirst);
  const pending = newsSubmissions.filter(s => s.status === 'pending');
  const [view, setView] = useState<'published' | 'review'>('published');
  const [goldenToggles, setGoldenToggles] = useState<Record<number, boolean>>({});

  return (
    <div style={{ background: t.bg, minHeight: '100%', paddingBottom: 16, transition: 'background 0.3s' }}>
      <ManagerHeader
        eyebrow={tr('m_eyebrow_comms')}
        title={tr('m_news_title')}
        subtitle={tr('m_news_comms_subtitle')}
        action={
          <button type="button" onClick={() => navigate('m-news-new')} aria-label={tr('m_news_add')}
            style={{ background: t.primary, border: 'none', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.primaryText} strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          </button>
        }
      />

      <div style={{ display: 'flex', gap: 4, margin: '0 24px 18px', padding: 4, background: t.mutedSurface, border: `1px solid ${t.cardBorder}`, borderRadius: 13 }}>
        {(['published', 'review'] as const).map(tab => {
          const active = view === tab;
          return (
            <button key={tab} type="button" onClick={() => setView(tab)} aria-pressed={active}
              style={{ flex: 1, minWidth: 0, padding: '10px 8px', border: 'none', borderRadius: 10, background: active ? t.card : 'transparent', color: active ? t.primary : t.textMuted, boxShadow: active ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', fontSize: 12, fontWeight: active ? 700 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <span>{tr(tab === 'published' ? 'm_news_published_badge' : 'm_news_pending_review')}</span>
              {tab === 'review' && pending.length > 0 && <span style={{ minWidth: 19, height: 19, padding: '0 5px', borderRadius: 10, background: active ? t.primary : t.cardBorder, color: active ? t.primaryText : t.text, fontSize: 10, lineHeight: '19px' }}>{pending.length}</span>}
            </button>
          );
        })}
      </div>

      {view === 'published' && (
        <div style={{ padding: '0 24px' }}>
          {published.map(item => (
            <button key={item.id} type="button" onClick={() => navigate('news-detail', { newsId: item.id, isManager: true })}
              style={{ display: 'block', width: '100%', textAlign: 'start', background: t.card, border: item.golden ? '1.5px solid #DAA52060' : `1.5px solid ${t.cardBorder}`, borderInlineStart: item.golden ? '4px solid #DAA520' : undefined, borderRadius: 16, padding: '14px 16px', marginBottom: 10, cursor: 'pointer', transition: 'background 0.3s' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginBottom: 7 }}>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: catColor[item.category], textTransform: 'uppercase', background: darkMode ? catBgDark[item.category] : catBgLight[item.category], padding: '2px 8px', borderRadius: 8 }}>{tr(categoryKeys[item.category])}</span>
                {item.golden && <span style={{ fontSize: 9, fontWeight: 700, color: '#B8860B', background: darkMode ? '#1A1400' : '#FDF6E3', padding: '2px 8px', borderRadius: 8 }}>★ {tr('news_cat_golden')}</span>}
                <span style={{ fontSize: 11, color: t.textFaint }}>{displayNewsDate(item.date, lang)}</span>
              </span>
              <span style={{ display: 'block', fontSize: 14, fontWeight: 600, color: t.text, lineHeight: 1.4, marginBottom: 4 }}>{item.title}</span>
              <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: 12, color: t.textFaint, lineHeight: 1.5 }}>{item.desc}</span>
            </button>
          ))}
        </div>
      )}

      {view === 'review' && (
        <div style={{ padding: '0 24px' }}>
          {pending.length === 0 && (
            <div style={{ background: t.card, border: `1.5px dashed ${t.cardBorder}`, borderRadius: 16, padding: '30px 20px', textAlign: 'center' }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: t.text, marginBottom: 5 }}>{tr('m_news_no_pending')}</p>
              <p style={{ fontSize: 13, color: t.textFaint, lineHeight: 1.5 }}>{tr('m_news_no_pending_desc')}</p>
            </div>
          )}
          {pending.map(sub => {
            const isGolden = !!goldenToggles[sub.id];
            return (
              <div key={sub.id} style={{ background: t.card, border: `1.5px solid ${t.cardBorder}`, borderRadius: 16, padding: '14px 16px', marginBottom: 10, transition: 'background 0.3s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginBottom: 6 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: catColor[sub.category], textTransform: 'uppercase', background: darkMode ? catBgDark[sub.category] : catBgLight[sub.category], padding: '2px 8px', borderRadius: 8 }}>{tr(categoryKeys[sub.category])}</span>
                  <span style={{ fontSize: 11, color: t.textFaint }}>{displayNewsDate(sub.submittedAt, lang)}</span>
                  <span style={{ marginInlineStart: 'auto', fontSize: 9, fontWeight: 700, color: '#B8860B', background: darkMode ? '#1A1400' : '#FDF6E3', padding: '2px 8px', borderRadius: 8 }}>{tr('m_news_pending_badge')}</span>
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: t.text, lineHeight: 1.4, marginBottom: 4 }}>{sub.title}</h3>
                <p style={{ fontSize: 12, color: t.textFaint, lineHeight: 1.5, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{sub.description}</p>
                <p style={{ fontSize: 11, color: t.textFaint, marginBottom: 12 }}>{tr('m_news_submitted_by')} <strong style={{ color: t.text }}><bdi>{sub.submittedBy}</bdi></strong></p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <button type="button" role="switch" aria-checked={isGolden} aria-label={tr('m_news_mark_golden')}
                    onClick={() => setGoldenToggles(prev => ({ ...prev, [sub.id]: !prev[sub.id] }))}
                    style={{ width: 38, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer', background: isGolden ? '#DAA520' : t.cardBorder, position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                    <span style={{ position: 'absolute', top: 3, left: isGolden ? 19 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.25)' }} />
                  </button>
                  <span style={{ fontSize: 12, color: isGolden ? '#B8860B' : t.textFaint, fontWeight: isGolden ? 600 : 400 }}>{tr('m_news_mark_golden')}</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="button" onClick={() => reviewSubmission(sub.id, 'approved', isGolden)}
                    style={{ flex: 1, background: '#2A7A4E', color: '#fff', border: 'none', borderRadius: 10, padding: '10px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{tr('m_btn_approve')}</button>
                  <button type="button" onClick={() => reviewSubmission(sub.id, 'rejected', false)}
                    style={{ flex: 1, background: '#7A2A2A', color: '#fff', border: 'none', borderRadius: 10, padding: '10px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{tr('m_btn_reject')}</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
