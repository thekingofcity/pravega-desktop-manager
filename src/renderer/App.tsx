import * as React from 'react';
import {
    MemoryRouter as Router,
    Routes,
    Route,
    useLocation,
    Outlet,
} from 'react-router-dom';
import { Box, IconButton, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import MaximizeIcon from '@mui/icons-material/Maximize';
import MinimizeIcon from '@mui/icons-material/Minimize';
import SideBar from './sidebar/sidebar';
import ConnectionTabs from './view/connection/connection-tabs';
import Connection from './view/connection/overview';
import DetailedMetrics from './view/connection/detailed-metrics/detailed-metrics';
import PreviewStream from './view/connection/preview/preview-stream';
import Deployment from './view/deployment';
import Explore from './view/explore';
import Settings from './view/settings';
import './scrollbar.css';
import './status.css';

const theme = createTheme({
    palette: {
        background: {
            default: '#1989c4',
        },
        text: {
            primary: '#000',
            secondary: '#46505A',
        },
    },
});

const Home = () => (
    <>
        <Box
            sx={{
                top: 0,
                width: '100%',
                height: 40,
                background: theme.palette.background.default,
                WebkitAppRegion: 'drag',
            }}
        />
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Typography variant="h5" align="center" sx={{ marginBottom: 6 }}>
                You may add or choose a Pravega connection in the left sidebar
            </Typography>
        </Box>
    </>
);

const NotFound = () => {
    const location = useLocation();
    return (
        <>
            <p>Nothing here. Current route: {location.pathname}</p>
        </>
    );
};

export default function App() {
    return (
        <Router initialEntries={['/']}>
            <Box
                sx={{ display: 'flex', flexDirection: 'row', height: '100vh' }}
            >
                <ThemeProvider theme={theme}>
                    <Box
                        sx={{
                            width: '230px',
                            backgroundColor: theme.palette.background.default,
                            verticalAlign: 'bottom',
                        }}
                    >
                        <SideBar />
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="connection" element={<Outlet />}>
                                <Route
                                    path=":name"
                                    element={<ConnectionTabs />}
                                >
                                    <Route path=":scope" element={<Outlet />}>
                                        <Route
                                            path=":stream"
                                            element={<PreviewStream />}
                                        />
                                    </Route>
                                    <Route
                                        path="metrics"
                                        element={<DetailedMetrics />}
                                    />
                                    <Route
                                        path="overview"
                                        element={<Connection />}
                                    />
                                </Route>
                            </Route>
                            <Route path="deployment" element={<Deployment />} />
                            <Route path="explore" element={<Explore />} />
                            <Route path="settings" element={<Settings />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Box>
                    <Box
                        sx={{
                            position: 'fixed',
                            right: 0,
                            top: 0,
                            background: theme.palette.background.default,
                            WebkitAppRegion: 'no-drag',
                        }}
                    >
                        <IconButton
                            onClick={window.electron.ipcRenderer.minimizeWindow}
                        >
                            <MinimizeIcon sx={{ color: 'white' }} />
                        </IconButton>
                        <IconButton
                            onClick={window.electron.ipcRenderer.maximizeWindow}
                        >
                            <MaximizeIcon sx={{ color: 'white' }} />
                        </IconButton>
                        <IconButton
                            onClick={window.electron.ipcRenderer.closeWindow}
                        >
                            <CloseIcon sx={{ color: 'white' }} />
                        </IconButton>
                    </Box>
                </ThemeProvider>
            </Box>
        </Router>
    );
}
