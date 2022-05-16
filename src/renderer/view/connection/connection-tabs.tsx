import * as React from 'react';
import {
    Link as RouterLink,
    Outlet,
    useLocation,
    useNavigate,
} from 'react-router-dom';
import { Box, IconButton, Tab, Tabs } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { useAppSelector, useAppDispatch } from '../../redux/store';
import {
    delStream,
    setCurrentConnection,
    setCurrentStream,
} from '../../redux/connection';
import { updateAvailableStreams, deletePreview } from '../../redux/preview';

const ConnectionTabs = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();

    const { connections, currentConnection } = useAppSelector(
        (state) => state.connection
    );
    const { connections: previewConnection } = useAppSelector(
        (state) => state.preview
    );
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        dispatch(setCurrentConnection(location.pathname.split('/')[2]));

        // The home page has no `setCurrentStream('overview')` on the first click,
        // so set currentTab to 'overview' if the last openedStream is others.
        if (location.pathname.endsWith('overview')) {
            dispatch(setCurrentStream('overview'));
        }
    }, [dispatch, location.pathname]);

    React.useEffect(() => {
        // update the node's currentConnection so that list scopes and streams will
        // return the current connection's result.
        window.electron.pravega.listScopesAndStreams(
            (_, name, scopeWithStreams) => {
                dispatch(
                    updateAvailableStreams({
                        connection: name,
                        availableStreams: scopeWithStreams,
                    })
                );
            },
            currentConnection
        );
    }, [dispatch, currentConnection]);

    const currentTab = `/connection/${currentConnection}/${connections[currentConnection].currentTab}`;

    return (
        <>
            <Box
                sx={{
                    backgroundColor: theme.palette.background.default,
                    WebkitAppRegion: 'drag',
                }}
            >
                <Tabs
                    value={currentTab}
                    variant="scrollable"
                    scrollButtons="auto"
                    indicatorColor="secondary"
                    textColor="inherit"
                    sx={{ color: 'white' }}
                >
                    <Tab
                        label="Overview"
                        value={`/connection/${currentConnection}/overview`}
                        to={`/connection/${currentConnection}/overview`}
                        component={RouterLink}
                        onClick={() => dispatch(setCurrentStream('overview'))}
                        sx={{ color: 'white', WebkitAppRegion: 'no-drag' }}
                    />
                    {connections[currentConnection].openedStreams.map(
                        (scopedStream) => (
                            <Tab
                                key={scopedStream}
                                label={scopedStream}
                                value={`/connection/${currentConnection}/${scopedStream}`}
                                to={`/connection/${currentConnection}/${scopedStream}`}
                                icon={
                                    <>
                                        {
                                            // indicate a warning sign when this scopedStream does not exist
                                            !previewConnection?.[
                                                currentConnection
                                            ]?.availableStreams?.[
                                                scopedStream.split('/')[0]
                                            ]?.includes(
                                                scopedStream.split('/')[1]
                                            ) && (
                                                <PriorityHighIcon
                                                    sx={{ color: 'white' }}
                                                />
                                            )
                                        }
                                        <IconButton
                                            onClick={(e) => {
                                                dispatch(
                                                    delStream(scopedStream)
                                                );
                                                dispatch(
                                                    deletePreview({
                                                        connection:
                                                            currentConnection,
                                                        scopedStream,
                                                    })
                                                );
                                                navigate(
                                                    `/connection/${currentConnection}/overview`,
                                                    { replace: true }
                                                );
                                                // no more redirect to this deleted stream
                                                e.preventDefault();
                                            }}
                                            sx={{ padding: 0 }}
                                        >
                                            <CloseIcon
                                                sx={{ color: 'white' }}
                                                fontSize="small"
                                            />
                                        </IconButton>
                                    </>
                                }
                                iconPosition="end"
                                component={RouterLink}
                                sx={{
                                    color: 'white',
                                    WebkitAppRegion: 'no-drag',
                                }}
                            />
                        )
                    )}
                </Tabs>
            </Box>
            <Outlet />
        </>
    );
};

export default ConnectionTabs;
