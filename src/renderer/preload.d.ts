import { Channels } from 'main/preload';
import { CreateStream } from 'main/types';

declare global {
    interface Window {
        electron: {
            ipcRenderer: {
                minimizeWindow(): void;
                maximizeWindow(): void;
                closeWindow(): void;
                sendMessage(channel: Channels, args: unknown[]): void;
                on(
                    channel: string,
                    func: (...args: unknown[]) => void
                ): (() => void) | undefined;
                once(channel: string, func: (...args: unknown[]) => void): void;
            };
            pravega: {
                newPravega: (
                    name: string,
                    controller_uri: string,
                    auth_enabled?: boolean,
                    tls_enabled?: boolean,
                    disable_cert_verification?: boolean
                ) => Promise<string>;
                listScopesAndStreams: (
                    callback: (
                        event: Electron.IpcRendererEvent,
                        name: string,
                        scopeWithStreams: { [scope: string]: string[] }
                    ) => void,
                    name: string
                ) => Promise<void>;
                getMetrics: (
                    callback: (
                        event: Electron.IpcRendererEvent,
                        name: string,
                        metrics: { [key: string]: number }
                    ) => void
                ) => Promise<void>;
                createScope: (name: string, scope: string) => Promise<boolean>;
                createStream: CreateStream;
                deleteScope: (name: string, scope: string) => Promise<boolean>;
                deleteStream: (
                    name: string,
                    scope: string,
                    stream: string
                ) => Promise<boolean>;
                createWriter: (
                    name: string,
                    scope: string,
                    stream: string
                ) => Promise<void>;
                writeEvents: (
                    name: string,
                    scope: string,
                    stream: string,
                    events: string[]
                ) => Promise<void>;
                writeTransaction: (
                    name: string,
                    scope: string,
                    stream: string,
                    events: string[]
                ) => Promise<void>;
                createReader: (
                    name: string,
                    scope: string,
                    stream: string,
                    streamCut: 'head' | 'tail' | string
                ) => Promise<void>;
                // If both scope and stream is undefined in the main process
                // (undefined on initialization), the main process will not
                // read anything.
                setWhichStreamToRead: (
                    name: string,
                    scope?: string,
                    stream?: string
                ) => Promise<void>;
                registerReadCallback: (
                    callback: (
                        event: Electron.IpcRendererEvent,
                        currentConn: string,
                        scopedStream: string,
                        data: string[]
                    ) => void
                ) => () => void;
                cleanReadersAndWriters: (
                    name: string,
                    scope: string,
                    stream: string
                ) => Promise<void>;
                resetAllReadersAndWriters: () => Promise<void>;
            };
        };
    }
}

export {};
