import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Contains all runtime data like preview and available streams.
// They are not meant for persistence.
export interface PreviewState {
    connections: {
        [name: string]: {
            availableStreams: { [scope: string]: string[] };
            preview: { [scopedStream: string]: string[] };
        };
    };
}

const initialState: PreviewState = {
    connections: {},
};

export const previewSlice = createSlice({
    name: 'preview',
    initialState,
    reducers: {
        updateAvailableStreams: (
            state,
            action: PayloadAction<{
                connection: string;
                availableStreams: { [scope: string]: string[] };
            }>
        ) => {
            const { connection, availableStreams } = action.payload;
            if (!(connection in state.connections)) {
                state.connections[connection] = {
                    availableStreams: {},
                    preview: {},
                };
            }
            state.connections[connection].availableStreams = availableStreams;
        },
        updatePreview: (
            state,
            action: PayloadAction<{
                connection: string;
                scopedStream: string;
                data: string[];
            }>
        ) => {
            const { connection, scopedStream, data } = action.payload;
            if (!(connection in state.connections)) {
                state.connections[connection] = {
                    availableStreams: {},
                    preview: {},
                };
            }
            state.connections[connection].preview[scopedStream] = (
                state.connections[connection].preview[scopedStream] ?? []
            )
                .concat(data)
                .slice(-1000);
        },
        deletePreview: (
            state,
            action: PayloadAction<{
                connection: string;
                scopedStream: string;
            }>
        ) => {
            const { connection, scopedStream } = action.payload;
            if (state.connections?.[connection]?.preview?.[scopedStream]) {
                delete state.connections[connection].preview[scopedStream];
                if (Object.keys(state.connections[connection]).length === 0) {
                    delete state.connections[connection];
                }
            }
        },
    },
});

export const { updateAvailableStreams, updatePreview, deletePreview } =
    previewSlice.actions;

export default previewSlice.reducer;
