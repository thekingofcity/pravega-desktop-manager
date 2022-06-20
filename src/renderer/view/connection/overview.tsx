import * as React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { useAppSelector } from '../../redux/store';
import Metrics from './metrics';
import ScopesAndStreamsNavigator from './scopes-and-streams-navigator';
import { useWindowSize, Size } from '../../utils';

const Details = () => {
    const { connections, currentConnection } = useAppSelector(
        (state) => state.connection
    );

    React.useEffect(() => {
        window.electron.pravega.newPravega(
            currentConnection,
            connections[currentConnection].url
        );
    }, [connections, currentConnection]);

    return (
        <Card variant="outlined" sx={{ margin: 1 }}>
            <CardContent>
                <Typography
                    variant="h5"
                    component="div"
                    textTransform="capitalize"
                >
                    {connections[currentConnection].name}
                </Typography>
                <Typography color="text.secondary">
                    {connections[currentConnection].url}
                </Typography>
            </CardContent>
        </Card>
    );
};

const Connection = () => {
    const size: Size = useWindowSize();

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: 400,
                        minWidth: 400,
                    }}
                >
                    <Details />
                    <Metrics />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                    }}
                >
                    <ScopesAndStreamsNavigator height={size.height ?? 720} />
                </Box>
            </Box>
        </>
    );
};

export default Connection;
