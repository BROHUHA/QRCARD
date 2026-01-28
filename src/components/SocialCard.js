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

// Platform configurations with SVG icons and brand colors
const PLATFORMS = [
    {
        id: 'whatsapp',
        name: 'WhatsApp',
        inputType: 'phone',
        prefix: 'https://wa.me/',
        placeholder: '+1234567890',
        color: '#25D366',
        bgColor: '#dcf8c6'
    },
    {
        id: 'telegram',
        name: 'Telegram',
        inputType: 'username',
        prefix: 'https://t.me/',
        placeholder: 'username',
        color: '#0088cc',
        bgColor: '#e3f2fd'
    },
    {
        id: 'instagram',
        name: 'Instagram',
        inputType: 'username',
        prefix: 'https://instagram.com/',
        placeholder: 'username',
        color: '#E4405F',
        bgColor: '#fce4ec'
    },
    {
        id: 'twitter',
        name: 'X (Twitter)',
        inputType: 'username',
        prefix: 'https://x.com/',
        placeholder: 'username',
        color: '#000000',
        bgColor: '#f5f5f5'
    },
    {
        id: 'linkedin',
        name: 'LinkedIn',
        inputType: 'username',
        prefix: 'https://linkedin.com/in/',
        placeholder: 'username',
        color: '#0A66C2',
        bgColor: '#e8f4fd'
    },
    {
        id: 'discord',
        name: 'Discord',
        inputType: 'invite',
        prefix: 'https://discord.gg/',
        placeholder: 'invite-code',
        color: '#5865F2',
        bgColor: '#eef0ff'
    },
    {
        id: 'snapchat',
        name: 'Snapchat',
        inputType: 'username',
        prefix: 'https://snapchat.com/add/',
        placeholder: 'username',
        color: '#FFFC00',
        bgColor: '#fffde7'
    },
    {
        id: 'tiktok',
        name: 'TikTok',
        inputType: 'username',
        prefix: 'https://tiktok.com/@',
        placeholder: 'username',
        color: '#000000',
        bgColor: '#fff0f5'
    },
    {
        id: 'youtube',
        name: 'YouTube',
        inputType: 'channel',
        prefix: 'https://youtube.com/@',
        placeholder: 'channel',
        color: '#FF0000',
        bgColor: '#ffebee'
    },
    {
        id: 'github',
        name: 'GitHub',
        inputType: 'username',
        prefix: 'https://github.com/',
        placeholder: 'username',
        color: '#181717',
        bgColor: '#f6f8fa'
    },
];

// SVG Icons for each platform
const PlatformIcons = {
    whatsapp: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    ),
    telegram: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
    ),
    instagram: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.757-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
        </svg>
    ),
    twitter: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    ),
    linkedin: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    ),
    discord: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
        </svg>
    ),
    snapchat: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.5c-2.8 0-5 2.2-5 5 0 .2 0 .4.1.6-.2 0-.4.1-.6.1-1.3.3-2.3 2.3-2.2 2.6.1.3.5.5.9.4h.2c-.3.8-.4 2-.1 3 .6 2 2.4 2.1 2.8 2.1.3 0 .5-.1.5-.1s.3 1.2 3.4 1.2c3.1 0 3.4-1.2 3.4-1.2s.2.1.5.1c.4 0 2.2-.1 2.8-2.1.2-1.1.2-2.3-.1-3h.2c.3.1.8-.1.9-.4 0-.3-1-2.3-2.2-2.6-.2 0-.4-.1-.6-.1 0-.2.1-.4.1-.6 0-2.8-2.2-5-5-5z" />
        </svg>
    ),
    tiktok: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
    ),
    youtube: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
    ),
    github: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
    ),
};

// Get icon component for platform
const PlatformIcon = ({ platformId, color }) => {
    const IconComponent = PlatformIcons[platformId];
    return IconComponent ? (
        <span style={{ color: color || 'currentColor', display: 'flex', alignItems: 'center' }}>
            <IconComponent />
        </span>
    ) : null;
};

// Scan icon
const ScanIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
    </svg>
);

export { PLATFORMS, PlatformIcon };

