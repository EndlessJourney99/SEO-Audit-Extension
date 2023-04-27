import { signal, useSignal } from '@preact/signals';
import { JSX } from 'preact/jsx-runtime';
import { TabContext } from './TabContext';
import React, { useEffect } from 'preact/compat';

interface props extends React.HTMLAttributes<HTMLElement> {
    children: JSX.Element | JSX.Element[];
    defaultKey: string | number;
}

const Tabs = ({ children, defaultKey, ...rest }: props) => {
    const context = useSignal<string | number>(defaultKey);
    useEffect(() => {
        context.value = defaultKey;
    }, [defaultKey]);
    return (
        <TabContext.Provider value={{ activeKey: context }}>
            <section key="Tabs" {...rest}>
                {children}
            </section>
        </TabContext.Provider>
    );
};

export default Tabs;
