import { useState } from 'react';
import type { NavProps } from '../App';
import { useTheme } from '../theme';
import { useLang } from '../lang';
import { useManagerContext } from '../managerStore';

type Category = 'Water' | 'Gas' | 'Energy' | 'General';
const CATEGORIES: Category[] = ['Water', 'Gas', 'Energy', 'General'];

export default function NewsCreate({ goBack }: NavProps) {
  const { t } = useTheme();
  const { tr } = useLang();
  const { addNewsSubmission } = useManagerContext();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('General');
  const [submitted, setSubmitted] = useState(false);

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: t.card,
    border: `1.5px solid ${t.cardBorder}`,
    borderRadius: 12,
    padding: '12px 14px',
    fontSize: 14,
    color: t.text,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
  };

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) return;
    addNewsSubmission({
      title: title.trim(),
      description: description.trim(),
      category,
      submittedBy: 'Resident',
      submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ background: t.bg, minHeight: '100%', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: t.card, border: `2px solid ${t.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={t.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: t.text, textAlign: 'center' }}>{tr('news_create_success')}</h2>
        <p style={{ fontSize: 14, color: t.textFaint, textAlign: 'center', lineHeight: 1.6, maxWidth: 280 }}>{tr('news_create_success_msg')}</p>
        <button onClick={goBack} style={{ marginTop: 16, background: t.primary, color: '#fff', border: 'none', borderRadius: 14, padding: '13px 32px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
          {tr('btn_back')}
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: t.bg, minHeight: '100%', paddingBottom: 32, transition: 'background 0.3s' }}>
      {/* Header */}
      <div style={{ padding: '16px 24px 14px' }}>
        <button onClick={goBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.primary} strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
          <span style={{ fontSize: 13, color: t.primary, fontWeight: 500 }}>{tr('btn_back')}</span>
        </button>
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: t.primary, textTransform: 'uppercase', marginBottom: 4 }}>News</p>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: t.text, marginBottom: 4 }}>{tr('news_create_title')}</h1>
        <p style={{ fontSize: 13, color: t.textFaint }}>{tr('news_create_subtitle')}</p>
      </div>

      {/* Form */}
      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Title */}
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: t.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 7 }}>
            {tr('news_create_field_title')}
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="News title..."
            style={inputStyle}
          />
        </div>

        {/* Description */}
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: t.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 7 }}>
            {tr('news_create_field_desc')}
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe the news..."
            rows={4}
            style={{ ...inputStyle, resize: 'none' }}
          />
        </div>

        {/* Category */}
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: t.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 7 }}>
            {tr('news_create_field_category')}
          </label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 20,
                  background: category === cat ? t.primary : t.card,
                  border: `1.5px solid ${category === cat ? t.primary : t.cardBorder}`,
                  color: category === cat ? '#fff' : t.textMuted,
                  fontSize: 13,
                  fontWeight: category === cat ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!title.trim() || !description.trim()}
          style={{
            marginTop: 8,
            background: title.trim() && description.trim() ? t.primary : t.card,
            color: title.trim() && description.trim() ? '#fff' : t.textFaint,
            border: 'none',
            borderRadius: 14,
            padding: '14px',
            fontSize: 15,
            fontWeight: 600,
            cursor: title.trim() && description.trim() ? 'pointer' : 'not-allowed',
            transition: 'background 0.2s',
          }}
        >
          {tr('news_create_submit')}
        </button>
      </div>
    </div>
  );
}
