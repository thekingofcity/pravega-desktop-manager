import * as React from 'react';
import {
    MemoryRouter as Router,
    Routes,
    Route,
    useLocation,
    Outlet,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import MaximizeIcon from '@mui/icons-material/Maximize';
import MinimizeIcon from '@mui/icons-material/Minimize';
import SideBar from './sidebar/sidebar';
import ConnectionTabs from './views/connection/connection-tabs';
import Connection from './views/connection/overview';
import DetailedMetrics from './views/connection/detailed-metrics';
import PreviewStream from './views/connection/preview/preview-stream';
import Deployment from './views/deployment';
import Explore from './views/explore';
import Settings from './views/settings';
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

const Home = () => {
    const { t } = useTranslation();
    return (
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
                <Typography
                    variant="h5"
                    align="center"
                    sx={{ marginBottom: 6 }}
                >
                    {t('home')}
                </Typography>
            </Box>
        </>
    );
};

const NotFound = () => {
    const location = useLocation();
    const { t } = useTranslation();
    return (
        <>
            <p>
                {t('notfound')} {location.pathname}
            </p>
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
