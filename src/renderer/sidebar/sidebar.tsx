import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import {
    Collapse,
    Divider,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import StorageIcon from '@mui/icons-material/Storage';
import DownloadIcon from '@mui/icons-material/Download';
import ExploreIcon from '@mui/icons-material/Explore';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAppSelector, useAppDispatch } from '../redux/store';
import {
    addConnection,
    delConnection,
    editConnection,
    setCurrentConnection,
} from '../redux/connection';
import { useWindowSize, Size } from '../utils';
import ListItemLink from './list-item-link';
import ListItemConnection from './list-item-connection';
import AddConnectionDialog from './add-connection-dialog';
import EditConnectionDialog from './edit-connection-dialog';
import RemoveConnectionDialog from './remove-connection-dialog';
import pravegaLogo from '../../../assets/Pravega_logo_white-1.png';

const SideBar = () => {
    const navigate = useNavigate();

    // local ui state
    const size: Size = useWindowSize();
    const [selectedConnection, setSelectedConnection] = React.useState('');

    const [open, setOpen] = React.useState(true);
    const handleExpandConnection = () => {
        setOpen(!open);
    };

    const [isAddConnOpen, setIsAddConnOpen] = React.useState(false);
    const [isEditConnOpen, setIsEditConnOpen] = React.useState(false);
    const [isRemoveConnOpen, setIsRemoveConnOpen] = React.useState(false);

    // global param state
    const { connections, currentConnection } = useAppSelector(
        (state) => state.connection
    );
    const dispatch = useAppDispatch();

    const handleAddConnection = (name: string, url: string) => {
        const id = nanoid();
        dispatch(addConnection({ id, name, url }));
        // TODO: a bit wired, only need to set current from 0 to 1
        dispatch(setCurrentConnection(id));
    };
    const handleEditConnection = (id: string, name: string, url: string) => {
        dispatch(editConnection({ id, name, url }));
    };
    const handleDeleteConnection = (id: string) => {
        dispatch(delConnection(id));
    };

    return (
        <>
            <img
                src={pravegaLogo}
                alt="Pravega logo"
                width={210}
                // @ts-expect-error
                style={{ padding: 10, WebkitAppRegion: 'drag' }}
            />
            <List
                sx={{
                    bottom: 0,
                    position: 'fixed',
                    margin: 0,
                    color: 'white',
                    maxWidth: 230,
                }}
            >
                <ListItemButton onClick={handleExpandConnection}>
                    <ListItemIcon sx={{ minWidth: 50, color: 'white' }}>
                        <StorageIcon fontSize="large" />
                    </ListItemIcon>
                    <ListItemText primary="Connection" />
                    <IconButton
                        onClick={(e) => {
                            setIsAddConnOpen(true);
                            // don't bubble the event to the parent ListItemButton
                            e.stopPropagation();
                        }}
                    >
                        <AddIcon sx={{ color: 'white' }} />
                    </IconButton>
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <AddConnectionDialog
                    open={isAddConnOpen}
                    onClose={() => setIsAddConnOpen(false)}
                    onAdd={handleAddConnection}
                />
                <EditConnectionDialog
                    open={isEditConnOpen}
                    onClose={() => setIsEditConnOpen(false)}
                    onEdit={handleEditConnection}
                    selectedConnection={selectedConnection}
                />
                <RemoveConnectionDialog
                    open={isRemoveConnOpen}
                    onClose={(proceed: boolean) => {
                        if (proceed) {
                            handleDeleteConnection(selectedConnection);
                            navigate('/', { replace: true });
                        }
                        setIsRemoveConnOpen(false);
                    }}
                />
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List
                        sx={{
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            height: (size.height ?? 720) - 361,
                        }}
                    >
                        {Object.entries(connections).map(([id, conn]) => (
                            <ListItemConnection
                                key={id}
                                id={id}
                                to={`/connection/${id}/overview`}
                                name={conn.name}
                                selected={id === currentConnection}
                                setEditDialog={(selectedConn: string) => {
                                    setSelectedConnection(selectedConn);
                                    setIsEditConnOpen(true);
                                }}
                                setDeleteDialog={(selectedConn: string) => {
                                    setSelectedConnection(selectedConn);
                                    setIsRemoveConnOpen(true);
                                }}
                            />
                        ))}
                    </List>
                </Collapse>

                <Divider sx={{ background: 'white' }} />
                <ListItemLink
                    to="/deployment"
                    primary="Deployment"
                    icon={
                        <DownloadIcon
                            fontSize="large"
                            sx={{ color: 'white' }}
                        />
                    }
                />
                <ListItemLink
                    to="/explore"
                    primary="Explore"
                    icon={
                        <ExploreIcon fontSize="large" sx={{ color: 'white' }} />
                    }
                />
                <ListItemLink
                    to="/settings"
                    primary="Settings"
                    icon={
                        <SettingsIcon
                            fontSize="large"
                            sx={{ color: 'white' }}
                        />
                    }
                />
            </List>
        </>
    );
};

export default SideBar;
