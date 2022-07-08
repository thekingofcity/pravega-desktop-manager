import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RadialGauge, RadialGaugeSeries } from 'reaviz';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAppSelector, useAppDispatch } from '../../redux/store';
import { setCurrentTab } from '../../redux/connection';
import { CustomRadialGaugeValueLabel } from './RadialGaugeValueLabel';

/**
 * Metrics shown on the overview page.
 */
const Metrics = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const theme = useTheme();

    const { currentConnection } = useAppSelector((state) => state.connection);
    const metrics = useAppSelector((state) => state.metrics[currentConnection]);

    // preserve throughput data for several seconds to calculate max
    const segmentReadThroughputMaxRef = React.useRef([] as number[]);
    const segmentWriteThroughputMaxRef = React.useRef([] as number[]);

    // data at (t) - data at (t-2) to smooth the value
    const segmentReadThroughput =
        ((metrics?.pravega_segmentstore_segment_read_bytes_global_total?.at(
            -1
        ) ?? 0) -
            (metrics?.pravega_segmentstore_segment_read_bytes_global_total?.at(
                -3
            ) ?? 2)) /
        2;
    segmentReadThroughputMaxRef.current.push(segmentReadThroughput);
    // only preserve last 5 seconds of data to calculate the max
    segmentReadThroughputMaxRef.current =
        segmentReadThroughputMaxRef.current.slice(-5);
    const segmentReadThroughputMax = Math.max(
        ...segmentReadThroughputMaxRef.current
    );
    // data at (t) - data at (t-2) to smooth the value
    const segmentWriteThroughput =
        ((metrics?.pravega_segmentstore_segment_write_bytes_global_total?.at(
            -1
        ) ?? 0) -
            (metrics?.pravega_segmentstore_segment_write_bytes_global_total?.at(
                -3
            ) ?? 2)) /
        2;
    segmentWriteThroughputMaxRef.current.push(segmentWriteThroughput);
    // only preserve last 5 seconds of data to calculate the max
    segmentWriteThroughputMaxRef.current =
        segmentWriteThroughputMaxRef.current.slice(-5);
    const segmentWriteThroughputMax = Math.max(
        ...segmentWriteThroughputMaxRef.current
    );

    const segmentReadLatency =
        metrics?.pravega_segmentstore_segment_read_latency_ms_seconds?.at(-1) ??
        -1;
    const segmentWriteLatency =
        metrics?.pravega_segmentstore_segment_write_latency_ms_seconds?.at(
            -1
        ) ?? -1;

    // data shown in UI
    const metricsData = {
        'Segment Read Rate(bps)': {
            data: segmentReadThroughput,
            // if data is N/A (=== -1), set max to 300 so the gauge looks good
            max: segmentReadThroughputMax < 0 ? 300 : segmentReadThroughputMax,
        },
        'Segment Write Rate(bps)': {
            data: segmentWriteThroughput,
            // if data is N/A (=== -1), set max to 300 so the gauge looks good
            max:
                segmentWriteThroughputMax < 0 ? 300 : segmentWriteThroughputMax,
        },
        'Segment Read Latency(ms)': {
            data: segmentReadLatency,
            max: 300,
        },
        'Segment Write Latency(ms)': {
            data: segmentWriteLatency,
            max: 300,
        },
    };

    return (
        <Card variant="outlined" sx={{ margin: 1 }}>
            <CardContent>
                <Typography variant="h5" component="div" marginBottom={2}>
                    {t('views.connection.overview.metrics.title')}
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                    }}
                >
                    {metrics &&
                        Object.entries(metricsData).map(
                            ([key, { data, max }]) => (
                                <RadialGauge
                                    key={key}
                                    height={175}
                                    width={175}
                                    maxValue={max * 1.25}
                                    data={[{ key, data }]}
                                    // customize some properties
                                    series={
                                        <RadialGaugeSeries
                                            arcWidth={10}
                                            colorScheme={[
                                                theme.palette.background
                                                    .default,
                                            ]}
                                            valueLabel={
                                                <CustomRadialGaugeValueLabel />
                                            }
                                        />
                                    }
                                />
                            )
                        )}
                </Box>
            </CardContent>
            <CardActions>
                <Button
                    size="small"
                    onClick={() => {
                        // set current tab, so ConnectionTabs will display the right underline
                        dispatch(setCurrentTab('metrics'));
                        // redirect to metrics tab
                        navigate(`/connection/${currentConnection}/metrics`);
                    }}
                >
                    {t('views.connection.overview.metrics.details')}
                </Button>
            </CardActions>
        </Card>
    );
};

export default Metrics;
