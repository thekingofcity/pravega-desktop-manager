import { AnyAction, ThunkAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { updatePreview } from './preview';

// Sync thunk definition
// https://stackoverflow.com/questions/72029463/using-sync-thunk-with-redux-toolkit
type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    AnyAction
>;
export const updatePreviewWithFilter =
    (connection: string, scopedStream: string, data: string[]): AppThunk =>
    (dispatch, getState) => {
        const filterStr =
            getState().connection.connections?.[connection]?.openedStreams?.[
                scopedStream
            ].filterStr;
        const filterReg = filterStr ? new RegExp(filterStr, 'g') : undefined;
        dispatch(
            updatePreview({
                connection,
                scopedStream,
                data: data.filter((event) =>
                    filterReg ? filterReg.test(event) : true
                ),
            })
        );
    };
