import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

import { CreateStreamArguments } from './types';

export type Channels = 'ipc-example';

contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        minimizeWindow: () => ipcRenderer.send('minimize-window'),
        maximizeWindow: () => ipcRenderer.send('maximize-window'),
        closeWindow: () => ipcRenderer.send('close-window'),
        sendMessage(channel: Channels, args: unknown[]) {
            ipcRenderer.send(channel, args);
        },
        on(channel: Channels, func: (...args: unknown[]) => void) {
            const subscription = (
                _event: IpcRendererEvent,
                ...args: unknown[]
            ) => func(...args);
            ipcRenderer.on(channel, subscription);

            return () => ipcRenderer.removeListener(channel, subscription);
        },
        once(channel: Channels, func: (...args: unknown[]) => void) {
            ipcRenderer.once(channel, (_event, ...args) => func(...args));
        },
    },
    pravega: {
        newPravega: (
            name: string,
            controller_uri: string,
            auth_enabled = false,
            tls_enabled = false,
            disable_cert_verification = true
        ) =>
            ipcRenderer.invoke('new-pravega-manager', [
                name,
                controller_uri,
                auth_enabled,
                tls_enabled,
                disable_cert_verification,
            ]),
        listScopesAndStreams: (
            callback: (
                event: Electron.IpcRendererEvent,
                name: string,
                scopeWithStreams: { [scope: string]: string[] }
            ) => void,
            name: string
        ) => {
            ipcRenderer.on(
                'list-scopes-and-streams',
                (
                    e: IpcRendererEvent,
                    n: string,
                    scopeWithStreams: { [scope: string]: string[] }
                ) => {
                    ipcRenderer.off('list-scopes-and-streams', callback);
                    callback(e, n, scopeWithStreams);
                }
            );
            ipcRenderer.send(
                'set-which-connection-to-list-scopes-and-streams',
                [name]
            );
        },
        getMetrics: (
            callback: (
                event: Electron.IpcRendererEvent,
                name: string,
                metrics: { [key: string]: number }
            ) => void
        ) => {
            ipcRenderer.on(
                'metrics',
                (
                    e: IpcRendererEvent,
                    n: string,
                    metrics: { [key: string]: number }
                ) => {
                    ipcRenderer.off('metrics', callback);
                    callback(e, n, metrics);
                }
            );
        },
        createScope: (name: string, scope: string) =>
            ipcRenderer.invoke('create-pravega-scope', [name, scope]),
        createStream: (...args: CreateStreamArguments) =>
            ipcRenderer.invoke('create-pravega-stream', args),
        deleteScope: (name: string, scope: string) =>
            ipcRenderer.invoke('delete-pravega-scope', [name, scope]),
        deleteStream: (name: string, scope: string, stream: string) =>
            ipcRenderer.invoke('delete-pravega-stream', [name, scope, stream]),
        createWriter: (name: string, scope: string, stream: string) =>
            ipcRenderer.invoke('create-writer', [name, scope, stream]),
        writeEvents: (
            name: string,
            scope: string,
            stream: string,
            events: string[]
        ) => ipcRenderer.send('write-events', [name, scope, stream, events]),
        createReader: (
            name: string,
            scope: string,
            stream: string,
            streamCut: 'head' | 'tail' | string
        ) =>
            ipcRenderer.send('create-reader', [name, scope, stream, streamCut]),
        setWhichStreamToRead: (name: string, scope?: string, stream?: string) =>
            ipcRenderer.send('set-which-stream-to-read', [name, scope, stream]),
        registerReadCallback: (
            callback: (
                event: Electron.IpcRendererEvent,
                currentConn: string,
                scopedStream: string,
                data: string[]
            ) => void
        ) => {
            // remove any previous callback when PreviewStream is rerendered
            // there should be only one listener
            ipcRenderer.removeAllListeners('read-events');
            ipcRenderer.on('read-events', callback);
        },
        cleanReadersAndWriters: (name: string, scope: string, stream: string) =>
            ipcRenderer.send('clean-readers-and-writers', [
                name,
                scope,
                stream,
            ]),
        resetAllReadersAndWriters: () =>
            ipcRenderer.send('reset-all-readers-and-writers'),
    },
});
