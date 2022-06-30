import * as React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Line, LineChart, LineSeries } from 'reaviz';
import { Box, Typography } from '@mui/material';
import { useWindowSize } from 'renderer/utils';
import { useAppSelector } from '../../redux/store';

const DetailedMetrics = () => {
    const { currentConnection } = useAppSelector((state) => state.connection);
    const metrics = useAppSelector((state) => state.metrics[currentConnection]);
    const { t } = useTranslation();
    const size = useWindowSize();

    // color and name for metrics
    const colorSchema = React.useRef({
        pravega_segmentstore_segment_read_latency_ms_seconds: 'skyblue',
        pravega_segmentstore_segment_write_latency_ms_seconds: 'greenyellow',
        pravega_segmentstore_segment_read_bytes_per_second: 'gold',
        pravega_segmentstore_segment_write_bytes_per_second: 'orangered',
    });
    const displayName = React.useRef({
        pravega_segmentstore_segment_read_latency_ms_seconds:
            'Segment read latency in milliseconds',
        pravega_segmentstore_segment_write_latency_ms_seconds:
            'Segment write latency in milliseconds',
        pravega_segmentstore_segment_read_bytes_per_second:
            'Segment read bytes per second',
        pravega_segmentstore_segment_write_bytes_per_second:
            'Segment write bytes per second',
    });

    const now = Date.now();
    const metricsData = Object.entries(metrics)
        .filter(([_, val]) => val)
        // for accumulated metrics, we need to get the difference
        // between the current value and the previous one
        .map(([key, val]): [string, number[]] => {
            if (key.endsWith('bytes_global_total')) {
                const data = val.slice(-60);
                const res = [...data];
                for (let i = 1; i < data.length; i += 1) {
                    res[i] = data[i] - data[i - 1];
                }
                return [
                    key.replace('bytes_global_total', 'bytes_per_second'),
                    res.slice(1),
                ];
            }
            return [key, val.slice(-60)];
        })
        // add time to it and return in LineChart format
        .map(([key, val]) => {
            return {
                key,
                data: val.map((v, i) => ({
                    key: new Date(now - (val.length - i) * 1000),
                    data: v,
                })),
            };
        })
        // make sure each key's position is in fixed position
        // from time to time so the color of each key is fixed
        .sort((a, b) => a.key.localeCompare(b.key));
    const bytesMetircsData = metricsData.filter(
        (_) => _.key.endsWith('bytes_per_second') && _.data.length > 1
        // small data.length will cause undefined error
    );
    const latencyMetircsData = metricsData.filter(
        (_) => _.key.endsWith('latency_ms_seconds') && _.data.length > 1
        // small data.length will cause undefined error
    );

    return (
        <Box sx={{ padding: 2, paddingLeft: 6 }}>
            <Typography variant="h5" component="div" marginBottom={2}>
                {t('views.connection.metrics.title')}
            </Typography>
            {metricsData.length ? (
                <>
                    {bytesMetircsData.length && (
                        <LineChart
                            width={(size.width ?? 1280) - 300}
                            height={((size.height ?? 720) - 200) / 2}
                            series={
                                <LineSeries
                                    type="grouped"
                                    animated={false}
                                    line={
                                        <Line
                                            strokeWidth={3}
                                            // reaviz - line chart - multi series - custom line style
                                            // @ts-expect-error
                                            style={(data) => ({
                                                stroke: colorSchema.current[
                                                    data[0]
                                                        .key as keyof typeof colorSchema.current
                                                ],
                                            })}
                                        />
                                    }
                                />
                            }
                            data={bytesMetircsData}
                        />
                    )}
                    {latencyMetircsData.length && (
                        <LineChart
                            width={(size.width ?? 1280) - 300}
                            height={((size.height ?? 720) - 200) / 2}
                            series={
                                <LineSeries
                                    type="grouped"
                                    animated={false}
                                    line={
                                        <Line
                                            strokeWidth={3}
                                            // reaviz - line chart - multi series - custom line style
                                            // @ts-expect-error
                                            style={(data) => ({
                                                stroke: colorSchema.current[
                                                    data[0]
                                                        .key as keyof typeof colorSchema.current
                                                ],
                                            })}
                                        />
                                    }
                                />
                            }
                            data={latencyMetircsData}
                        />
                    )}
                    <Box id="legend" sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        {metricsData.map((_) => (
                            <Box
                                key={_.key}
                                sx={{ display: 'flex', margin: 1, width: 400 }}
                            >
                                <div
                                    key={_.key}
                                    style={{
                                        display: 'inline-block',
                                        width: 25,
                                        height: 25,
                                        borderRadius: '50%',
                                        borderColor:
                                            colorSchema.current[
                                                _.key as keyof typeof colorSchema.current
                                            ],
                                        backgroundColor:
                                            colorSchema.current[
                                                _.key as keyof typeof colorSchema.current
                                            ],
                                        marginRight: 5,
                                    }}
                                />
                                <Typography variant="body1">
                                    {
                                        displayName.current[
                                            _.key as keyof typeof displayName.current
                                        ]
                                    }
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </>
            ) : (
                <>
                    <Typography variant="body1">
                        {t('views.connection.metrics.content1')}
                    </Typography>
                    <Typography variant="body1">
                        <Trans
                            defaults={t('views.connection.metrics.content2')}
                            components={{ code: <code /> }}
                        />
                    </Typography>
                </>
            )}
        </Box>
    );
};

export default DetailedMetrics;
