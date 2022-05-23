import * as React from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListSubheader,
    SvgIcon,
    Switch as SwitchUI,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import TranslateIcon from '@mui/icons-material/Translate';
import { useAppSelector, useAppDispatch } from '../redux/store';
import { setAdvancedRead, resetAll } from '../redux/connection';
import { deleteAllPreviews } from '../redux/preview';

enum SettingType {
    Title,
    Divider,
    Switch,
    Select,
}

const Settings = () => {
    const theme = useTheme();
    const { advancedRead } = useAppSelector((state) => state.connection);
    const dispatch = useAppDispatch();

    const [isReconnectOnStartup, setIsReconnectOnStartup] =
        React.useState(false);

    const settingsItem: {
        type: SettingType;
        value: string;
        label?: string;
        options?: Record<string, string>;
        hidden?: boolean;
        icon?: typeof SvgIcon;
        onChange?: (value: string) => void;
    }[] = [
        { type: SettingType.Title, label: 'Settings', value: '' },
        {
            type: SettingType.Select,
            value: '',
            label: 'Language',
            options: { 'en-us': 'en-US', 'zh-ch': 'zh-CN' },
            icon: TranslateIcon,
        },
        { type: SettingType.Divider, value: '' },
        {
            type: SettingType.Switch,
            value: '',
            label: 'Reconnect on startup',
            hidden: true,
            onChange: (value: string) => {
                setIsReconnectOnStartup(value === 'true');
            },
        },
        {
            type: SettingType.Switch,
            value: String(advancedRead),
            label: 'Read stream with advanced options',
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
        <>
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
                    maxWidth: 360,
                    bgcolor: 'background.paper',
                }}
                subheader={<ListSubheader>Settings</ListSubheader>}
            >
                {settingsItem
                    .filter((item) => !item.hidden)
                    .map(
                        (item) =>
                            item.type === SettingType.Switch && (
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
                            )
                    )}
            </List>
        </>
    );
};

export default Settings;
