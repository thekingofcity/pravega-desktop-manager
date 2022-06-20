import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import connectionReducer from './connection';
import previewReducer from './preview';
import metricsReducer from './metrics';

const store = configureStore({
    reducer: {
        connection: connectionReducer,
        preview: previewReducer,
        metrics: metricsReducer,
    },
});
export default store;

// save the connection state to localStorage on change
store.subscribe(() =>
    localStorage.setItem(
        'reduxState',
        JSON.stringify(store.getState().connection)
    )
);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {connection: ConnectionState}
export type AppDispatch = typeof store.dispatch;
// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
