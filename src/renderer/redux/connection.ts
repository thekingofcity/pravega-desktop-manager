import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define a type for the slice state
export interface ConnectionState {
    currentConnection: string;
    connections: { [id: string]: Connection };
}

export interface Connection {
    name: string;
    url: string;
    openedStreams: string[];
    currentTab: string;
}

// Define the initial state using that type
const initialState: ConnectionState = {
    currentConnection: 'pravega1',
    connections: {},
    ...JSON.parse(
        // @ts-ignore
        localStorage.getItem('reduxConnectionState')
    ),
};

export const connectionSlice = createSlice({
    name: 'connection',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        addConnection: (
            state,
            // Use the PayloadAction type to declare the contents of `action.payload`
            action: PayloadAction<
                Pick<Connection, 'name' | 'url'> & { id: string }
            >
        ) => {
            state.connections[action.payload.id] = {
                openedStreams: [],
                currentTab: 'overview',
                name: action.payload.name,
                url: action.payload.url,
            };
        },
        delConnection: (state, action: PayloadAction<string>) => {
            delete state.connections[action.payload];
            if (state.currentConnection === action.payload) {
                state.currentConnection =
                    Object.keys(state.connections).at(0) ?? '';
            }
        },
        editConnection: (
            state,
            action: PayloadAction<
                Pick<Connection, 'name' | 'url'> & { id: string }
            >
        ) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.connections[action.payload.id] = {
                ...state.connections[action.payload.id],
                name: action.payload.name,
                url: action.payload.url,
            };
        },
        setCurrentConnection: (state, action: PayloadAction<string>) => {
            state.currentConnection = action.payload;
        },
        // add scoped stream to the openedStreams
        addStream: (state, action: PayloadAction<string>) => {
            if (state.currentConnection) {
                const { openedStreams } =
                    state.connections[state.currentConnection];
                if (!openedStreams.includes(action.payload)) {
                    openedStreams.push(action.payload);
                }
                state.connections[state.currentConnection].currentTab =
                    action.payload;
            }
        },
        // remove scoped stream from the openedStreams
        delStream: (state, action: PayloadAction<string>) => {
            if (state.currentConnection) {
                state.connections[state.currentConnection].openedStreams =
                    state.connections[
                        state.currentConnection
                    ].openedStreams.filter(
                        (scopedStream) => scopedStream !== action.payload
                    );
                state.connections[state.currentConnection].currentTab =
                    'overview';
            }
        },
        setCurrentStream: (state, action: PayloadAction<string>) => {
            if (state.currentConnection) {
                state.connections[state.currentConnection].currentTab =
                    action.payload;
            }
        },
        resetAll: (state) => {
            Object.values(state.connections).forEach((connection) => {
                connection.currentTab = 'overview';
                connection.openedStreams = [];
            });
        },
    },
});

// Action creators are generated for each case reducer function
export const {
    addConnection,
    delConnection,
    editConnection,
    setCurrentConnection,
    addStream,
    delStream,
    setCurrentStream,
    resetAll,
} = connectionSlice.actions;

export default connectionSlice.reducer;
