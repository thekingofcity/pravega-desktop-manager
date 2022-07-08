import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListSubheader,
    MenuItem,
    Select as SelectUI,
    SvgIcon,
    Switch as SwitchUI,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import TranslateIcon from '@mui/icons-material/Translate';
import { useAppSelector, useAppDispatch } from '../redux/store';
import { setAdvancedRead, setLanguage, Lang } from '../redux/settings';
import { resetAll } from '../redux/connection';
import { deleteAllPreviews } from '../redux/preview';

enum SettingType {
    Section,
    Divider,
    Switch,
    Select,
}

const Settings = () => {
    const { advancedRead, language } = useAppSelector(
        (state) => state.settings
    );
    const dispatch = useAppDispatch();
    const { t, i18n } = useTranslation();
    const theme = useTheme();

    const settingsItem: {
        type: SettingType;
        value: string;
        label?: string;
        options?: Record<string, string>;
        hidden?: boolean;
        icon?: typeof SvgIcon;
        onChange?: (value: string) => void;
    }[] = [
        {
            type: SettingType.Select,
            value: '',
            label: t('views.settings.languages.name'),
            options: {
                'en-US': t('views.settings.languages.en-US'),
                'zh-CN': t('views.settings.languages.zh-CN'),
                'ja-JP': t('views.settings.languages.ja-JP'),
                'ko-KR': t('views.settings.languages.ko-KR'),
            },
            icon: TranslateIcon,
            onChange: (value: string) => {
                dispatch(setLanguage(value as Lang));
                i18n.changeLanguage(value as Lang);
            },
        },
        { type: SettingType.Divider, value: '' },
        {
            type: SettingType.Switch,
            value: String(advancedRead),
            label: t('views.settings.advancedReadOptions'),
            icon: SettingsBackupRestoreIcon,
            onChange: (value: string) => {
                dispatch(setAdvancedRead(value === 'true'));
                // Reset all state in render and main process to prevent
                // unexpected behavior such as read from head after read
                // from tail.
                dispatch(resetAll());
                dispatch(deleteAllPreviews());
                window.electron.pravega.resetAllReadersAndWriters();
            },
        },
    ];

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Box
                sx={{
                    top: 0,
                    width: '100%',
                    height: 40,
                    background: theme.palette.background.default,
                    WebkitAppRegion: 'drag',
                }}
            />

            <List
                sx={{
                    width: '100%',
                    maxWidth: 500,
                    bgcolor: 'background.paper',
                }}
                subheader={
                    <ListSubheader>{t('views.settings.title')}</ListSubheader>
                }
            >
                {settingsItem
                    .filter((item) => !item.hidden)
                    .map((item) => (
                        <>
                            {item.type === SettingType.Switch && (
                                <ListItem key={item.label}>
                                    {item.icon && (
                                        <ListItemIcon>
                                            <item.icon />
                                        </ListItemIcon>
                                    )}
                                    <ListItemText primary={item.label} />
                                    <SwitchUI
                                        edge="end"
                                        onChange={(_, checked) => {
                                            if (item.onChange !== undefined) {
                                                item.onChange(String(checked));
                                            }
                                        }}
                                        checked={item.value === 'true'}
                                    />
                                </ListItem>
                            )}
                            {item.type === SettingType.Select && (
                                <ListItem key={item.label}>
                                    {item.icon && (
                                        <ListItemIcon>
                                            <item.icon />
                                        </ListItemIcon>
                                    )}
                                    <ListItemText primary={item.label} />
                                    <SelectUI
                                        value={language}
                                        sx={{ width: 200 }}
                                        onChange={(e) =>
                                            item.onChange(e.target.value)
                                        }
                                    >
                                        {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
                                        {Object.entries(item.options!).map(
                                            ([key, val]) => (
                                                <MenuItem key={key} value={key}>
                                                    {val}
                                                </MenuItem>
                                            )
                                        )}
                                    </SelectUI>
                                </ListItem>
                            )}
                        </>
                    ))}
            </List>
        </Box>
    );
};

export default Settings;
