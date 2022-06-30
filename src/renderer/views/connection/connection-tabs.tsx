import * as React from 'react';
import {
    Link as RouterLink,
    Outlet,
    useLocation,
    useNavigate,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import { updateMetrics, clearMetrics } from '../../redux/metrics';

const ConnectionTabs = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const theme = useTheme();

    const { connections, currentConnection } = useAppSelector(
        (state) => state.connection
    );
    const { connections: previewConnection } = useAppSelector(
        (state) => state.preview
    );
    const dispatch = useAppDispatch();

    // remember the last connection so we can clear the metrics
    // https://blog.logrocket.com/accessing-previous-props-state-react-hooks/
    const prevConnectionRef = React.useRef<string>();
    React.useEffect(() => {
        prevConnectionRef.current = currentConnection;
    }, [currentConnection]);

    // update current connection on each location change
    React.useEffect(() => {
        dispatch(setCurrentConnection(location.pathname.split('/')[2]));

        // The home page has no `setCurrentStream('overview')` on the first click,
        // so set currentTab to 'overview' if the last openedStream is others.
        if (location.pathname.endsWith('overview')) {
            dispatch(setCurrentStream('overview'));
        }
    }, [dispatch, location.pathname]);

    // update the node's currentConnection so that list scopes and streams will
    // return the current connection's result.
    React.useEffect(() => {
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

        // It would be weird to have metrics before T-100 and then user
        // switches to another connection and switches back at T.
        // A gap would be in the data array but we have no way to know it,
        // so just clear the array and record from T.
        if (prevConnectionRef.current)
            dispatch(clearMetrics(prevConnectionRef.current));

        window.electron.pravega.getMetrics((_, name, metrics) => {
            dispatch(updateMetrics({ connection: name, metrics }));
        });
    }, [dispatch, currentConnection]);

    const handleCloseScopedStream = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        scopedStream: string
    ) => {
        window.electron.pravega.cleanReadersAndWriters(
            currentConnection,
            scopedStream.split('/')[0],
            scopedStream.split('/')[1]
        );
        // some clean up
        dispatch(delStream(scopedStream));
        dispatch(
            deletePreview({
                connection: currentConnection,
                scopedStream,
            })
        );
        // redirect to overview, we can do better if we know the last viewed tab
        navigate(`/connection/${currentConnection}/overview`, {
            replace: true,
        });
        // no more redirect to this deleted stream
        e.preventDefault();
    };

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
                        label={t('views.connection.tabs.overview')}
                        value={`/connection/${currentConnection}/overview`}
                        to={`/connection/${currentConnection}/overview`}
                        component={RouterLink}
                        onClick={() => dispatch(setCurrentStream('overview'))}
                        sx={{ color: 'white', WebkitAppRegion: 'no-drag' }}
                    />
                    <Tab
                        label={t('views.connection.tabs.metrics')}
                        value={`/connection/${currentConnection}/metrics`}
                        to={`/connection/${currentConnection}/metrics`}
                        component={RouterLink}
                        onClick={() => dispatch(setCurrentStream('metrics'))}
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
                                            onClick={(e) =>
                                                handleCloseScopedStream(
                                                    e,
                                                    scopedStream
                                                )
                                            }
                                            // hide the space between text and icon
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
                                    // unify the tab height with or with out IconButton
                                    minHeight: 48,
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
