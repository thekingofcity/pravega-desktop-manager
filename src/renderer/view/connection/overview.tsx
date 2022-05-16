import * as React from 'react';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Typography,
} from '@mui/material';
import { useAppSelector } from '../../redux/store';
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
                <Typography marginBottom={1.5} color="text.secondary">
                    {connections[currentConnection].url}
                </Typography>
            </CardContent>
        </Card>
    );
};

const Metrics = (props: { metrics: { [name: string]: string } }) => {
    const { metrics } = props;

    return (
        <Card variant="outlined" sx={{ margin: 1 }}>
            <CardContent>
                <Typography variant="h5" component="div" marginBottom={2}>
                    Metrics
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Metrics are not available in this release.
                </Typography>
                {Object.entries(metrics).map(([key, value]) => (
                    <Typography variant="body2" marginBottom={0.5} key={key}>
                        {key}: {value}
                    </Typography>
                ))}
            </CardContent>
            <CardActions>
                <Button size="small">
                    Learn how to expose Pravega metrics
                </Button>
            </CardActions>
        </Card>
    );
};

const Connection = () => {
    const size: Size = useWindowSize();

    const metrics = {
        'Segment Store global read bytes': '0',
        'Segment Store global write bytes': '0',
        'Segment Store current stream read bytes': '0',
        'Segment Store current stream write bytes': '0',
        'Segment Store cache read bytes': '0',
        'Segment Store cache write bytes': '0',
        'Tier 1 Durable Data Log write latency': '0ms',
        'Tier 1 Durable Data Log write bytes': '0',
        'Tier 2 Storage read latency': '0ms',
        'Tier 2 Storage write latency': '0ms',
        'Tier 2 Storage read bytes': '0',
        'Tier 2 Storage write bytes': '0',
        'Tier 2 Storage created files': '0',
    };

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
                    <Metrics metrics={metrics} />
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
