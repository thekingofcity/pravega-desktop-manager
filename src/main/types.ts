export type ManagerPool = {
    [name: string]: {
        // no idea why cjs still does not understand type
        // even if I set "types" in package.json
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        manager: any;
        url: string;
        // internal readerGroups, readers, writers of each stream
        rw: {
            [scopedStreams: string]: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                readerGroups: any[];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                readers: any[];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                writers: any[];
            };
        };
    };
};
