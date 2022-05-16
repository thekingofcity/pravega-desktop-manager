import * as React from 'react';
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
                        Pravega is available in the following environments
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
                                    Local
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
                                    <CardHeader title="Standalone" />
                                    <CardContent>
                                        <Typography
                                            variant="body2"
                                            gutterBottom
                                        >
                                            Standalone provides a simple way to
                                            play with Pravega.
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            gutterBottom
                                        >
                                            But the data will be lost after
                                            restart since they are stored in the
                                            memory.
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
                                                    1. Java 11+
                                                </ListItemText>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    disabled
                                                >
                                                    Detected
                                                </Button>
                                            </ListItem>
                                            <ListItem sx={{ padding: 1 }}>
                                                <ListItemText
                                                    primaryTypographyProps={{
                                                        variant: 'body2',
                                                    }}
                                                >
                                                    2. Pravega installed
                                                </ListItemText>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    disabled
                                                >
                                                    Installed
                                                </Button>
                                            </ListItem>
                                            <ListItem sx={{ padding: 1 }}>
                                                <ListItemText
                                                    primaryTypographyProps={{
                                                        variant: 'body2',
                                                    }}
                                                >
                                                    3. Pravega running
                                                </ListItemText>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    disabled
                                                >
                                                    Running
                                                </Button>
                                            </ListItem>
                                        </List>
                                    </CardActions>
                                </Card>
                                <Card
                                    variant="outlined"
                                    sx={{ margin: 1, width: 300, height: 350 }}
                                >
                                    <CardHeader title="Docker Compose" />
                                    <CardContent>
                                        <Typography
                                            variant="body2"
                                            gutterBottom
                                        >
                                            Docker compose will manage all the
                                            required services like Zookeeper,
                                            Bookkeeper and HDFS.
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            gutterBottom
                                        >
                                            Data will be preserved in the
                                            container.
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
                                                    1. Docker
                                                </ListItemText>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    disabled
                                                >
                                                    Detected
                                                </Button>
                                            </ListItem>
                                            <ListItem sx={{ padding: 1 }}>
                                                <ListItemText
                                                    primaryTypographyProps={{
                                                        variant: 'body2',
                                                    }}
                                                >
                                                    2. Pravega running
                                                </ListItemText>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    disabled
                                                >
                                                    Running
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
                                    Remote
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
                                    <CardHeader title="Pravega Cluster" />
                                    <CardContent>
                                        <Typography
                                            variant="body2"
                                            gutterBottom
                                        >
                                            Our professional will take care of
                                            everything needed to run a Pravega
                                            cluster.
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            gutterBottom
                                        >
                                            No worries about resources, they are
                                            unlimited on the cloud!
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            gutterBottom
                                        >
                                            What you need is to name a few
                                            streams and connect.
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            disabled
                                        >
                                            See Instructions
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
