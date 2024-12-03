import { useState, useEffect, useRef } from 'react';

type ElementSize = {
    width: number;
    height: number;
};

function useElementSize(): [ElementSize, React.RefObject<any>] {
    const [elementSize, setElementSize] = useState<ElementSize>({ width: 0, height: 0 });
    const elementRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const updateSize = (entries: ResizeObserverEntry[]) => {
            if (entries[0].contentRect) {
                const { width, height } = entries[0].contentRect;
                setElementSize({ width, height });
            }
        };

        const resizeObserver = new ResizeObserver(updateSize);

        if (elementRef.current) {
            resizeObserver.observe(elementRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    return [elementSize, elementRef];
}
export default useElementSize;