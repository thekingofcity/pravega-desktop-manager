import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Divider,
    IconButton,
    Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RemoveIcon from '@mui/icons-material/Remove';
import { CreateStreamArgumentsExceptFirstTwo } from 'main/types';
import { useAppSelector, useAppDispatch } from '../../redux/store';
import { addStream, delStream } from '../../redux/connection';
import { updatePreview } from '../../redux/preview';
import {
    AddScopeDialog,
    AddStreamDialog,
    RemoveScopeOrStreamDialog,
} from './dialogs';

const Scope = (props: {
    scope: string;
    setIsAddStreamOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setRemoveScopeOrStreamType: React.Dispatch<
        React.SetStateAction<'Scope' | 'Stream'>
    >;
    setIsRemoveScopeOrStreamOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentScope: React.Dispatch<React.SetStateAction<string>>;
}) => {
    const {
        scope,
        setIsAddStreamOpen,
        setRemoveScopeOrStreamType,
        setIsRemoveScopeOrStreamOpen,
        setCurrentScope,
    } = props;
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
            <Typography
                sx={{
                    flexGrow: 1,
                    // dim the internal scope
                    color: scope.startsWith('_') ? 'gray' : 'black',
                }}
            >
                {scope}
            </Typography>
            <IconButton
                onClick={(e) => {
                    e.stopPropagation(); // prevent parent from opening
                    setCurrentScope(scope);
                    setIsAddStreamOpen(true);
                }}
            >
                <AddIcon />
            </IconButton>
            <IconButton
                onClick={(e) => {
                    e.stopPropagation(); // prevent parent from opening
                    setCurrentScope(scope);
                    setRemoveScopeOrStreamType('Scope');
                    setIsRemoveScopeOrStreamOpen(true);
                }}
            >
                <RemoveIcon />
            </IconButton>
        </Box>
    );
};

const Stream = (props: {
    scope: string;
    stream: string;
    currentConnection: string;
    setRemoveScopeOrStreamType: React.Dispatch<
        React.SetStateAction<'Scope' | 'Stream'>
    >;
    setIsRemoveScopeOrStreamOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentScope: React.Dispatch<React.SetStateAction<string>>;
    setCurrentTab: React.Dispatch<React.SetStateAction<string>>;
}) => {
    const {
        scope,
        stream,
        currentConnection,
        setRemoveScopeOrStreamType,
        setIsRemoveScopeOrStreamOpen,
        setCurrentScope,
        setCurrentTab,
    } = props;
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
            <Typography
                sx={{
                    flexGrow: 1,
                    // dim the internal stream
                    color: stream.startsWith('_') ? 'gray' : 'black',
                }}
            >
                {stream}
            </Typography>
            <IconButton
                onClick={() => {
                    dispatch(addStream(`${scope}/${stream}`));
                    // add an empty array to the preview state, so the preview ui
                    // have something to display instead of undefined
                    dispatch(
                        updatePreview({
                            connection: currentConnection,
                            scopedStream: `${scope}/${stream}`,
                            data: [],
                        })
                    );
                    navigate(
                        `/connection/${currentConnection}/${scope}/${stream}`
                    );
                }}
            >
                <PlayArrowIcon />
            </IconButton>
            {/* TODO: implement edit stream,
                      requires the binding to return full stream details.
            <IconButton>
                <EditIcon />
            </IconButton> */}
            <IconButton
                onClick={(e) => {
                    e.stopPropagation(); // prevent parent from opening
                    setCurrentScope(scope);
                    setCurrentTab(stream);
                    setRemoveScopeOrStreamType('Stream');
                    setIsRemoveScopeOrStreamOpen(true);
                }}
            >
                <RemoveIcon />
            </IconButton>
        </Box>
    );
};

