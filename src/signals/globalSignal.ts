import { Signal, signal } from '@preact/signals';

export interface GlobalSignal {
    manifest: Signal<any>;
    tabInfo: Signal<chrome.tabs.Tab>;
    updateSignal: Signal<number>;
    isStarted: Signal<boolean>;
}

const chromeSignal = async (): Promise<GlobalSignal> => {
    const manifest = signal<any>(chrome.runtime.getManifest());
    const tabInfo = signal<chrome.tabs.Tab>({} as chrome.tabs.Tab);
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tabs && tabs.length > 0) tabInfo.value = tabs[0];

    const startedState = await chrome.storage.local.get(
        tabInfo.value.id!.toString() ?? '-1'
    );
    let isStarted = false;
    if (startedState[tabInfo.value.id!.toString() ?? '-1']) isStarted = true;

    return {
        manifest: manifest,
        tabInfo: tabInfo,
        updateSignal: signal(0),
        isStarted: signal(isStarted),
    };
};

export { chromeSignal };
