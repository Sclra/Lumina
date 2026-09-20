import { useState } from 'react';
import type { NavProps } from '../../App';
import { useTheme } from '../../theme';
import { useManager, useManagerContext } from '../../managerStore';
import { ManagerHeader } from './mui';
import { useLang } from '../../lang';

const catColor: Record<string, string> = { Water: '#2D7A9E', Gas: '#8A5E3A', Energy: '#7A5EA0', General: '#5E7A3A' };
const catBgLight: Record<string, string> = { Water: '#E8F2FA', Gas: '#F5EDE0', Energy: '#F3EEF8', General: '#EEF5E8' };
const catBgDark: Record<string, string> = { Water: '#0A1E2A', Gas: '#1E160A', Energy: '#1A102A', General: '#0A1E10' };

export default function ManagerNews({ navigate }: NavProps) {
  const { t, darkMode } = useTheme();
  const { tr } = useLang();
  const { announcements } = useManager();
  const { newsSubmissions, reviewSubmission } = useManagerContext();
  const [goldenToggles, setGoldenToggles] = useState<Record<number, boolean>>({});

  const pending = newsSubmissions.filter(s => s.status === 'pending');

  const toggleGolden = (id: number) =>
    setGoldenToggles(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div style={{ background: t.bg, minHeight: '100%', paddingBottom: 16, transition: 'background 0.3s' }}>
      <ManagerHeader
        eyebrow={tr('m_eyebrow_comms')}
        title={tr('m_news_title')}
        subtitle={tr('m_news_comms_subtitle')}
        action={
          <button onClick={() => navigate('m-news-new')} style={{ background: t.primary, border: 'none', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.primaryText} strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          </button>
        }
      />

      {/* Pending Review Section */}
      {pending.length > 0 && (
        <div style={{ padding: '0 24px', marginBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: t.primary, textTransform: 'uppercase', marginBottom: 10 }}>{tr('m_news_pending_review')}</p>
          {pending.map(sub => {
            const isGolden = !!goldenToggles[sub.id];
            return (
              <div key={sub.id} style={{ background: t.card, border: `1.5px solid ${t.cardBorder}`, borderRadius: 16, padding: '14px 16px', marginBottom: 10, transition: 'background 0.3s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: catColor[sub.category], textTransform: 'uppercase', background: darkMode ? catBgDark[sub.category] : catBgLight[sub.category], padding: '2px 8px', borderRadius: 8 }}>{sub.category}</span>
                  <span style={{ fontSize: 10, color: t.textFaint }}>•</span>
                  <span style={{ fontSize: 11, color: t.textFaint }}>{sub.submittedAt}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 700, color: '#B8860B', background: darkMode ? '#1A1400' : '#FDF6E3', padding: '2px 8px', borderRadius: 8, textTransform: 'uppercase' }}>{tr('m_news_pending_badge')}</span>
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: t.text, lineHeight: 1.4, marginBottom: 4 }}>{sub.title}</h3>
                <p style={{ fontSize: 12, color: t.textFaint, lineHeight: 1.5, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{sub.description}</p>
                <p style={{ fontSize: 11, color: t.textFaint, marginBottom: 12 }}>{tr('m_news_submitted_by')} <strong style={{ color: t.text }}>{sub.submittedBy}</strong></p>

                {/* Golden toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <button
                    onClick={() => toggleGolden(sub.id)}
                    style={{
                      width: 38, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer',
                      background: isGolden ? '#DAA520' : t.cardBorder,
                      position: 'relative', transition: 'background 0.2s', flexShrink: 0,
                    }}
                  >
                    <span style={{ position: 'absolute', top: 3, left: isGolden ? 19 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.25)' }} />
                  </button>
                  <span style={{ fontSize: 12, color: isGolden ? '#B8860B' : t.textFaint, fontWeight: isGolden ? 600 : 400 }}>{tr('m_news_mark_golden')}</span>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => reviewSubmission(sub.id, 'approved', isGolden)}
                    style={{ flex: 1, background: '#2A7A4E', color: '#fff', border: 'none', borderRadius: 10, padding: '10px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                  >{tr('m_btn_approve')}</button>
                  <button
                    onClick={() => reviewSubmission(sub.id, 'rejected', false)}
                    style={{ flex: 1, background: '#7A2A2A', color: '#fff', border: 'none', borderRadius: 10, padding: '10px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                  >{tr('m_btn_reject')}</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ padding: '0 24px' }}>
        {announcements.length === 0 && (
          <div style={{ background: t.card, border: `1.5px dashed ${t.cardBorder}`, borderRadius: 16, padding: '30px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: t.text, marginBottom: 5 }}>{tr('m_news_no_yet')}</p>
            <p style={{ fontSize: 13, color: t.textFaint, lineHeight: 1.5, marginBottom: 16 }}>{tr('m_news_empty_desc')}</p>
            <button onClick={() => navigate('m-news-new')} style={{ background: t.primary, color: t.primaryText, border: 'none', borderRadius: 12, padding: '11px 20px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>{tr('m_news_write_btn')}</button>
          </div>
        )}

        {announcements.map(a => (
          <div key={a.id} style={{ background: t.card, border: `1.5px solid ${t.cardBorder}`, borderRadius: 16, padding: '14px 16px', marginBottom: 10, transition: 'background 0.3s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: catColor[a.category], textTransform: 'uppercase', background: darkMode ? catBgDark[a.category] : catBgLight[a.category], padding: '2px 8px', borderRadius: 8 }}>{a.category}</span>
              <span style={{ fontSize: 10, color: t.textFaint }}>•</span>
              <span style={{ fontSize: 11, color: t.textFaint }}>{a.date}</span>
              <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: t.paidText, background: t.paidBg, padding: '2px 8px', borderRadius: 8, textTransform: 'uppercase' }}>{tr('m_news_published_badge')}</span>
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: t.text, lineHeight: 1.4, marginBottom: 4 }}>{a.title}</h3>
            <p style={{ fontSize: 12, color: t.textFaint, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
