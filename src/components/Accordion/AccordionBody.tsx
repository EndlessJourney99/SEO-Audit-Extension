import { useContext, useEffect, useRef } from 'preact/hooks';
import { accordionContext, accordionContextProps } from './AccordionContext';
import { computed, useSignal } from '@preact/signals';

interface props extends React.HTMLAttributes<HTMLDivElement> {
    children: string | JSX.Element | JSX.Element[];
}

const AccordionBody = ({ children, ...rest }: props) => {
    const state: accordionContextProps = useContext(accordionContext);
    const refElem = useRef<HTMLDivElement>(null);
    const refSignal = useSignal(refElem.current);
    useEffect(() => {
        refSignal.value = refElem.current;
    }, []);

    return (
        <div
            {...rest}
            ref={refElem}
            className={`h-0 transition-[height] duration-300 ease-in-out overflow-hidden px-3 ${rest.className}`}
            style={
                state.IsOpen.value
                    ? `height: ${refSignal.value?.scrollHeight}px`
                    : ''
            }
        >
            {children}
        </div>
    );
};

export default AccordionBody;
