import { Signal, signal } from '@preact/signals';
import { createContext } from 'preact';

export interface accordionContextProps {
    IsOpen: Signal<boolean>;
}

export const accordionContext = createContext<accordionContextProps>({
    IsOpen: signal(false),
});
