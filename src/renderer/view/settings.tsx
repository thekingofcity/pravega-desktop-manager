import * as React from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListSubheader,
    Switch as SwitchUI,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import TranslateIcon from '@mui/icons-material/Translate';

enum SettingType {
    Title,
    Divider,
    Switch,
    Select,
}

const Settings = () => {
    const theme = useTheme();

    const [isReconnectOnStartup, setIsReconnectOnStartup] =
        React.useState(false);

    const settingsItem: {
        type: SettingType;
        label?: string;
        options?: Record<string, string>;
        onChange?: (value: string) => void;
    }[] = [
        { type: SettingType.Title, label: 'Settings' },
        {
            type: SettingType.Select,
            label: 'Language',
        },
        { type: SettingType.Divider },
        {
            type: SettingType.Switch,
            label: 'Reconnect on startup',
            options: { 'en-us': 'en-US', 'zh-ch': 'zh-CN' },
            onChange: (value: string) => {
                setIsReconnectOnStartup(value === 'true');
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
                {settingsItem.map(
                    (item) =>
                        item.type === SettingType.Switch && (
                            <ListItem key={item.label}>
                                <ListItemIcon>
                                    <SettingsBackupRestoreIcon />
                                </ListItemIcon>
                                <ListItemText primary={item.label} />
                                <SwitchUI
                                    edge="end"
                                    onChange={(_, checked) => {
                                        if (item.onChange !== undefined) {
                                            item.onChange(String(checked));
                                        }
                                    }}
                                    checked={isReconnectOnStartup}
                                    disabled
                                />
                            </ListItem>
                        )
                )}
            </List>
        </>
    );
};

export default Settings;
