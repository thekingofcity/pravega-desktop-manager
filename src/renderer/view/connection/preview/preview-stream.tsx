import * as React from 'react';
import { useLocation } from 'react-router-dom';
import {
    Box,
    Fab,
    IconButton,
    MenuItem,
    Select,
    Tab,
    Tabs,
    TextareaAutosize,
    Typography,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SettingsIcon from '@mui/icons-material/Settings';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { useAppSelector, useAppDispatch } from '../../../redux/store';
import { setCurrentStream } from '../../../redux/connection';
import { updatePreview } from '../../../redux/preview';
import AdvancedReadDialog from './dialogs';

const PreviewStream = () => {
    const location = useLocation();
    const dispatch = useAppDispatch();

    const scope = location.pathname.split('/')[3];
    const stream = location.pathname.split('/')[4];

    const { connections, currentConnection, advancedRead } = useAppSelector(
        (state) => state.connection
    );
    const { connections: previewConnection } = useAppSelector(
        (state) => state.preview
    );

    // auto scroll the preview textarea to bottom
    const previewData =
        previewConnection[currentConnection]?.preview?.[`${scope}/${stream}`];
    const textLog = React.useRef<HTMLTextAreaElement | null>(null);
    React.useEffect(() => {
        if (textLog.current)
            textLog.current.scrollTop = textLog.current.scrollHeight;
    }, [previewData]);

    const [pause, setPause] = React.useState(false);

    // advanced read open and opened
    // open is used to control the dialog and opened is used to track whether
    // the one-time option dialogs opened
    const [advancedReadOpen, setAdvancedReadOpen] = React.useState(false);
    const [advancedReadOpened, setAdvancedReadOpened] = React.useState(false);
    const [automaticRead, setAutomaticRead] = React.useState(true);
    const handleAdvancedRead = (
        streamCut: 'head' | 'tail' | string,
        autoRead: boolean
    ) => {
        setAdvancedReadOpen(false);
        // we may already relied on batch updating to prevent unwanted
        // setWhichStreamToRead call
        setAdvancedReadOpened(true);
        setAutomaticRead(autoRead);
        setPause(!autoRead);
        window.electron.pravega.createReader(
            currentConnection,
            scope,
            stream,
            streamCut
        );
    };

    // set undefined on pause
    React.useEffect(() => {
        const read =
            !pause &&
            // no op when user does not set where to read
            !(advancedRead && !advancedReadOpened) &&
            // no op when user set where to read but disable automaticRead
            !(advancedRead && advancedReadOpened && !automaticRead);

        window.electron.pravega.setWhichStreamToRead(
            currentConnection,
            read ? scope : undefined,
            read ? stream : undefined
        );
    }, [
        currentConnection,
        scope,
        stream,
        pause,
        advancedRead,
        advancedReadOpened,
        automaticRead,
    ]);

    // writer's pending data state
    const [writeArea, setWriteArea] = React.useState('');
    const handleWrite = () =>
        window.electron.pravega.writeEvents(
            currentConnection,
            scope,
            stream,
            writeArea.split('\n')
        );

    // Reset if scope and stream changed
    React.useEffect(
        () => {
            // As we are still using <Tabs>, there is no custom operation in `navigate`,
            // we need to manually set the currentStream on load or each change.
            dispatch(setCurrentStream(`${scope}/${stream}`));

            // re-init on scopedStream change
            setAdvancedReadOpened(false);
            setAutomaticRead(true);
            setPause(false);

            // only proceed if the scopedStream exists
            if (
                !previewConnection?.[currentConnection]?.availableStreams?.[
                    scope
                ]?.includes(stream)
            )
                return;

            // only create reader on tail when advancedRead is not enabled
            if (!advancedRead) {
                window.electron.pravega.createReader(
                    currentConnection,
                    scope,
                    stream,
                    'tail'
                );
            }

            window.electron.pravega.createWriter(
                currentConnection,
                scope,
                stream
            );
        },
        // previewConnection is only used to determine whether to create reader and writer
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [location.pathname, connections, currentConnection, scope, stream]
    );

    React.useEffect(
        () => {
            // register the onUpdate function on mount
            // https://www.electronjs.org/docs/latest/tutorial/ipc#pattern-3-main-to-renderer
            window.electron.pravega.registerReadCallback(
                (_, currentConn, scopedStream, data) => {
                    console.log(
                        `${currentConn} ${scopedStream} reads: ${data}`
                    );
                    dispatch(
                        updatePreview({
                            connection: currentConn,
                            scopedStream,
                            data,
                        })
                    );
                }
            );

            // only unregister the read op on unmount
            // select between different scopedStreams will not invoke this
            return () => {
                window.electron.pravega.setWhichStreamToRead(
                    currentConnection,
                    undefined,
                    undefined
                );
            };
        },
        // a one time effect on mount and unmount for onUpdate function
        // does not need refresh on each rerender
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    return (
        <Box
            sx={{
                marginLeft: 2,
                marginRight: 2,
                paddingTop: 1,
                height: 'calc(100% - 70px)',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Typography variant="h5" component="div">
                    Preview
                </Typography>
                <Select
                    value="utf8"
                    sx={{ height: 30, right: 15, position: 'fixed' }}
                >
                    <MenuItem value="utf8">SimpleUtf8Decoder</MenuItem>
                </Select>
            </Box>

            <TextareaAutosize
                value={(previewData ?? []).join('\n')}
                ref={textLog}
                style={{
                    width: 'calc(100% - 35px)',
                    height: 'calc(100% - 200px)',
                    overflow: 'auto',
                    marginTop: 10,
                }}
            />
            <Fab
                color="primary"
                sx={{ position: 'absolute', bottom: 180, right: 16 }}
            >
                <IconButton
                    onClick={() => {
                        setPause(!pause);
                        // no matter advancedRead and advancedReadOpened
                        // set true to run setWhichStreamToRead correctly
                        setAutomaticRead(true);
                    }}
                >
                    {pause ? (
                        <PlayArrowIcon sx={{ color: 'white' }} />
                    ) : (
                        <PauseIcon sx={{ color: 'white' }} />
                    )}
                </IconButton>
            </Fab>
            {advancedRead && !advancedReadOpened && (
                <Fab
                    color="primary"
                    sx={{ position: 'absolute', bottom: 180, right: 16 }}
                >
                    <IconButton onClick={() => setAdvancedReadOpen(true)}>
                        <SettingsIcon sx={{ color: 'white' }} />
                    </IconButton>
                </Fab>
            )}
            <AdvancedReadDialog
                open={advancedReadOpen}
                onClose={() => setAdvancedReadOpen(false)}
                onSet={handleAdvancedRead}
            />

            <Tabs value="Writer1">
                <Tab label="Writer" value="Writer1" />
            </Tabs>
            <TextareaAutosize
                placeholder="Write something to the stream!"
                value={writeArea}
                onChange={(e) => setWriteArea(e.target.value)}
                style={{
                    width: 'calc(100% - 35px)',
                    height: 100,
                    overflow: 'auto',
                    marginTop: 10,
                }}
            />
            <Fab
                color="primary"
                sx={{ position: 'absolute', bottom: 16, right: 16 }}
            >
                <IconButton onClick={handleWrite}>
                    <SendIcon sx={{ color: 'white' }} />
                </IconButton>
            </Fab>
        </Box>
    );
};

export default PreviewStream;
