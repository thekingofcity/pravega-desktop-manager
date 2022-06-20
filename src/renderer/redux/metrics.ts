import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Contains all metrics for every connection.
// They are not meant for persistence.
export interface MetricsState {
    [name: string]: {
        [key: string]: number[];
    };
}

const initialState: MetricsState = {};

export const metricsSlice = createSlice({
    name: 'metrics',
    initialState,
    reducers: {
        updateMetrics: (
            state,
            action: PayloadAction<{
                connection: string;
                metrics: { [key: string]: number };
            }>
        ) => {
            const { connection, metrics } = action.payload;
            state[connection] = state[connection] ?? {};
            Object.entries(metrics).forEach(([key, val]) => {
                state[connection][key] = (state[connection][key] ?? [])
                    .concat(val)
                    .slice(-100);
            });
        },
        clearMetrics: (state, action: PayloadAction<string>) => {
            const connection = action.payload;
            state[connection] = {};
        },
    },
});

export const { updateMetrics, clearMetrics } = metricsSlice.actions;

export default metricsSlice.reducer;
