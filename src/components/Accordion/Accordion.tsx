import { accordionContext } from './AccordionContext';
import { useSignal } from '@preact/signals';

interface props extends React.HTMLAttributes<HTMLDivElement> {
    isOpen: boolean;
    children: JSX.Element | JSX.Element[];
}

const Accordion = ({ isOpen, children, ...rest }: props) => {
    const IsOpen = useSignal(isOpen);

    return (
        <accordionContext.Provider value={{ IsOpen: IsOpen }}>
            <section name="Accordion" {...rest}>
                {children}
            </section>
        </accordionContext.Provider>
    );
};

export default Accordion;
