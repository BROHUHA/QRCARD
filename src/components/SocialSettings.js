import { Button, Checkbox, Pane, SelectField } from 'evergreen-ui';
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { Translations } from '../translations';
import { PLATFORMS, PlatformIcon } from './SocialCard';
import './style.css';

export const SocialSettings = (props) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const selectedPlatform = PLATFORMS.find(p => p.id === props.settings.platform) || PLATFORMS[0];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const langSelectDefaultValue = () => {
        const translation = Translations.filter((tr) => tr.id === i18n.language);
        if (translation.length !== 1) {
            return 'en-US';
        }
        return translation[0].id;
    };

    useEffect(() => {
        if (props.firstLoad.current && window.innerWidth < 500) {
            props.onFirstLoad();
            props.onOrientationChange(true);
        }
    });

    return (
        <Pane
            id="settings"
            marginBottom={0}
            maxWidth={props.settings.portrait ? '350px' : '100%'}
        >
            {/* Custom Neobrutalist Platform Selector */}
            <Pane marginBottom={24} position="relative" ref={dropdownRef}>
                <Pane marginBottom={8}>
                    <span style={{ fontWeight: 700, color: '#000', textTransform: 'uppercase', fontSize: '0.9rem' }}>
                        {t('social.platform')}
                    </span>
                </Pane>

                <div
                    className={`neo-dropdown-trigger ${isOpen ? 'open' : ''}`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <PlatformIcon platformId={selectedPlatform.id} color="#000" />
                        <span>{selectedPlatform.name}</span>
                    </div>
                    <svg
                        width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                        style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                    >
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>

                {isOpen && (
                    <div className="neo-dropdown-menu">
                        {PLATFORMS.map((platform) => (
                            <div
                                key={platform.id}
                                className={`neo-dropdown-item ${selectedPlatform.id === platform.id ? 'selected' : ''}`}
                                onClick={() => {
                                    props.onPlatformChange(platform.id);
                                    setIsOpen(false);
                                }}
                            >
                                <PlatformIcon platformId={platform.id} color="#000" />
                                <span>{platform.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </Pane>

            <SelectField
                width="100%"
                inputHeight={48}
                label={t('select')}
                labelProps={{ style: { fontWeight: 700, color: '#000', textTransform: 'uppercase', fontSize: '0.9rem' } }}
                onChange={(e) => props.onLanguageChange(e.target.value)}
                defaultValue={langSelectDefaultValue()}
                className="neo-select"
            >
                {Translations.map((tr) => (
                    <option key={tr.id} value={tr.id}>
                        {tr.name}
                    </option>
                ))}
            </SelectField>

            <Checkbox
                label={t('button.rotate')}
                checked={props.settings.portrait}
                onChange={() => props.onOrientationChange(!props.settings.portrait)}
                style={{ fontWeight: 600, color: '#000' }}
            />
            <Checkbox
                label={t('social.hideDisplayName')}
                checked={props.settings.hideDisplayName}
                onChange={() => props.onHideDisplayNameChange(!props.settings.hideDisplayName)}
                style={{ fontWeight: 600, color: '#000' }}
            />
        </Pane>
    );
};
