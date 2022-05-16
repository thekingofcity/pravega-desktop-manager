import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { useAppSelector } from '../redux/store';

interface EditConnectionDialogProps {
    open: boolean;
    onClose: () => void;
    onEdit: (id: string, name: string, url: string) => void;
    selectedConnection: string;
}

const EditConnectionDialog = (props: EditConnectionDialogProps) => {
    const { open, onClose, onEdit, selectedConnection } = props;

    const { connections } = useAppSelector((state) => state.connection);

    const { name: oldName, url: oldUrl } = connections[selectedConnection] ?? {
        name: '',
        url: 'tcp://127.0.0.1:9090',
    };

    const [name, setName] = React.useState(oldName);
    const [mode, setMode] = React.useState(
        oldUrl.startsWith('tcp') ? 'tcp://' : 'udp://'
    );
    const modes = [
        { value: 'tcp://', label: 'TCP' },
        { value: 'udp://', label: 'UDP' },
    ];
    const [ip, setIp] = React.useState(
        (oldUrl.split(':').at(1) ?? '').substring(2)
    );
    const [port, setPort] = React.useState(
        Number(oldUrl.split(':').at(-1)) ?? 9090
    );

    React.useEffect(() => {
        setName(oldName);
    }, [oldName]);
    React.useEffect(() => {
        setMode(oldUrl.startsWith('tcp') ? 'tcp://' : 'udp://');
        setIp((oldUrl.split(':').at(1) ?? '').substring(2));
        setPort(Number(oldUrl.split(':').at(-1)) ?? 9090);
    }, [oldUrl]);

    const handleEdit = () => {
        onEdit(selectedConnection, name, `${mode}${ip}:${port}`);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit this connection</DialogTitle>
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
                        label="IP"
                        value={ip}
                        onChange={({ target: { value } }) => setIp(value)}
                        variant="outlined"
                        fullWidth
                    />
                    <TextField
                        required
                        margin="dense"
                        label="Port"
                        value={port}
                        onChange={({ target: { value } }) =>
                            setPort(Number(value.replace(/\D/g, '')))
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
                <Button onClick={handleEdit} variant="contained" color="error">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditConnectionDialog;
