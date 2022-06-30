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
    List,
    ListItem,
    ListItemText,
    Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ComputerIcon from '@mui/icons-material/Computer';
import CloudIcon from '@mui/icons-material/Cloud';

const Deployment = () => {
    const { t } = useTranslation();
    const theme = useTheme();

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
                    flexDirection: 'row',
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box>
                    <Typography
                        variant="h5"
                        align="center"
                        sx={{ marginBottom: 6 }}
                    >
                        {t('views.deployment.title')}
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Box
                                sx={{
                                    alignSelf: 'center',
                                    display: 'flex',
                                    flexDirection: 'row',
                                }}
                            >
                                <ComputerIcon sx={{ marginRight: 2 }} />
                                <Typography
                                    variant="h5"
                                    sx={{ marginBottom: 3 }}
                                >
                                    {t('views.deployment.local')}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                }}
                            >
                                <Card
                                    variant="outlined"
                                    sx={{ margin: 1, width: 300, height: 350 }}
                                >
                                    <CardHeader
                                        title={t(
                                            'views.deployment.standalone.title'
                                        )}
                                    />
                                    <CardContent>
                                        <Typography
                                            variant="body2"
                                            gutterBottom
                                        >
                                            {t(
                                                'views.deployment.standalone.content1'
                                            )}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            gutterBottom
                                        >
                                            {t(
                                                'views.deployment.standalone.content2'
                                            )}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <List sx={{ width: '100%' }}>
                                            <ListItem sx={{ padding: 1 }}>
                                                <ListItemText
                                                    primaryTypographyProps={{
                                                        variant: 'body2',
                                                    }}
                                                >
                                                    {t(
                                                        'views.deployment.standalone.step1'
                                                    )}
                                                </ListItemText>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    disabled
                                                >
                                                    {t(
                                                        'views.deployment.standalone.status1'
                                                    )}
                                                </Button>
                                            </ListItem>
                                            <ListItem sx={{ padding: 1 }}>
                                                <ListItemText
                                                    primaryTypographyProps={{
                                                        variant: 'body2',
                                                    }}
                                                >
                                                    {t(
                                                        'views.deployment.standalone.step2'
                                                    )}
                                                </ListItemText>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    disabled
                                                >
                                                    {t(
                                                        'views.deployment.standalone.status2'
                                                    )}
                                                </Button>
                                            </ListItem>
                                            <ListItem sx={{ padding: 1 }}>
                                                <ListItemText
                                                    primaryTypographyProps={{
                                                        variant: 'body2',
                                                    }}
                                                >
                                                    {t(
                                                        'views.deployment.standalone.step3'
                                                    )}
                                                </ListItemText>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    disabled
                                                >
                                                    {t(
                                                        'views.deployment.standalone.status3'
                                                    )}
                                                </Button>
                                            </ListItem>
                                        </List>
                                    </CardActions>
                                </Card>
                                <Card
                                    variant="outlined"
                                    sx={{ margin: 1, width: 300, height: 350 }}
                                >
                                    <CardHeader
                                        title={t(
                                            'views.deployment.dockerCompose.title'
                                        )}
                                    />
                                    <CardContent>
                                        <Typography
                                            variant="body2"
                                            gutterBottom
                                        >
                                            {t(
                                                'views.deployment.dockerCompose.content1'
                                            )}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            gutterBottom
                                        >
                                            {t(
                                                'views.deployment.dockerCompose.content2'
                                            )}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <List sx={{ width: '100%' }}>
                                            <ListItem sx={{ padding: 1 }}>
                                                <ListItemText
                                                    primaryTypographyProps={{
                                                        variant: 'body2',
                                                    }}
                                                >
                                                    {t(
                                                        'views.deployment.dockerCompose.step1'
                                                    )}
                                                </ListItemText>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    disabled
                                                >
                                                    {t(
                                                        'views.deployment.dockerCompose.status1'
                                                    )}
                                                </Button>
                                            </ListItem>
                                            <ListItem sx={{ padding: 1 }}>
                                                <ListItemText
                                                    primaryTypographyProps={{
                                                        variant: 'body2',
                                                    }}
                                                >
                                                    {t(
                                                        'views.deployment.dockerCompose.step2'
                                                    )}
                                                </ListItemText>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    disabled
                                                >
                                                    {t(
                                                        'views.deployment.dockerCompose.status2'
                                                    )}
                                                </Button>
                                            </ListItem>
                                        </List>
                                    </CardActions>
                                </Card>
                            </Box>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Box
                                sx={{
                                    alignSelf: 'center',
                                    display: 'flex',
                                    flexDirection: 'row',
                                }}
                            >
                                <CloudIcon sx={{ marginRight: 2 }} />
                                <Typography
                                    variant="h5"
                                    sx={{ marginBottom: 3 }}
                                >
                                    {t('views.deployment.remote')}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                }}
                            >
                                <Card
                                    variant="outlined"
                                    sx={{ margin: 1, width: 300, height: 350 }}
                                >
                                    <CardHeader
                                        title={t(
                                            'views.deployment.cluster.title'
                                        )}
                                    />
                                    <CardContent>
                                        <Typography
                                            variant="body2"
                                            gutterBottom
                                        >
                                            {t(
                                                'views.deployment.cluster.content1'
                                            )}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            gutterBottom
                                        >
                                            {t(
                                                'views.deployment.cluster.content2'
                                            )}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            gutterBottom
                                        >
                                            {t(
                                                'views.deployment.cluster.content3'
                                            )}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            disabled
                                        >
                                            {t(
                                                'views.deployment.cluster.action'
                                            )}
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default Deployment;
