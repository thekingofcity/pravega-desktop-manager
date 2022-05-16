import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

interface AddConnectionDialogProps {
    open: boolean;
    onClose: () => void;
    onAdd: (name: string, url: string) => void;
}

const AddConnectionDialog = (props: AddConnectionDialogProps) => {
    const { open, onClose, onAdd } = props;

    const [name, setName] = React.useState('pravega1');
    const [mode, setMode] = React.useState('tcp://');
    const modes = [
        { value: 'tcp://', label: 'TCP' },
        { value: 'udp://', label: 'UDP' },
    ];
    const [url, setUrl] = React.useState('127.0.0.1');
    const [port, setPort] = React.useState('9090');

    const handleAdd = () => {
        onAdd(
            name !== '' ? name : crypto.randomUUID(),
            `${mode}${url}:${port}`
        );
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add a new connection</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Name"
                    value={name}
                    onChange={({ target: { value } }) => setName(value)}
                    variant="outlined"
                    fullWidth
                />
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <TextField
                        select
                        required
                        label="Protocol"
                        value={mode}
                        margin="dense"
                        onChange={(e) => setMode(e.target.value)}
                        sx={{ width: 150 }}
                    >
                        {modes.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        label="Url"
                        value={url}
                        onChange={({ target: { value } }) => setUrl(value)}
                        variant="outlined"
                        fullWidth
                    />
                    <TextField
                        required
                        margin="dense"
                        label="Port"
                        value={port}
                        onChange={({ target: { value } }) =>
                            setPort(value.replace(/\D/g, ''))
                        }
                        variant="outlined"
                        sx={{ width: 150 }}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ padding: 3 }}>
                <Button onClick={onClose} variant="contained">
                    Cancel
                </Button>
                <Button onClick={handleAdd} variant="contained" color="error">
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddConnectionDialog;
