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
import { useAppSelector, useAppDispatch } from '../../redux/store';
import { setCurrentStream } from '../../redux/connection';
import { updatePreview } from '../../redux/preview';

const PreviewStream = () => {
    const location = useLocation();
    const dispatch = useAppDispatch();

    const scope = location.pathname.split('/')[3];
    const stream = location.pathname.split('/')[4];

    const { connections, currentConnection } = useAppSelector(
        (state) => state.connection
    );
    const { connections: previewConnection } = useAppSelector(
        (state) => state.preview
    );

    React.useEffect(
        () => {
            dispatch(setCurrentStream(`${scope}/${stream}`));

            // only proceed if the scopedStream exists
            if (
                !previewConnection?.[currentConnection]?.availableStreams?.[
                    scope
                ]?.includes(stream)
            )
                return;

            window.electron.pravega.createReader(
                currentConnection,
                scope,
                stream
            );
            window.electron.pravega.createWriter(
                currentConnection,
                scope,
                stream
            );

            window.electron.pravega.setWhichStreamToRead(
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

    const previewData =
        previewConnection[currentConnection]?.preview?.[`${scope}/${stream}`];
    const textLog = React.useRef<HTMLTextAreaElement | null>(null);
    React.useEffect(() => {
        // auto scroll to bottom
        if (textLog.current)
            textLog.current.scrollTop = textLog.current.scrollHeight;
    }, [previewData]);

    const [writeArea, setWriteArea] = React.useState('');
    const handleWrite = () =>
        window.electron.pravega.writeEvents(
            currentConnection,
            scope,
            stream,
            writeArea.split('\n')
        );

    return (
        <Box
            sx={{
                marginLeft: 2,
                marginRight: 2,
                paddingTop: 1,
                height: 'calc(100% - 90px)',
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
