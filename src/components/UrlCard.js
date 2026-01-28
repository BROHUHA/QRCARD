import {
  Card,
  Heading,
  Pane,
  Paragraph,
  Text,
  TextareaField,
} from 'evergreen-ui';
import QRCode from 'qrcode.react';
import { useTranslation } from 'react-i18next';
import './style.css';

// Link icon component
const LinkIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

// Phone/scan icon
const ScanIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

export const UrlCard = (props) => {
  const { t } = useTranslation();

  const portraitWidth = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    return isMobile ? '100%' : '280px';
  };

  // Ensure URL has protocol for proper QR code scanning
  const getFullUrl = (url) => {
    if (!url) return '';
    if (url.match(/^https?:\/\//i)) return url;
    return `https://${url}`;
  };

  return (
    <Pane id={props.id}>
      <Card
        id="print-area"
        elevation={3}
        style={{ maxWidth: props.settings.portrait ? portraitWidth() : '100%' }}
      >
        <Pane display="flex" paddingBottom={12}>
          <LinkIcon />
          <Heading
            size={700}
            paddingRight={10}
            paddingLeft={10}
            textAlign={props.settings.portrait ? 'center' : 'unset'}
            style={{
              fontWeight: 900,
              WebkitTextStroke: '1.5px black',
              paintOrder: 'stroke fill',
              color: '#FFC900'
            }}
          >
            {props.settings.title || t('url.card.title')}
          </Heading>
        </Pane>

        <Pane
          className="details"
          style={{ flexDirection: props.settings.portrait ? 'column' : 'row' }}
        >
          <QRCode
            className="qrcode"
            style={{ padding: '1em' }}
            value={getFullUrl(props.settings.url) || 'https://example.com'}
            size={150}
          />

          <Pane width={'100%'}>
            <TextareaField
              id="url-input"
              type="text"
              marginBottom={5}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              label={t('url.label')}
              placeholder={t('url.placeholder')}
              value={props.settings.url}
              onChange={(e) => props.onUrlChange(e.target.value)}
              isInvalid={!!props.urlError}
              validationMessage={!!props.urlError && props.urlError}
            />
            {!props.settings.hideTitle && (
              <TextareaField
                id="url-title"
                type="text"
                marginBottom={5}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                maxLength="50"
                label={t('url.title.label')}
                placeholder={t('url.title.placeholder')}
                value={props.settings.title}
                onChange={(e) => props.onTitleChange(e.target.value)}
              />
            )}
          </Pane>
        </Pane>
        <hr />
        <Paragraph>
          <ScanIcon />
          <Text size={300} paddingRight={8} paddingLeft={8}>
            {t('url.tip')}
          </Text>
        </Paragraph>
      </Card>
    </Pane>
  );
};
