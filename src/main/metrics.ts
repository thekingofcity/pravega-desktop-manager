import log from 'electron-log';
import fetch from 'node-fetch';

import { ManagerPool } from './types';

const METRICS_KEYS = [
    /pravega_segmentstore_segment_read_bytes_global_total/,
    /pravega_segmentstore_segment_write_bytes_global_total/,
    /pravega_segmentstore_segment_read_latency_ms_seconds{host="\w+",quantile="0.99",}/,
    /pravega_segmentstore_segment_write_latency_ms_seconds{host="\w+",quantile="0.99",}/,
];

const getMetrics = async (
    currentConnection: string | undefined,
    managerPool: ManagerPool,
    mainWindow: Electron.BrowserWindow
) => {
    if (!currentConnection || !(currentConnection in managerPool)) return;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 500);
    try {
        const res = await fetch(
            `http://${managerPool[currentConnection].url
                .split('//')
                .at(-1)
                ?.split(':')
                .at(0)}:6061/prometheus`,
            { signal: controller.signal }
        );
        const metrics = ((await res.text()) as string)
            .split('\n')
            .filter((line) => METRICS_KEYS.some((key) => key.test(line)))
            .map((line) => [
                line.split('{').at(0),
                Number(line.split(' ').at(1)),
            ])
            .filter(([key, val]) => key && val) as [string, number][];
        mainWindow.webContents.send(
            `metrics`,
            currentConnection,
            Object.fromEntries(metrics)
        );
    } catch (err) {
        log.info(`Timeout to get metrics for ${currentConnection}`);
    } finally {
        clearTimeout(timer);
    }
};

export default getMetrics;
