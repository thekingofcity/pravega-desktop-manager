import * as React from 'react';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import debeziumLogo from '../../../assets/color_white_debezium_type_600px.svg';
import pravegaLogo from '../../../assets/Pravega_logo.png';
import flinkLogo from '../../../assets/flink-header-logo.svg';
import kibanaLogo from '../../../assets/logo-kibana-32-color.svg';

const Explore = () => {
    const theme = useTheme();

    return (
        <Box>
            <Box
                sx={{
                    top: 0,
                    width: '100%',
                    height: 40,
                    background: theme.palette.background.default,
                    WebkitAppRegion: 'drag',
                }}
            />
            <Card
                variant="outlined"
                sx={{ margin: 1, width: 'calc(100% - 226)', height: 300 }}
            >
                <CardHeader title="Change Data Capture" />
                <CardContent>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                        }}
                    >
                        <Box
                            sx={{
                                width: 'calc(calc(100%-226) / 4)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <img
                                src={debeziumLogo}
                                alt="Debezium logo"
                                width={115}
                                style={{ margin: 10 }}
                            />
                            <Typography variant="h5" gutterBottom>
                                Debezium
                            </Typography>
                            <Typography
                                variant="body2"
                                align="center"
                                gutterBottom
                            >
                                Change logs are pulled from database and ingest
                                to Pravega.
                            </Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box
                            sx={{
                                width: 'calc(calc(100%-226) / 4)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <img
                                src={pravegaLogo}
                                alt="Pravega logo"
                                width={108}
                                style={{ margin: 10 }}
                            />
                            <Typography variant="h5" gutterBottom>
                                Pravega
                            </Typography>
                            <Typography
                                variant="body2"
                                align="center"
                                gutterBottom
                            >
                                Process the change logs as streaming events and
                                persist.
                            </Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box
                            sx={{
                                width: 'calc(calc(100%-226) / 4)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                margin: 1,
                            }}
                        >
                            <img
                                src={flinkLogo}
                                alt="Flink logo"
                                width={180}
                                style={{ margin: 10 }}
                            />
                            <Typography variant="h5" gutterBottom>
                                Flink
                            </Typography>
                            <Typography
                                variant="body2"
                                align="center"
                                gutterBottom
                            >
                                Analyze the change logs and rebuild the
                                materialized view with Flink.
                            </Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box
                            sx={{
                                width: 'calc(calc(100%-226) / 4)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <CardActions>
                                <Button
                                    size="small"
                                    variant="contained"
                                    onClick={() =>
                                        window.open(
                                            'https://github.com/pravega/pravega-samples/pull/312',
                                            '_blank'
                                        )
                                    }
                                >
                                    See Instructions
                                </Button>
                            </CardActions>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Explore;
