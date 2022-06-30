import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
// import i18n (needs to be bundled :))
import './i18n/i18n';
import App from './App';
import store from './redux/store';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
    <Provider store={store}>
        <App />
    </Provider>
);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
    // eslint-disable-next-line no-console
    console.log(arg);
});
window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
