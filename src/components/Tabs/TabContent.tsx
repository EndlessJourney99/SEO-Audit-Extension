import React, { useContext } from 'preact/compat';
import { TabContext, tabContextProps } from './TabContext';

interface props extends React.HTMLAttributes<HTMLDivElement> {
    children: JSX.Element | JSX.Element[];
}

const TabContent = ({ children, ...props }: props) => {
    const state: tabContextProps = useContext(TabContext);
    return (
        <div
            id="myTabContent"
            {...props}
            className={`${state.sideMenu ? 'col-span-3' : ''}`}
        >
            {children}
        </div>
    );
};

export default TabContent;
