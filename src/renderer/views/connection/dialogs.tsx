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
    TextField,
} from '@mui/material';
import { CreateStreamArgumentsExceptFirstTwo } from 'main/types';

interface AddScopeDialogProps {
    open: boolean;
    onClose: () => void;
    onAdd: (scopeName: string) => Promise<void>;
}

export const AddScopeDialog = (props: AddScopeDialogProps) => {
    const { open, onClose, onAdd } = props;
    const { t } = useTranslation();

    const [scopeName, setScopeName] = React.useState('');

    // clear name text field on each open
    React.useEffect(() => setScopeName(''), [open]);

    const handleAdd = async () => {
        await onAdd(scopeName);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                {t('views.connection.overview.dialogs.createScope.title')}
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label={t(
                        'views.connection.overview.dialogs.createScope.scopeName'
                    )}
                    value={scopeName}
                    onChange={({ target: { value } }) => setScopeName(value)}
                    variant="outlined"
                    sx={{ width: 400 }}
                />
            </DialogContent>
            <DialogActions sx={{ padding: 3 }}>
                <Button onClick={onClose} variant="contained">
                    {t('views.connection.overview.dialogs.createScope.cancel')}
                </Button>
                <Button
                    onClick={async () => {
                        await handleAdd();
                    }}
                    variant="contained"
                    color="error"
                >
                    {t('views.connection.overview.dialogs.createScope.confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

interface AddStreamDialogProps {
    open: boolean;
    onClose: () => void;
    onAdd: (...args: CreateStreamArgumentsExceptFirstTwo) => Promise<void>;
}

export const AddStreamDialog = (props: AddStreamDialogProps) => {
    const { open, onClose, onAdd } = props;
    const { t } = useTranslation();

    const [streamName, setStreamName] = React.useState('');
    const [retentionPolicy, setRetentionPolicy] = React.useState(
        'none' as 'none' | 'by_size' | 'by_time'
    );
    const [scalingPolicy, setScalingPolicy] = React.useState(
        'fixed' as 'fixed' | 'by_data_rate' | 'by_event_rate'
    );
    const [retentionValue, setRetentionValue] = React.useState(0);
    const [initialSegments, setInitialSegments] = React.useState(1);
    const [scalingValue, setScalingValue] = React.useState(0);
    const [scaleFactor, setScaleFactor] = React.useState(1);

    // clear inputs on each open
    React.useEffect(() => {
        setStreamName('');
        setRetentionPolicy('none');
        setScalingPolicy('fixed');
        setRetentionValue(0);
        setInitialSegments(1);
        setScalingValue(0);
        setScaleFactor(1);
    }, [open]);

    const handleAdd = async () => {
        await onAdd(
            streamName,
            retentionPolicy,
            retentionValue,
            scalingPolicy,
            scalingValue,
            scaleFactor,
            initialSegments,
            []
        );
        onClose();
    };

    const hidden = { display: 'none' };

    return (
        <Dialog open={open} onClose={onClose} maxWidth={false}>
            <DialogTitle>Create a new Stream</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label={t(
                        'views.connection.overview.dialogs.createStream.streamName'
                    )}
                    value={streamName}
                    onChange={({ target: { value } }) => setStreamName(value)}
                    variant="outlined"
                    sx={{ width: '100%', marginBottom: 2 }}
                />
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginBottom: 2,
                    }}
                >
                    <TextField
                        value={retentionPolicy}
                        label={t(
                            'views.connection.overview.dialogs.createStream.retention.name'
                        )}
                        onChange={(e) =>
                            setRetentionPolicy(
                                e.target.value as 'none' | 'by_size' | 'by_time'
                            )
                        }
                        select // tell TextField to render select
                        sx={{ width: 150 }} // display the full text
                    >
                        <MenuItem value="none">
                            {t(
                                'views.connection.overview.dialogs.createStream.retention.none'
                            )}
                        </MenuItem>
                        <MenuItem value="by_size">
                            {t(
                                'views.connection.overview.dialogs.createStream.retention.size'
                            )}
                        </MenuItem>
                        <MenuItem value="by_time">
                            {t(
                                'views.connection.overview.dialogs.createStream.retention.time'
                            )}
                        </MenuItem>
                    </TextField>
                    <TextField
                        label={t(
                            'views.connection.overview.dialogs.createStream.retention.sizeValue'
                        )}
                        value={retentionValue}
                        onChange={({ target: { value } }) =>
                            setRetentionValue(Number(value.replace(/\D/g, '')))
                        }
                        sx={retentionPolicy !== 'by_size' ? hidden : {}}
                    />
                    <TextField
                        label={t(
                            'views.connection.overview.dialogs.createStream.retention.timeValue'
                        )}
                        value={retentionValue}
                        onChange={({ target: { value } }) =>
                            setRetentionValue(Number(value.replace(/\D/g, '')))
                        }
                        sx={retentionPolicy !== 'by_time' ? hidden : {}}
                    />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginBottom: 2,
                    }}
                >
                    <TextField
                        value={scalingPolicy}
                        label={t(
                            'views.connection.overview.dialogs.createStream.scaling.name'
                        )}
                        onChange={(e) =>
                            setScalingPolicy(
                                e.target.value as
                                    | 'fixed'
                                    | 'by_data_rate'
                                    | 'by_event_rate'
                            )
                        }
                        select // tell TextField to render select
                        sx={{ width: 150 }} // display the full text
                    >
                        <MenuItem value="fixed">
                            {t(
                                'views.connection.overview.dialogs.createStream.scaling.fixed'
                            )}
                        </MenuItem>
                        <MenuItem value="by_data_rate">
                            {t(
                                'views.connection.overview.dialogs.createStream.scaling.data'
                            )}
                        </MenuItem>
                        <MenuItem value="by_event_rate">
                            {t(
                                'views.connection.overview.dialogs.createStream.scaling.event'
                            )}
                        </MenuItem>
                    </TextField>
                    <TextField
                        label={t(
                            'views.connection.overview.dialogs.createStream.scaling.initialSegments'
                        )}
                        value={initialSegments}
                        onChange={({ target: { value } }) =>
                            setInitialSegments(Number(value.replace(/\D/g, '')))
                        }
                    />
                    <TextField
                        label={t(
                            'views.connection.overview.dialogs.createStream.scaling.dataValue'
                        )}
                        value={scalingValue}
                        onChange={({ target: { value } }) =>
                            setScalingValue(Number(value.replace(/\D/g, '')))
                        }
                        sx={scalingPolicy !== 'by_data_rate' ? hidden : {}}
                    />
                    <TextField
                        label={t(
                            'views.connection.overview.dialogs.createStream.scaling.eventValue'
                        )}
                        value={scalingValue}
                        onChange={({ target: { value } }) =>
                            setScalingValue(Number(value.replace(/\D/g, '')))
                        }
                        sx={scalingPolicy !== 'by_event_rate' ? hidden : {}}
                    />
                    <TextField
                        label={t(
                            'views.connection.overview.dialogs.createStream.scaling.scaleFactor'
                        )}
                        value={scaleFactor}
                        onChange={({ target: { value } }) =>
                            setScaleFactor(Number(value.replace(/\D/g, '')))
                        }
                        sx={scalingPolicy === 'fixed' ? hidden : {}}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ padding: 3 }}>
                <Button onClick={onClose} variant="contained">
                    {t('views.connection.overview.dialogs.createStream.cancel')}
                </Button>
                <Button
                    onClick={async () => {
                        await handleAdd();
                    }}
                    variant="contained"
                    color="error"
                >
                    {t(
                        'views.connection.overview.dialogs.createStream.confirm'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

interface RemoveScopeOrStreamDiag {
    open: boolean;
    type: 'Scope' | 'Stream';
    scope: string;
    stream?: string;
    onClose: (proceed: boolean) => Promise<void>;
}

export const RemoveScopeOrStreamDialog = (props: RemoveScopeOrStreamDiag) => {
    const { open, type, scope, stream, onClose } = props;
    const { t } = useTranslation();

    return (
        <Dialog
            open={open}
            onClose={async () => {
                await onClose(false);
            }}
        >
            <DialogTitle>
                {type === 'Scope'
                    ? t('views.connection.overview.dialogs.delete.titleScope', {
                          scope,
                      })
                    : t(
                          'views.connection.overview.dialogs.delete.titleStream',
                          { scope, stream }
                      )}
            </DialogTitle>
            <DialogContent>
                {type === 'Scope' && (
                    <DialogContentText>
                        {t('views.connection.overview.dialogs.delete.content1')}
                    </DialogContentText>
                )}
                <DialogContentText>
                    {t('views.connection.overview.dialogs.delete.content2')}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={async () => {
                        await onClose(false);
                    }}
                    variant="contained"
                    autoFocus
                >
                    {t('views.connection.overview.dialogs.delete.cancel')}
                </Button>
                <Button
                    onClick={async () => {
                        await onClose(true);
                    }}
                    variant="contained"
                    color="error"
                >
                    {t('views.connection.overview.dialogs.delete.confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// Fix ESLint error: propType "icon" is not required, but has no corresponding
// defaultProps declaration. (react/require-default-props)
RemoveScopeOrStreamDialog.defaultProps = {
    stream: '',
};
