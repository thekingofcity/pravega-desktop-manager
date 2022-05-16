import * as React from 'react';
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

interface AddScopeDialogProps {
    open: boolean;
    onClose: () => void;
    onAdd: (scopeName: string) => Promise<void>;
}

export const AddScopeDialog = (props: AddScopeDialogProps) => {
    const { open, onClose, onAdd } = props;

    const [scopeName, setScopeName] = React.useState('');

    // clear name text field on each open
    React.useEffect(() => setScopeName(''), [open]);

    const handleAdd = async () => {
        await onAdd(scopeName);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Create a new Scope</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Scope Name"
                    value={scopeName}
                    onChange={({ target: { value } }) => setScopeName(value)}
                    variant="outlined"
                    sx={{ width: 400 }}
                />
            </DialogContent>
            <DialogActions sx={{ padding: 3 }}>
                <Button onClick={onClose} variant="contained">
                    Cancel
                </Button>
                <Button
                    onClick={async () => {
                        await handleAdd();
                    }}
                    variant="contained"
                    color="error"
                >
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

interface AddStreamDialogProps {
    open: boolean;
    onClose: () => void;
    onAdd: (streamName: string) => Promise<void>;
}

export const AddStreamDialog = (props: AddStreamDialogProps) => {
    const { open, onClose, onAdd } = props;

    const [streamName, setStreamName] = React.useState('');
    const [retentionPolicy, setRetentionPolicy] = React.useState(
        'none' as 'none' | 'size' | 'time'
    );
    const [scalingPolicy, setScalingPolicy] = React.useState(
        'fixed' as 'fixed' | 'data' | 'event'
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
        await onAdd(streamName);
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
                    label="Stream Name"
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
                        label="Retention Policy"
                        onChange={(e) =>
                            setRetentionPolicy(
                                e.target.value as 'none' | 'size' | 'time'
                            )
                        }
                        select // tell TextField to render select
                        sx={{ width: 150 }} // display the full text
                    >
                        <MenuItem value="none">None</MenuItem>
                        <MenuItem value="size" disabled>
                            By Size
                        </MenuItem>
                        <MenuItem value="time" disabled>
                            By Time
                        </MenuItem>
                    </TextField>
                    <TextField
                        label="Size in bytes"
                        value={retentionValue}
                        onChange={({ target: { value } }) =>
                            setRetentionValue(Number(value.replace(/\D/g, '')))
                        }
                        sx={retentionPolicy !== 'size' ? hidden : {}}
                    />
                    <TextField
                        label="Time in milliseconds"
                        value={retentionValue}
                        onChange={({ target: { value } }) =>
                            setRetentionValue(Number(value.replace(/\D/g, '')))
                        }
                        sx={retentionPolicy !== 'time' ? hidden : {}}
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
                        label="Scaling Policy"
                        onChange={(e) =>
                            setScalingPolicy(
                                e.target.value as 'fixed' | 'data' | 'event'
                            )
                        }
                        select // tell TextField to render select
                        sx={{ width: 150 }} // display the full text
                    >
                        <MenuItem value="fixed">Fixed</MenuItem>
                        <MenuItem value="data" disabled>
                            Auto scale by data rate
                        </MenuItem>
                        <MenuItem value="event" disabled>
                            Auto scale by event rate
                        </MenuItem>
                    </TextField>
                    <TextField
                        label="Initial Segments"
                        value={initialSegments}
                        onChange={({ target: { value } }) =>
                            // setInitialSegments(Number(value.replace(/\D/g, '')))
                            setInitialSegments(1)
                        }
                    />
                    <TextField
                        label="Target kbytes per second"
                        value={scalingValue}
                        onChange={({ target: { value } }) =>
                            setScalingValue(Number(value.replace(/\D/g, '')))
                        }
                        sx={scalingPolicy !== 'data' ? hidden : {}}
                    />
                    <TextField
                        label="Target events per second"
                        value={scalingValue}
                        onChange={({ target: { value } }) =>
                            setScalingValue(Number(value.replace(/\D/g, '')))
                        }
                        sx={scalingPolicy !== 'event' ? hidden : {}}
                    />
                    <TextField
                        label="Scale factor"
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
                    Cancel
                </Button>
                <Button
                    onClick={async () => {
                        await handleAdd();
                    }}
                    variant="contained"
                    color="error"
                >
                    Add
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

    return (
        <Dialog
            open={open}
            onClose={async () => {
                await onClose(false);
            }}
        >
            <DialogTitle>
                {type === 'Scope'
                    ? `Delete ${scope} ?`
                    : `Seal and delete ${scope}/${stream} ?`}
            </DialogTitle>
            <DialogContent>
                {type === 'Scope' && (
                    <DialogContentText>
                        All streams in this scope need to be delete first.
                    </DialogContentText>
                )}
                <DialogContentText>This can not be undone.</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={async () => {
                        await onClose(false);
                    }}
                    variant="contained"
                    autoFocus
                >
                    Cancel
                </Button>
                <Button
                    onClick={async () => {
                        await onClose(true);
                    }}
                    variant="contained"
                    color="error"
                >
                    Delete
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
