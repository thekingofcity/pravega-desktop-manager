import log from 'electron-log';

import { ManagerPool, CreateStreamArguments } from './types';
import getMetrics from './metrics';

const {
    StreamManager,
    StreamCut,
    StreamRetentionPolicy,
    StreamScalingPolicy,
} = require('@thekingofcity/pravega');

const handleIPC = (
    ipcMain: Electron.IpcMain,
    mainWindow: Electron.BrowserWindow
) => {
    // runtime native object pool
    const managerPool: ManagerPool = {};
    // evil global variable, but required for setTimeout
    let currentConnection: string | undefined;
    let scopedStreams: string | undefined;

    // Here we have 3 run forever code that will return immediately if the
    // above global variables are not set.
    // 1. fetch scopes and streams on current connection
    const listScopesAndStreams = async () => {
        const name = currentConnection;
        if (!name || !(name in managerPool)) {
            setTimeout(listScopesAndStreams, 500);
            return;
        }

        // This will throw error if it can not connect to the server after 1 sec,
        // but should be fine as there is no blocking and scopes and streams
        // won't be updated in the renderer.
        const scopes: string[] = await managerPool[name].manager.list_scopes();
        const scopeWithStreams = Object.fromEntries(
            await Promise.all(
                scopes.map(
                    async (scope) =>
                        [
                            scope,
                            await managerPool[name].manager.list_streams(scope),
                        ] as [string, string[]]
                )
            )
        );

        mainWindow.webContents.send(
            `list-scopes-and-streams`,
            name,
            scopeWithStreams
        );
        setTimeout(listScopesAndStreams, 500);
    };
    setTimeout(listScopesAndStreams, 1000);
    // 2. fetch metrics for every 1 second
    setInterval(
        () => getMetrics(currentConnection, managerPool, mainWindow),
        1000
    );
    // 3. read more segments if we are on preview page
    const readEvents = async () => {
        const name = currentConnection;
        if (!name || !(name in managerPool) || !scopedStreams) {
            setTimeout(readEvents, 500);
            return;
        }

        const reader =
            managerPool[name]?.rw?.[`${scopedStreams}`]?.readers.at(0);
        if (!reader) {
            setTimeout(readEvents, 500);
            return;
        }

        const dec = new TextDecoder('utf-8');
        const segSlice = await reader.get_segment_slice();
        const events = [...segSlice].map((event) => dec.decode(event.data()));
        if (events.length > 0) log.info(`${scopedStreams} Reads: ${events}`);
        mainWindow.webContents.send(`read-events`, name, scopedStreams, events);
        reader.release_segment(segSlice);

        setTimeout(readEvents, events.length ? 0 : 500);
    };
    setTimeout(readEvents, 1000);

    // listen to IPC messages sent from the renderer process
    ipcMain.handle(
        'new-pravega-manager',
        (
            _: Electron.IpcMainInvokeEvent,
            args: [string, string, boolean, boolean, boolean]
        ) => {
            const [id, url, ...arg] = args;
            if (id in managerPool && url === managerPool[id].url) {
                return managerPool[id].manager.toString();
            }
            managerPool[id] = {
                manager: StreamManager(url, ...arg),
                rw: {},
                url,
            };
            log.info(`Create manager for ${id} at ${url}`);
            return managerPool[id].manager.toString();
        }
    );
    ipcMain.on(
        'set-which-connection-to-list-scopes-and-streams',
        async (_: Electron.IpcMainInvokeEvent, args: [string]) => {
            [currentConnection] = args;
        }
    );
    ipcMain.handle(
        'create-pravega-scope',
        (_: Electron.IpcMainInvokeEvent, args: [string, string]) => {
            const [name, scope] = args;
            if (name in managerPool) {
                return managerPool[name].manager.create_scope(scope);
            }
            throw new Error(`${name} is not in managerPool`);
        }
    );
    ipcMain.handle(
        'create-pravega-stream',
        (_: Electron.IpcMainInvokeEvent, args: CreateStreamArguments) => {
            const [
                name,
                scope,
                stream,
                streamRetentionPolicyType,
                value1,
                streamScalingPolicyType,
                value2,
                scaleFactor,
                initialSegments,
                tags,
            ] = args;
            if (name in managerPool) {
                let streamRetentionPolicy: typeof StreamRetentionPolicy;
                if (streamRetentionPolicyType === 'none') {
                    streamRetentionPolicy = StreamRetentionPolicy.none();
                } else if (streamRetentionPolicyType === 'by_size') {
                    streamRetentionPolicy =
                        StreamRetentionPolicy.by_size(value1);
                } else if (streamRetentionPolicyType === 'by_time') {
                    streamRetentionPolicy =
                        StreamRetentionPolicy.by_time(value1);
                }
                let streamScalingPolicy: typeof StreamScalingPolicy;
                if (streamScalingPolicyType === 'fixed') {
                    streamScalingPolicy =
                        StreamScalingPolicy.fixed_scaling_policy(
                            initialSegments
                        );
                } else if (streamScalingPolicyType === 'by_data_rate') {
                    streamScalingPolicy =
                        StreamScalingPolicy.auto_scaling_policy_by_data_rate(
                            value2,
                            scaleFactor,
                            initialSegments
                        );
                } else if (streamScalingPolicyType === 'by_event_rate') {
                    streamScalingPolicy =
                        StreamScalingPolicy.auto_scaling_policy_by_event_rate(
                            value2,
                            scaleFactor,
                            initialSegments
                        );
                }
                if (!streamRetentionPolicy || !streamScalingPolicy)
                    throw new Error(`Unknown policy to create a stream`);
                return managerPool[name].manager.create_stream(
                    scope,
                    stream,
                    streamRetentionPolicy,
                    streamScalingPolicy,
                    tags ?? []
                );
            }
            throw new Error(`${name} is not in managerPool`);
        }
    );
    ipcMain.handle(
        'delete-pravega-scope',
        (_: Electron.IpcMainInvokeEvent, args: [string, string, string]) => {
            const [name, scope] = args;
            if (name in managerPool) {
                return managerPool[name].manager.delete_scope(scope);
            }
            throw new Error(`${name} is not in managerPool`);
        }
    );
    ipcMain.handle(
        'delete-pravega-stream',
        (_: Electron.IpcMainInvokeEvent, args: [string, string, string]) => {
            const [name, scope, stream] = args;
            if (name in managerPool) {
                managerPool[name].manager.seal_stream(scope, stream);
                return managerPool[name].manager.delete_stream(scope, stream);
            }
            throw new Error(`${name} is not in managerPool`);
        }
    );
    ipcMain.handle(
        'create-writer',
        (_: Electron.IpcMainInvokeEvent, args: [string, string, string]) => {
            const [name, scope, stream] = args;
            if (!(name in managerPool)) {
                throw new Error(`${name} is not in managerPool`);
            }
            if (!(`${scope}/${stream}` in managerPool[name].rw)) {
                // might be an issue if writer and reader are created a the same time
                managerPool[name].rw[`${scope}/${stream}`] = {
                    readerGroups: [],
                    readers: [],
                    writers: [],
                    txnWriters: [],
                };
            }
            const rw = managerPool[name].rw[`${scope}/${stream}`];
            if (rw.writers.length === 0) {
                rw.writers.push(
                    managerPool[name].manager.create_writer(scope, stream)
                );
            }
            if (rw.txnWriters.length === 0) {
                rw.txnWriters.push(
                    managerPool[name].manager.create_transaction_writer(
                        scope,
                        stream,
                        BigInt(Math.floor(Math.random() * 1000000))
                    )
                );
            }
            log.info(`Create writer on ${scope}/${stream}`);
        }
    );
    ipcMain.on(
        'write-events',
        async (
            _: Electron.IpcMainInvokeEvent,
            args: [string, string, string, string[]]
        ) => {
            const [name, scope, stream, events] = args;
            if (!(name in managerPool)) {
                throw new Error(`${name} is not in managerPool`);
            }
            if (
                `${scope}/${stream}` in managerPool[name].rw &&
                managerPool[name].rw[`${scope}/${stream}`].writers.length > 0
            ) {
                const writer =
                    managerPool[name].rw[`${scope}/${stream}`].writers.at(0);
                log.info(`${scope}/${stream} write events: ${events}`);
                events.forEach((event) => writer.write_event(event));
            }
        }
    );
    ipcMain.on(
        'write-transaction',
        async (
            _: Electron.IpcMainInvokeEvent,
            args: [string, string, string, string[]]
        ) => {
            const [name, scope, stream, events] = args;
            if (!(name in managerPool)) {
                throw new Error(`${name} is not in managerPool`);
            }
            if (
                `${scope}/${stream}` in managerPool[name].rw &&
                managerPool[name].rw[`${scope}/${stream}`].txnWriters.length > 0
            ) {
                const txnWriter =
                    managerPool[name].rw[`${scope}/${stream}`].txnWriters.at(0);
                log.info(`${scope}/${stream} write transaction: ${events}`);
                const txn = await txnWriter.begin_txn();
                await Promise.all(
                    events.map((event) => txn.write_event(event))
                );
                txn.commit();
            }
        }
    );
    ipcMain.on(
        'create-reader',
        async (
            _: Electron.IpcMainInvokeEvent,
            args: [string, string, string, 'head' | 'tail' | string]
        ) => {
            const [name, scope, stream, streamCut] = args;
            if (!(name in managerPool)) {
                throw new Error(`${name} is not in managerPool`);
            }
            if (!(`${scope}/${stream}` in managerPool[name].rw)) {
                managerPool[name].rw[`${scope}/${stream}`] = {
                    readerGroups: [],
                    readers: [],
                    writers: [],
                    txnWriters: [],
                };
            }
            const rw = managerPool[name].rw[`${scope}/${stream}`];
            if (rw.readerGroups.length === 0) {
                const readerGroupName = Math.random().toString(36).slice(2, 10);
                const readerGroup = managerPool[
                    name
                ].manager.create_reader_group(
                    streamCut === 'tail' ? StreamCut.tail() : StreamCut.head(),
                    readerGroupName,
                    scope,
                    stream
                );
                rw.readerGroups.push(readerGroup);
            }
            if (rw.readers.length === 0) {
                rw.readers.push(
                    rw.readerGroups
                        .at(0)
                        .create_reader(Math.random().toString(36).slice(2, 10))
                );
            }
            log.info(
                `Create reader on ${scope}/${stream} with stream cut ${streamCut}`
            );
        }
    );
    ipcMain.on(
        'set-which-stream-to-read',
        async (
            _: Electron.IpcMainInvokeEvent,
            args: [string, string | undefined, string | undefined]
        ) => {
            const [name, scope, stream] = args;
            if (!(name in managerPool)) {
                throw new Error(`${name} is not in managerPool`);
            }
            scopedStreams = scope && stream ? `${scope}/${stream}` : undefined;
            log.info(`Set ${scopedStreams} to read`);
        }
    );
    ipcMain.on(
        'clean-readers-and-writers',
        async (
            _: Electron.IpcMainInvokeEvent,
            args: [string, string, string]
        ) => {
            const [name, scope, stream] = args;
            if (!(name in managerPool)) {
                throw new Error(`${name} is not in managerPool`);
            }
            delete managerPool[name].rw[`${scope}/${stream}`];
            log.info(`Clean readers and writers of ${scopedStreams}`);
        }
    );
    ipcMain.on('reset-all-readers-and-writers', async () => {
        Object.values(managerPool).forEach((conn) => {
            conn.rw = {};
        });
        log.info(`Reset all readers and writers`);
    });
};

export default handleIPC;
