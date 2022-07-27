/**
 * The internal native objects managed by the main process.
 * Contains both manager and the readers/writers for each stream.
 *
 * No idea why cjs still does not understand type even if I set "types" in package.json
 */
export type ManagerPool = {
    [name: string]: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        manager: any;
        url: string;
        rw: {
            // internal readerGroups, readers, writers for each stream
            [scopedStreams: string]: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                readerGroups: any[];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                readers: any[];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                writers: any[];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                txnWriters: any[];
            };
        };
    };
};

/**
 * The IPC call signature to create a stream.
 */
export type CreateStream = (
    name: string,
    scope: string,
    stream: string,
    streamRetentionPolicyType: 'none' | 'by_size' | 'by_time',
    value1: number,
    streamScalingPolicyType: 'fixed' | 'by_data_rate' | 'by_event_rate',
    value2: number,
    scaleFactor: number,
    initialSegments: number,
    tags: string[]
) => Promise<boolean>;

/**
 * These are arguments to create a stream,
 * refer to `StreamManager.create_stream` for more reference.
 */
export type CreateStreamArguments = Parameters<CreateStream>;

/**
 * Obtain a "slice" of a Typescript 'Parameters' tuple.
 * https://stackoverflow.com/questions/67605122/obtain-a-slice-of-a-typescript-parameters-tuple
 */
type ParametersExceptFirstTwo<F> = F extends (
    arg0: any,
    arg1: any,
    ...rest: infer R
) => any
    ? R
    : never;

/**
 * The arguments used in dialogs, the first two name and
 * scope will be obtained from outer state.
 */
export type CreateStreamArgumentsExceptFirstTwo =
    ParametersExceptFirstTwo<CreateStream>;
