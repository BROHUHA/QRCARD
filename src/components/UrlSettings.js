import { Checkbox, Pane, SelectField } from 'evergreen-ui';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { Translations } from '../translations';
import './style.css';

export const UrlSettings = (props) => {
    const { t } = useTranslation();

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
            <SelectField
                width={300}
                inputHeight={38}
                label={t('select')}
                onChange={(e) => props.onLanguageChange(e.target.value)}
                defaultValue={langSelectDefaultValue()}
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
            />
            <Checkbox
                label={t('url.hideTitle')}
                checked={props.settings.hideTitle}
                onChange={() => props.onHideTitleChange(!props.settings.hideTitle)}
            />
        </Pane>
    );
};
