import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface RemoveConnectionDiag {
    open: boolean;
    onClose: (proceed: boolean) => void;
}

const RemoveConnectionDialog = (props: RemoveConnectionDiag) => {
    const { open, onClose } = props;

    return (
        <Dialog open={open} onClose={() => onClose(false)}>
            <DialogTitle>Delete this connection?</DialogTitle>
            <DialogContent>
                <DialogContentText>This can not be undone.</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => onClose(false)}
                    variant="contained"
                    autoFocus
                >
                    Cancel
                </Button>
                <Button
                    onClick={() => onClose(true)}
                    variant="contained"
                    color="error"
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RemoveConnectionDialog;
