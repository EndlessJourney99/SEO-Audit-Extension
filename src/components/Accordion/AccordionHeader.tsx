import { useContext } from 'preact/hooks';
import { accordionContext, accordionContextProps } from './AccordionContext';

interface props extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'icon'> {
    icon?: JSX.Element;
    children: any;
}

const AccordionHeader = ({ title, icon, children, ...rest }: props) => {
    const state: accordionContextProps = useContext(accordionContext);

    const ToggleAccordionStatus = () => {
        state.IsOpen.value = !state.IsOpen.value;
    };

    return (
        <button
            {...rest}
            className="p-3 mb-2 block w-full text-black font-bold text-left bg-slate-200 hover:bg-slate-400 rounded-md"
            onClick={ToggleAccordionStatus}
        >
            {icon}
            {children}
        </button>
    );
};

export default AccordionHeader;
