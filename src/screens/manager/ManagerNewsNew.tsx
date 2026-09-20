import { useState } from 'react';
import type { NavProps } from '../../App';
import { useTheme } from '../../theme';
import { useManager, type Announcement } from '../../managerStore';
import { ManagerHeader, Field, inputStyle, PrimaryButton } from './mui';
import { useLang } from '../../lang';

const cats: Announcement['category'][] = ['General', 'Water', 'Gas', 'Energy'];

function todayLabel() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

export default function ManagerNewsNew({ goBack }: NavProps) {
  const { t } = useTheme();
  const { tr } = useLang();
  const { addAnnouncement } = useManager();

  const [category, setCategory] = useState<Announcement['category']>('General');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const canSubmit = title.trim() && body.trim();

  const submit = () => {
    if (!canSubmit) return;
    addAnnouncement({ category, title: title.trim(), body: body.trim(), date: todayLabel(), published: true });
    goBack();
  };

  return (
    <div style={{ background: t.bg, minHeight: '100%', paddingBottom: 32, transition: 'background 0.3s' }}>
      <ManagerHeader eyebrow={tr('m_eyebrow_comms')} title={tr('m_news_new_title')} onBack={goBack} />

      <div style={{ padding: '0 24px' }}>
        <Field label={tr('m_news_cat_field')}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {cats.map(c => {
              const catLabelMap: Record<string, string> = {
                General: tr('news_cat_general'),
                Water: tr('news_cat_water'),
                Gas: tr('news_cat_gas'),
                Energy: tr('news_cat_energy'),
              };
              return (
                <button key={c} onClick={() => setCategory(c)} style={{
                  padding: '8px 16px', borderRadius: 20, cursor: 'pointer',
                  background: category === c ? t.primary : t.card,
                  border: `1.5px solid ${category === c ? t.primary : t.cardBorder}`,
                  color: category === c ? t.primaryText : t.textMuted, fontWeight: category === c ? 600 : 400, fontSize: 13,
                }}>{catLabelMap[c] ?? c}</button>
              );
            })}
          </div>
        </Field>

        <Field label={tr('m_news_headline_field')}>
          <input value={title} onChange={e => setTitle(e.target.value)} style={inputStyle(t)} placeholder={tr('m_news_headline_ph')} />
        </Field>

        <Field label={tr('m_news_message_field')}>
          <textarea value={body} onChange={e => setBody(e.target.value)} rows={7}
            style={{ ...inputStyle(t), resize: 'vertical', lineHeight: 1.55 }}
            placeholder={tr('m_news_message_ph')} />
        </Field>

        <PrimaryButton onClick={submit} disabled={!canSubmit}
          icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={t.primaryText} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>}>
          {tr('m_news_publish_btn')}
        </PrimaryButton>
      </div>
    </div>
  );
}
