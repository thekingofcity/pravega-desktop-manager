import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Lang = 'en-US' | 'zh-CN' | 'ja-JP' | 'ko-KR';

// Contains all settings for the application.
export interface SettingsState {
    language: Lang;
    advancedRead: boolean;
}

const initialState: SettingsState = { language: 'en-US', advancedRead: true };

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setAdvancedRead: (state, action: PayloadAction<boolean>) => {
            state.advancedRead = action.payload;
        },
        setLanguage: (state, action: PayloadAction<Lang>) => {
            state.language = action.payload;
        },
    },
});

export const { setAdvancedRead, setLanguage } = settingsSlice.actions;

export default settingsSlice.reducer;
