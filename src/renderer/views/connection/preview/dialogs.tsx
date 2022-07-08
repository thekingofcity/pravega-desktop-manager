import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    MenuItem,
    Switch,
    TextField,
} from '@mui/material';
import { useAppSelector } from '../../../redux/store';

interface AdvancedReadDialogProps {
    open: boolean;
    onClose: () => void;
    onSet: (
        streamCut: 'head' | 'tail' | string,
        automaticRead: boolean
    ) => void;
}

export const AdvancedReadDialog = (props: AdvancedReadDialogProps) => {
    const { open, onClose, onSet } = props;
    const { t } = useTranslation();

    const [streamCut, setStreamCut] = React.useState(
        'tail' as 'head' | 'tail' | 'streamcut'
    );
    const [streamCutData, setStreamCutData] = React.useState('');
    const [automaticRead, setAutomaticRead] = React.useState(true);

    // clear inputs on each open
    React.useEffect(() => {
        setStreamCut('tail');
        setStreamCutData('');
        setAutomaticRead(true);
    }, [open]);

    return (
        <Dialog
            open={open}
            onClose={(_, reason) => {
                // no close except SET button
                if (reason === 'backdropClick') return;
                onClose();
            }}
        >
            <DialogTitle>
                {t(
                    'views.connection.preview.dialogs.advancedReadOptions.title'
                )}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {t(
                        'views.connection.preview.dialogs.advancedReadOptions.readFrom'
                    )}
                </DialogContentText>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginTop: 2,
                        marginBottom: 2,
                    }}
                >
                    <TextField
                        value={streamCut}
                        label={t(
                            'views.connection.preview.dialogs.advancedReadOptions.position'
                        )}
                        onChange={(e) =>
                            setStreamCut(
                                e.target.value as 'head' | 'tail' | 'streamcut'
                            )
                        }
                        select // tell TextField to render select
                        sx={{ width: 100 }} // display the full text
                    >
                        <MenuItem value="head">
                            {t(
                                'views.connection.preview.dialogs.advancedReadOptions.head'
                            )}
                        </MenuItem>
                        <MenuItem value="tail">
                            {t(
                                'views.connection.preview.dialogs.advancedReadOptions.tail'
                            )}
                        </MenuItem>
                        <MenuItem value="streamcut" disabled>
                            {t(
                                'views.connection.preview.dialogs.advancedReadOptions.streamCut'
                            )}
                        </MenuItem>
                    </TextField>
                    <TextField
                        label={t(
                            'views.connection.preview.dialogs.advancedReadOptions.streamCutValue'
                        )}
                        value={streamCutData}
                        onChange={({ target: { value } }) =>
                            setStreamCutData(value)
                        }
                        disabled={streamCut !== 'streamcut'}
                    />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginTop: 4,
                        marginBottom: 2,
                    }}
                >
                    <DialogContentText>
                        {t(
                            'views.connection.preview.dialogs.advancedReadOptions.readAutomatically'
                        )}
                    </DialogContentText>
                    <Switch
                        sx={{ alignSelf: 'end' }}
                        checked={automaticRead}
                        onChange={(_, checked) => setAutomaticRead(checked)}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ padding: 3 }}>
                <Button
                    onClick={() => onSet(streamCut, automaticRead)}
                    variant="contained"
                >
                    {t(
                        'views.connection.preview.dialogs.advancedReadOptions.confirm'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

interface FilterDialogProps {
    open: boolean;
    onClose: () => void;
    onSet: (filterStr: string) => void;
}

export const FilterDialog = (props: FilterDialogProps) => {
    const { open, onClose, onSet } = props;
    const { t } = useTranslation();
    const { currentConnection, connections } = useAppSelector(
        (state) => state.connection
    );
    const { currentTab } = connections[currentConnection];
    const oldFilterStr =
        connections[currentConnection].openedStreams[currentTab]?.filterStr ??
        '';

    const [filterStr, setFilterStr] = React.useState('');
    const [filterStrErr, setFilterStrErr] = React.useState(false);
    // clear filter text field on each open
    React.useEffect(() => setFilterStr(oldFilterStr), [open, oldFilterStr]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                {t('views.connection.preview.dialogs.filter.title')}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {t('views.connection.preview.dialogs.filter.content')}
                </DialogContentText>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginTop: 2,
                        marginBottom: 2,
                    }}
                >
                    <TextField
                        label={t(
                            'views.connection.preview.dialogs.filter.filterStr'
                        )}
                        value={filterStr}
                        autoFocus
                        sx={{ width: 500 }}
                        error={filterStrErr}
                        onChange={({ target: { value } }) => {
                            setFilterStr(value);
                            try {
                                // test if it is a valid regular expression
                                RegExp(value, 'g');
                            } catch (e) {
                                setFilterStrErr(true);
                                return;
                            }
                            setFilterStrErr(false);
                        }}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ padding: 3 }}>
                <Button onClick={() => onClose()} variant="contained">
                    {t('views.connection.preview.dialogs.filter.cancel')}
                </Button>
                <Button
                    onClick={() => onSet(filterStr)}
                    disabled={filterStrErr}
                    variant="contained"
                    color="error"
                >
                    {t('views.connection.preview.dialogs.filter.confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
