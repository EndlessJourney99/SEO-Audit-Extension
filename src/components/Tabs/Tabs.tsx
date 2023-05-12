import { signal, useSignal } from '@preact/signals';
import { JSX } from 'preact/jsx-runtime';
import { TabContext } from './TabContext';
import React, { useEffect } from 'preact/compat';

interface props extends React.HTMLAttributes<HTMLElement> {
    children: JSX.Element | JSX.Element[];
    defaultKey: string | number;
    sideMenu?: boolean;
}

const Tabs = ({ children, defaultKey, sideMenu, ...rest }: props) => {
    const context = useSignal<string | number>(defaultKey);
    const sideMenuOpen = useSignal<boolean>(sideMenu ?? false);

    useEffect(() => {
        context.value = defaultKey;
    }, [defaultKey]);
    return (
        <TabContext.Provider
            value={{
                activeKey: context,
                sideMenu: sideMenu ?? false,
                isOpen: sideMenuOpen,
            }}
        >
            <section
                key="Tabs"
                {...rest}
                className={`${
                    sideMenu
                        ? sideMenuOpen.value
                            ? 'grid grid-cols-[25%_auto_auto_auto] gap-2 transition-all'
                            : 'grid grid-cols-[6%_auto_auto_auto] gap-2 transition-all'
                        : ''
                }`}
            >
                {children}
            </section>
        </TabContext.Provider>
    );
};

export default Tabs;