const ScopesAndStreamsNavigator = (props: { height: number }) => {
    const { height } = props;

    const { currentConnection } = useAppSelector((state) => state.connection);
    const { connections } = useAppSelector((state) => state.preview);
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const [scopesAndStreams, setScopesAndStreams] = React.useState(
        {} as { [scope: string]: string[] }
    );

    // update the scopesAndStreams when availableStreams updated in ConnectionTabs
    React.useEffect(() => {
        if (currentConnection in connections) {
            const { availableStreams } = connections[currentConnection];
            setScopesAndStreams(availableStreams);
        }
    }, [setScopesAndStreams, connections, currentConnection]);

    const [currentScope, setCurrentScope] = React.useState('');
    const [currentStream, setCurrentTab] = React.useState('');
    const [isAddScopeOpen, setIsAddScopeOpen] = React.useState(false);
    const handleAddScope = async (scopeName: string) => {
        window.electron.pravega.createScope(currentConnection, scopeName);
    };
    const [isAddStreamOpen, setIsAddStreamOpen] = React.useState(false);
    const handleAddStream = async (
        ...args: CreateStreamArgumentsExceptFirstTwo
    ) => {
        window.electron.pravega.createStream(
            currentConnection,
            currentScope,
            ...args
        );
    };
    const [removeScopeOrStreamType, setRemoveScopeOrStreamType] =
        React.useState('Scope' as 'Scope' | 'Stream');
    const [isRemoveScopeOrStreamOpen, setIsRemoveScopeOrStreamOpen] =
        React.useState(false);
    const handleRemoveScopeOrStream = async () => {
        if (removeScopeOrStreamType === 'Scope') {
            await window.electron.pravega.deleteScope(
                currentConnection,
                currentScope
            );
        } else if (removeScopeOrStreamType === 'Stream') {
            dispatch(delStream(`${currentScope}/${currentStream}`));

            window.electron.pravega.cleanReadersAndWriters(
                currentConnection,
                currentScope,
                currentStream
            );
            window.electron.pravega.deleteStream(
                currentConnection,
                currentScope,
                currentStream
            );
        }
    };

    return (
        <Card variant="outlined" sx={{ margin: 1 }}>
            <CardContent>
                <CardHeader
                    title={t(
                        'views.connection.overview.scopesAndStreamsNavigator.title'
                    )}
                    sx={{ paddingLeft: 1, paddingTop: 0 }}
                    action={
                        <IconButton onClick={() => setIsAddScopeOpen(true)}>
                            <AddIcon />
                        </IconButton>
                    }
                />
                <TreeView
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    sx={{
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        height: height - 185,
                    }}
                >
                    <Divider />
                    {'_system' in scopesAndStreams &&
                        // make sure the connection is available by checking the returned data
                        Object.entries(scopesAndStreams)
                            .sort((a, b) => {
                                if (a[0].startsWith('_')) return 1;
                                if (b[0].startsWith('_')) return -1;
                                return a[0].localeCompare(b[0]);
                            })
                            .map(([scope, streams]) => (
                                <React.Fragment key={`${scope}`}>
                                    <TreeItem
                                        nodeId={`${scope}`}
                                        label={
                                            <Scope
                                                scope={scope}
                                                setIsAddStreamOpen={
                                                    setIsAddStreamOpen
                                                }
                                                setRemoveScopeOrStreamType={
                                                    setRemoveScopeOrStreamType
                                                }
                                                setIsRemoveScopeOrStreamOpen={
                                                    setIsRemoveScopeOrStreamOpen
                                                }
                                                setCurrentScope={
                                                    setCurrentScope
                                                }
                                            />
                                        }
                                    >
                                        {[...streams] // create a copy to sort
                                            .sort((a, b) => {
                                                if (a.startsWith('_')) return 1;
                                                if (b.startsWith('_'))
                                                    return -1;
                                                return a.localeCompare(b);
                                            })
                                            .map((stream) => (
                                                <React.Fragment
                                                    key={`${scope}/${stream}`}
                                                >
                                                    <Divider />
                                                    <TreeItem
                                                        nodeId={`${scope}/${stream}`}
                                                        label={
                                                            <Stream
                                                                scope={scope}
                                                                stream={stream}
                                                                currentConnection={
                                                                    currentConnection
                                                                }
                                                                setRemoveScopeOrStreamType={
                                                                    setRemoveScopeOrStreamType
                                                                }
                                                                setIsRemoveScopeOrStreamOpen={
                                                                    setIsRemoveScopeOrStreamOpen
                                                                }
                                                                setCurrentScope={
                                                                    setCurrentScope
                                                                }
                                                                setCurrentTab={
                                                                    setCurrentTab
                                                                }
                                                            />
                                                        }
                                                    />
                                                </React.Fragment>
                                            ))}
                                    </TreeItem>
                                    <Divider />
                                </React.Fragment>
                            ))}
                </TreeView>
                <AddScopeDialog
                    open={isAddScopeOpen}
                    onClose={() => setIsAddScopeOpen(false)}
                    onAdd={handleAddScope}
                />
                <AddStreamDialog
                    open={isAddStreamOpen}
                    onClose={() => setIsAddStreamOpen(false)}
                    onAdd={handleAddStream}
                />
                <RemoveScopeOrStreamDialog
                    open={isRemoveScopeOrStreamOpen}
                    type={removeScopeOrStreamType}
                    scope={currentScope}
                    stream={currentStream}
                    onClose={async (proceed: boolean) => {
                        setIsRemoveScopeOrStreamOpen(false);
                        if (proceed) {
                            await handleRemoveScopeOrStream();
                        }
                    }}
                />
            </CardContent>
        </Card>
    );
};

export default ScopesAndStreamsNavigator;
