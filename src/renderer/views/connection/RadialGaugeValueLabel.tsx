import React, { FC } from 'react';
import { ChartShallowDataShape } from 'reaviz';

export interface CustomRadialGaugeValueLabelProps {
    data: ChartShallowDataShape;
}

/**
 * A custom RadialGaugeValueLabel for Metrics.
 * It use no animation and have a similar font as <Typography />.
 * When data is set to -1, it means that the metric is not available yet.
 */
export const CustomRadialGaugeValueLabel: FC<
    Partial<CustomRadialGaugeValueLabelProps>
> = ({ data }) => {
    const val = data?.data as number;
    return (
        <text
            dy="-0.5em"
            x="0"
            y="15"
            textAnchor="middle"
            fontFamily="Roboto, Helvetica, Arial, sans-serif"
        >
            {val >= 0 ? val.toFixed(2) : 'N/A'}
        </text>
    );
};
