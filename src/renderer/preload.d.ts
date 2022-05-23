declare global {
    interface Window {
        electron: {
            ipcRenderer: {
                myPing(): void;
                minimizeWindow(): void;
                maximizeWindow(): void;
                closeWindow(): void;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                on(channel: string, func: (...args: any[]) => void): void;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                once(channel: string, func: (...args: any[]) => void): void;
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
                createScope: (name: string, scope: string) => Promise<boolean>;
                createStream: (
                    name: string,
                    scope: string,
                    stream: string
                ) => Promise<boolean>;
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
