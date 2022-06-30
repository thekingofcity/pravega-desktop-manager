import * as React from 'react';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
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
                <CardHeader title={t('views.explore.cdc.title')} />
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
                                {t('views.explore.cdc.content1')}
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
                                {t('views.explore.cdc.content2')}
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
                                {t('views.explore.cdc.content3')}
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
                                            'https://github.com/pravega/pravega-samples/tree/master/scenarios/change-data-capture',
                                            '_blank'
                                        )
                                    }
                                >
                                    {t('views.explore.cdc.action')}
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
