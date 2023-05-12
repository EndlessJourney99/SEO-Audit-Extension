import { useSignal } from '@preact/signals';
import { useEffect, useRef } from 'preact/hooks';

function useSticky<T extends HTMLElement>() {
    const stickyRef = useRef<T>(null);
    const sticky = useSignal(false);
    const offset = useSignal(0);

    useEffect(() => {
        if (!stickyRef.current) {
            return;
        }
        offset.value = stickyRef.current?.offsetTop;
    }, [stickyRef]);

    useEffect(() => {
        const handleScroll = () => {
            if (!stickyRef.current) {
                return;
            }

            sticky.value = window.scrollY > offset.value;
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [stickyRef, offset]);
    return { stickyRef, sticky };
}

export default useSticky;