export const SocialCard = (props) => {
    const { t } = useTranslation();
    const selectedPlatform = PLATFORMS.find(p => p.id === props.settings.platform) || PLATFORMS[0];

    const portraitWidth = () => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        return isMobile ? '100%' : '280px';
    };

    // Generate full URL based on platform
    const getFullUrl = () => {
        const value = props.settings.value || '';
        if (!value) return 'https://example.com';

        // For phone numbers, strip non-numeric except +
        if (selectedPlatform.inputType === 'phone') {
            const cleanNumber = value.replace(/[^\d+]/g, '');
            return `${selectedPlatform.prefix}${cleanNumber}`;
        }

        // For usernames/handles, strip @ if present
        const cleanValue = value.replace(/^@/, '');
        return `${selectedPlatform.prefix}${cleanValue}`;
    };

    const getInputLabel = () => {
        switch (selectedPlatform.inputType) {
            case 'phone': return t('social.phone');
            case 'invite': return t('social.invite');
            case 'channel': return t('social.channel');
            default: return t('social.username');
        }
    };

    // Dynamic card style based on platform
    const cardStyle = {
        maxWidth: props.settings.portrait ? portraitWidth() : '100%',
        background: `linear-gradient(135deg, ${selectedPlatform.bgColor} 0%, #ffffff 100%)`,
        borderColor: selectedPlatform.color,
        borderWidth: '3px',
        borderRadius: '16px', // Rounded card
    };

    return (
        <Pane id={props.id}>
            <Card
                id="print-area"
                elevation={3}
                style={cardStyle}
                className="social-card"
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '16px',
                    borderBottom: `2px solid ${selectedPlatform.color}40`, /* Subtle divider */
                    marginBottom: '16px',
                    background: 'rgba(255,255,255,0.6)',
                    borderTopLeftRadius: '13px',
                    borderTopRightRadius: '13px'
                }}>
                    <PlatformIcon platformId={selectedPlatform.id} color={selectedPlatform.color} />
                    <Heading
                        size={700}
                        paddingLeft={12}
                        textAlign={props.settings.portrait ? 'center' : 'unset'}
                        style={{
                            color: selectedPlatform.color,
                            textTransform: 'uppercase',
                            fontWeight: 900,
                            WebkitTextStroke: '1.5px black',
                            paintOrder: 'stroke fill'
                        }}
                    >
                        {props.settings.displayName || selectedPlatform.name}
                    </Heading>
                </div>

                <Pane
                    className="details"
                    padding={16} // consistent padding
                    style={{ flexDirection: props.settings.portrait ? 'column' : 'row' }}
                >
                    <QRCode
                        className="qrcode"
                        style={{ padding: '1em', borderColor: selectedPlatform.color }}
                        value={getFullUrl()}
                        size={150}
                        fgColor={selectedPlatform.color}
                    />

                    <Pane width={'100%'}>
                        <TextareaField
                            id="social-value"
                            type="text"
                            marginBottom={5}
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="none"
                            spellCheck={false}
                            label={getInputLabel()}
                            placeholder={selectedPlatform.placeholder}
                            value={props.settings.value}
                            onChange={(e) => props.onValueChange(e.target.value)}
                            isInvalid={!!props.valueError}
                            validationMessage={!!props.valueError && props.valueError}
                        />

                        {!props.settings.hideDisplayName && (
                            <TextareaField
                                id="social-display-name"
                                type="text"
                                marginBottom={5}
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck={false}
                                maxLength="30"
                                label={t('social.displayName')}
                                placeholder={t('social.displayName.placeholder')}
                                value={props.settings.displayName}
                                onChange={(e) => props.onDisplayNameChange(e.target.value)}
                            />
                        )}
                    </Pane>
                </Pane>
                <hr style={{ borderColor: selectedPlatform.color + '40' }} />
                <Paragraph>
                    <ScanIcon />
                    <Text size={300} paddingRight={8} paddingLeft={8}>
                        {t('social.tip')} {selectedPlatform.name}
                    </Text>
                </Paragraph>
            </Card>
        </Pane>
    );
};
