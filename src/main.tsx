import { render } from 'preact';
import { App } from './app';
import './index.css';
import { AppState } from './signals/globalContext';
import { chromeSignal } from './signals/globalSignal';
import { initDB } from './hooks/IndexedDB';
import { DBConfig } from './utils/IndexedDBConfig';

await initDB(DBConfig);
const globalStateInit = await chromeSignal();
render(
    <AppState.Provider value={globalStateInit}>
        <App />
    </AppState.Provider>,
    document.getElementById('app') as HTMLElement
);
