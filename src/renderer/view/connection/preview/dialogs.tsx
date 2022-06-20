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
    Switch,
    TextField,
} from '@mui/material';

interface AdvancedReadDialogProps {
    open: boolean;
    onClose: () => void;
    onSet: (
        streamCut: 'head' | 'tail' | string,
        automaticRead: boolean
    ) => void;
}

const AdvancedReadDialog = (props: AdvancedReadDialogProps) => {
    const { open, onClose, onSet } = props;

    const [streamCut, setStreamCut] = React.useState(
        'tail' as 'head' | 'tail' | 'streamcut'
    );
    const [streamCutData, setStreamCutData] = React.useState('');
    const [automaticRead, setAutomaticRead] = React.useState(true);

    // clear name text field on each open
    React.useEffect(() => {
        setStreamCut('tail');
        setStreamCutData('');
        setAutomaticRead(true);
    }, [open]);

    // const handleSet = async () => {
    //     onSet(streamCut, automaticRead);
    //     onClose();
    // };

    return (
        <Dialog
            open={open}
            onClose={(_, reason) => {
                // no close except SET button
                if (reason === 'backdropClick') return;
                onClose();
            }}
        >
            <DialogTitle>Advanced read options</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Where would you like to read from?
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
                        label="Position"
                        onChange={(e) =>
                            setStreamCut(
                                e.target.value as 'head' | 'tail' | 'streamcut'
                            )
                        }
                        select // tell TextField to render select
                        sx={{ width: 100 }} // display the full text
                    >
                        <MenuItem value="head">Head</MenuItem>
                        <MenuItem value="tail">Tail</MenuItem>
                        <MenuItem value="streamcut" disabled>
                            Stream Cut
                        </MenuItem>
                    </TextField>
                    <TextField
                        label="Specified Stream Cut"
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
                        Start read automatically?
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
                    Set
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AdvancedReadDialog;
