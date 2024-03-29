import { JSX } from 'preact/jsx-runtime';
import { TabContext, tabContextProps } from './TabContext';
import { useContext } from 'preact/hooks';
import useSticky from '../../hooks/useSticky';
import Menu from '@mui/icons-material/Menu';
import Close from '@mui/icons-material/Close';

type Props = {
    children: JSX.Element | JSX.Element[];
};

const TabHeader = ({ children }: Props) => {
    const state: tabContextProps = useContext(TabContext);
    const { stickyRef, sticky } = useSticky<HTMLDivElement>();

    return (
        <div
            className={`border-b border-gray-200 ${
                state.sideMenu ? 'col-span-1 pt-5' : ''
            }`}
        >
            <div
                ref={stickyRef}
                className={`${
                    sticky.value && state.sideMenu ? 'sticky top-0 pt-5' : ''
                }`}
            >
                {state.sideMenu ? (
                    <button
                        className={`text-lg flex w-full border-b pb-3 items-center ${
                            state.isOpen.value
                                ? 'justify-start'
                                : 'justify-center'
                        } flex-nowrap`}
                        onClick={() =>
                            (state.isOpen.value = !state.isOpen.value)
                        }
                    >
                        {state.isOpen.value ? (
                            <Close className="mr-2" />
                        ) : (
                            <Menu className="mr-2" />
                        )}
                        <h2
                            className={`font-bold ${
                                !state.isOpen.value ? 'hidden' : ''
                            }`}
                        >
                            MENU
                        </h2>
                    </button>
                ) : (
                    ''
                )}
                <ul
                    className={`flex flex-wrap ${
                        state.sideMenu ? 'flex-col' : 'text-center'
                    } -mb-px text-sm font-medium text-gray-500`}
                >
                    {children}
                </ul>
            </div>
        </div>
    );
};

export default TabHeader;
