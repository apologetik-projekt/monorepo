import React, { useState, useEffect } from 'react';
import { XYChart, AnimatedAxis, AnimatedGrid, LineSeries, Tooltip } from '@visx/xychart';
// import { genDateValue } from '@visx/mock-data'; // No longer using genDateValue
import { Card } from '@payloadcms/ui/elements/Card';

interface DataPoint { x: Date; y: number; }
const getX = (d: DataPoint) => d.x;
const getY = (d: DataPoint) => d.y;

// Helper function for x-axis tick formatting
const getXAxisTickFormat = (date: Date, range: string): string => {
  if (!(date instanceof Date)) return String(date); // Fallback for unexpected types
  if (range === 'today') return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // e.g., "08:00 AM"
  if (range === 'week') return date.toLocaleDateString([], { weekday: 'short' }); // e.g., "Mon"
  // Default for month or other cases
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' }); // e.g., "Jan 15"
};

const AnalyticsChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('month');
  const [chartData, setChartData] = useState<DataPoint[]>([]);

  useEffect(() => {
    const now = new Date();
    let newData: DataPoint[] = [];
    console.log('Updating chart data for time range:', timeRange);

    if (timeRange === 'today') {
      for (let i = 0; i < 24; i++) { // 24 hours
        newData.push({
          x: new Date(now.getFullYear(), now.getMonth(), now.getDate(), i),
          // Simulate lower activity during early morning/late night
          y: Math.floor(Math.random() * (i > 6 && i < 22 ? 800 : 200)) + 50
        });
      }
    } else if (timeRange === 'week') {
      const dayOfWeek = now.getDay(); // 0 (Sun) - 6 (Sat)
      // Assuming Sunday is the start of the week (dayOfWeek = 0)
      const firstDayOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
      for (let i = 0; i < 7; i++) { // 7 days
        const day = new Date(firstDayOfWeek.getFullYear(), firstDayOfWeek.getMonth(), firstDayOfWeek.getDate() + i);
        newData.push({
          x: day,
          y: Math.floor(Math.random() * 5000) + 500 // Random views for the day
        });
      }
    } else { // Default to 'month'
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        newData.push({
          x: new Date(now.getFullYear(), now.getMonth(), i),
          y: Math.floor(Math.random() * 3000) + 300 // Random views for the day
        });
      }
    }
    // Ensure data is sorted by date for time scale
    setChartData(newData.sort((a, b) => a.x.getTime() - b.x.getTime()));
  }, [timeRange]);

  return (
    <Card>
      <div>
        <label htmlFor="timeRangeSelect">Select Time Range: </label>
        <select 
          id="timeRangeSelect"
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          style={{ marginBottom: '10px' }}
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>

        {chartData.length > 0 ? (
          <XYChart
            height={300}
            xScale={{ type: 'time' }} // Changed to 'time' scale
            yScale={{ type: 'linear' }}
            margin={{ top: 20, right: 30, bottom: 50, left: 60 }} // Adjusted left margin for y-axis label
          >
            <AnimatedGrid columns={false} numTicks={5} />
            <AnimatedAxis orientation="left" numTicks={5} label="Views/Clicks" />
            <AnimatedAxis 
              orientation="bottom" 
              label={timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} // Dynamic label
              numTicks={timeRange === 'today' ? 6 : (timeRange === 'week' ? 7 : 10)} // Adjusted numTicks
              tickFormat={(d) => getXAxisTickFormat(d as Date, timeRange)}
            />
            <LineSeries dataKey="line-1" data={chartData} xAccessor={getX} yAccessor={getY} />
            <Tooltip
              snapTooltipToDatumX
              snapTooltipToDatumY
              showVerticalCrosshair
              showSeriesGlyphs
              renderTooltip={({ tooltipData }) => (
                <div style={{ padding: '5px', backgroundColor: 'white', border: '1px solid #ccc', boxShadow: '2px 2px 5px rgba(0,0,0,0.1)' }}>
                  {tooltipData?.nearestDatum?.datum && (
                    <>
                      <div><strong>Time:</strong> {getXAxisTickFormat(getX(tooltipData.nearestDatum.datum), timeRange)}</div>
                      <div><strong>Value:</strong> {getY(tooltipData.nearestDatum.datum)}</div>
                    </>
                  )}
                  {!tooltipData?.nearestDatum?.datum && <div>Hover over a point</div>}
                </div>
              )}
            />
          </XYChart>
        ) : (
          <p>Loading chart data or no data available for selected range...</p>
        )}
        <p style={{ marginTop: '10px' }}>Selected Time Range: {timeRange}</p>
      </div>
    </Card>
  );
};

export default AnalyticsChart;
