import * as React from 'react';

// Define general type for useWindowSize hook, which includes width and height
export interface Size {
    width: number | undefined;
    height: number | undefined;
}

// https://usehooks.com/useWindowSize/
export const useWindowSize = (): Size => {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = React.useState<Size>({
        width: undefined,
        height: undefined,
    });

    React.useEffect(() => {
        // Handler to call on window resize
        function handleResize() {
            // Set window width/height to state
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []); // Empty array ensures that effect is only run on mount

    return windowSize;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateConnectionParam = (connectionParam: any) => {
    // v3 -> v4
    if (Array.isArray(connectionParam.openedStreams)) {
        connectionParam.openedStreams = Object.fromEntries(
            connectionParam.openedStreams.map((openedStream: string) => [
                openedStream,
                { filterStr: undefined },
            ])
        );
    }

    return connectionParam;
};
