import * as React from 'react';
import {
    Link as RouterLink,
    LinkProps as RouterLinkProps,
} from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface ListItemConnectionProps {
    id: string;
    name: string;
    to: string;
    selected: boolean;
    setEditDialog: (selectedConnection: string) => void;
    setDeleteDialog: (selectedConnection: string) => void;
}

const ListItemConnection = (props: ListItemConnectionProps) => {
    const { id, name, to, selected, setEditDialog, setDeleteDialog } = props;

    const renderLink = React.useMemo(
        () =>
            React.forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, 'to'>>(
                function Link(itemProps, ref) {
                    return (
                        <RouterLink
                            to={to}
                            ref={ref}
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...itemProps}
                            role={undefined}
                        />
                    );
                }
            ),
        [to]
    );

    return (
        <li>
            <ListItemButton
                component={renderLink}
                selected={selected}
                sx={{ paddingLeft: 5 }}
            >
                {/* <div className={`status ${status}`} /> */}
                <ListItemText primary={name} sx={{ overflowX: 'hidden' }} />
                <EditIcon
                    onClick={(e) => {
                        setEditDialog(id);
                        // no navigate to this connection view, only pop up the diag
                        e.preventDefault();
                    }}
                    sx={{
                        fontSize: 'inherit',
                        minWidth: 30,
                    }}
                />
                <DeleteIcon
                    onClick={(e) => {
                        setDeleteDialog(id);
                        // no navigate to this connection view, only pop up the diag
                        e.preventDefault();
                    }}
                    sx={{
                        fontSize: 'inherit',
                        minWidth: 30,
                    }}
                />
            </ListItemButton>
        </li>
    );
};

export default ListItemConnection;
