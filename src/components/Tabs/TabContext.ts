import { Signal, signal } from '@preact/signals';
import { createContext } from 'preact';

export interface tabContextProps {
    activeKey: Signal<string | number>;
    sideMenu: boolean;
    isOpen: Signal<boolean>;
}

export const TabContext = createContext<tabContextProps>({
    activeKey: signal(0),
    sideMenu: false,
    isOpen: signal(false),
});
