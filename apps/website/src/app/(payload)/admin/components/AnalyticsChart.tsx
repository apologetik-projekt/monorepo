"use client";
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { XYChart, AnimatedAxis, AnimatedGrid, AreaSeries, Tooltip } from '@visx/xychart';

interface DataPoint { x: Date; y: number; }
const getX = (d: DataPoint) => d.x;
const getY = (d: DataPoint) => d.y;

const getXAxisTickFormat = (date: Date, range: string): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) return String(date);
  if (range === 'today') return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (range === 'week') return date.toLocaleDateString([], { weekday: 'short' });
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const fetchAnalyticsData = async (timeRange: string): Promise<DataPoint[]> => {
  const plausibleApiKey = process.env.PLAUSIBLE_API_KEY || process.env.NEXT_PUBLIC_PLAUSIBLE_API_KEY;

  if (!plausibleApiKey) {
    throw new Error("PLAUSIBLE_API_KEY is not configured. Please set the environment variable.");
  }

  let queryBody: any = {
    site_id: "apologetik-projekt.de",
    metrics: ["visitors"],
    include: { time_labels: true }
  };

  if (timeRange === 'today') {
    queryBody.date_range = "day";
    queryBody.dimensions = ["time:hour"];
  } else if (timeRange === 'week') {
    queryBody.date_range = "7d";
    queryBody.dimensions = ["time:day"];
  } else { // month
    queryBody.date_range = "month";
    queryBody.dimensions = ["time:day"];
  }

  console.log('Fetching Plausible data with query:', JSON.stringify(queryBody, null, 2));
  const response = await fetch('https://anna.apologetik-projekt.de/api/v2/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${plausibleApiKey}`,
    },
    body: JSON.stringify(queryBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Plausible API Error:', response.status, errorText);
    let errorMessage = `Failed to fetch data: ${response.status}.`;
    if (response.status === 401 || response.status === 403) {
      errorMessage += " Authentication failed. Check your API key or permissions.";
    } else {
      errorMessage += " Please check the console for more details.";
    }
    throw new Error(errorMessage);
  }

  const plausibleData = await response.json();
  console.log('Plausible API Response:', plausibleData);

  let transformedData: DataPoint[] = [];
  if (plausibleData.meta?.time_labels && plausibleData.results) {
      transformedData = plausibleData.meta.time_labels.map((label: string) => {
          const resultEntry = plausibleData.results.find((r: any) => r.dimensions[0] === label);
          return {
              x: new Date(label),
              y: resultEntry ? resultEntry.metrics[0] : 0,
          };
      });
  } else if (plausibleData.results) {
      transformedData = plausibleData.results.map((item: any) => ({
          x: new Date(item.dimensions[0]),
          y: item.metrics[0],
      }));
  }

  return transformedData.sort((a, b) => a.x.getTime() - b.x.getTime());
};


const AnalyticsChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('month');

  const { data: chartData, isLoading, isError, error } = useQuery<DataPoint[], Error>(
    ['analyticsData', timeRange],
    () => fetchAnalyticsData(timeRange),
    {
      // keepPreviousData: true, // Optional: consider if you want to show stale data while new data loads
      // staleTime: 5 * 60 * 1000, // Optional: 5 minutes
    }
  );

  const cardStyle: React.CSSProperties = {
    padding: '20px',
    border: '1px solid #e0e0e0',
    borderRadius: '3px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
    backgroundColor: '#ffffff',
    marginTop: '20px',
  };

  return (
    <div style={cardStyle}>
      <div>
        <h3 style={{ marginBottom: '15px', marginTop: '0px', fontWeight: 500 }}>Webseiten Aufrufe</h3>
        <label htmlFor="timeRangeSelect">Zeitraum auswählen: </label>
        <select
          id="timeRangeSelect"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          style={{ marginBottom: '10px' }}
          disabled={isLoading}
        >
          <option value="today">Heute</option>
          <option value="week">Diese Woche</option>
          <option value="month">Dieser Monat</option>
        </select>

        {isLoading && <p>Lade Diagrammdaten...</p>}
        {isError && <p style={{ color: 'red' }}>Fehler: {error?.message || 'Ein unbekannter Fehler ist aufgetreten'}</p>}
        
        {!isLoading && !isError && (!chartData || chartData.length === 0) && <p>Keine Daten für den ausgewählten Zeitraum verfügbar.</p>}

        {!isLoading && !isError && chartData && chartData.length > 0 && (
          <XYChart
            height={300}
            xScale={{ type: 'time' }}
            yScale={{ type: 'linear' }}
            margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
          >
            <AnimatedGrid columns={false} numTicks={5} stroke="#e0e0e0" />
            <AnimatedAxis orientation="left" numTicks={5} />
            <AnimatedAxis
              orientation="bottom"
              label="Zeitraum"
              numTicks={timeRange === 'today' ? 6 : (timeRange === 'week' ? 7 : 10)}
              tickFormat={(d) => getXAxisTickFormat(d as Date, timeRange)}
            />
            <AreaSeries
              dataKey="area-1"
              data={chartData || []}
              xAccessor={getX}
              yAccessor={getY}
              fillOpacity={0.4}
              lineProps={{ stroke: '#4338ca', strokeWidth: 2 }}
            />
            <Tooltip
              snapTooltipToDatumX
              snapTooltipToDatumY
              showVerticalCrosshair
              showSeriesGlyphs
              renderTooltip={({ tooltipData }) => (
                <div style={{ padding: '5px', backgroundColor: 'white', border: '1px solid #ccc', boxShadow: '2px 2px 5px rgba(0,0,0,0.1)' }}>
                  {tooltipData?.nearestDatum?.datum && (
                    <>
                      <div><strong>Zeit:</strong> {getXAxisTickFormat(getX(tooltipData.nearestDatum.datum), timeRange)}</div>
                      <div><strong>Aufrufe:</strong> {getY(tooltipData.nearestDatum.datum)}</div>
                    </>
                  )}
                  {!tooltipData?.nearestDatum?.datum && <div>Über einen Punkt fahren</div>}
                </div>
              )}
            />
          </XYChart>
        )}
        {/* Removed the paragraph displaying "Selected Time Range: {timeRange}" */}
      </div>
    </div>
  );
};

export default AnalyticsChart;
