import { Signal, signal } from '@preact/signals';

export interface GlobalSignal {
    manifest: Signal<any>;
    tabInfo: Signal<chrome.tabs.Tab>;
}

const chromeSignal = async (): Promise<GlobalSignal> => {
    const manifest = signal<any>(chrome.runtime.getManifest());
    const tabInfo = signal<chrome.tabs.Tab>({} as chrome.tabs.Tab);
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs && tabs.length > 0) tabInfo.value = tabs[0];
    return { manifest: manifest, tabInfo: tabInfo };
};

export { chromeSignal };
