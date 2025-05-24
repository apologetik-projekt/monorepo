"use client";
import React, { useState, useEffect } from 'react';
import { XYChart, AnimatedAxis, AnimatedGrid, AreaSeries, Tooltip } from '@visx/xychart'; // Replaced LineSeries with AreaSeries

interface DataPoint { x: Date; y: number; }
const getX = (d: DataPoint) => d.x;
const getY = (d: DataPoint) => d.y;

const getXAxisTickFormat = (date: Date, range: string): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) return String(date); 
  if (range === 'today') return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (range === 'week') return date.toLocaleDateString([], { weekday: 'short' });
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const AnalyticsChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('month');
  const [chartData, setChartData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cardStyle: React.CSSProperties = {
    padding: '20px',
    border: '1px solid #e0e0e0',
    borderRadius: '3px', // Updated borderRadius
    boxShadow: '0 1px 2px rgba(0,0,0,0.03)', // Updated boxShadow
    backgroundColor: '#ffffff',
    marginTop: '20px',
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      // setChartData([]); // Keep old data while loading new

      const plausibleApiKey = process.env.PLAUSIBLE_API_KEY;

      if (!plausibleApiKey) {
        setError("PLAUSIBLE_API_KEY is not configured. Please set the environment variable.");
        setLoading(false);
        return;
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

      try {
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
          setError(errorMessage);
          // Do not clear chartData here, keep old data on error
          return;
        }

        const plausibleData = await response.json();
        console.log('Plausible API Response:', plausibleData);
        
        let transformedData: DataPoint[] = [];
        if (plausibleData.meta?.time_labels && plausibleData.results) {
            transformedData = plausibleData.meta.time_labels.map((label: string) => {
                const resultEntry = plausibleData.results.find((r: any) => r.dimensions[0] === label);
                return {
                    x: new Date(label), // Ensure label is a valid date string
                    y: resultEntry ? resultEntry.metrics[0] : 0,
                };
            });
        } else if (plausibleData.results) { 
            transformedData = plausibleData.results.map((item: any) => ({
                x: new Date(item.dimensions[0]),
                y: item.metrics[0],
            }));
        }
        
        setChartData(transformedData.sort((a, b) => a.x.getTime() - b.x.getTime()));

      } catch (e: any) {
        console.error('Network or other error fetching from Plausible:', e);
        setError(`Network error: ${e.message || 'Failed to fetch data'}. See console for details.`);
        // Do not clear chartData here, keep old data on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

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
          disabled={loading}
        >
          <option value="today">Heute</option>
          <option value="week">Diese Woche</option>
          <option value="month">Dieser Monat</option>
        </select>

        {loading && <p>Lade Diagrammdaten...</p>}
        {error && <p style={{ color: 'red' }}>Fehler: {error}</p>}
        
        {!loading && !error && chartData.length === 0 && <p>Keine Daten für den ausgewählten Zeitraum verfügbar.</p>}

        {!loading && !error && chartData.length > 0 && (
          <XYChart
            height={300}
            xScale={{ type: 'time' }}
            yScale={{ type: 'linear' }}
            margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
          >
            <AnimatedGrid columns={false} numTicks={5} stroke="#e0e0e0" /> {/* Made grid lines less prominent */}
            <AnimatedAxis orientation="left" numTicks={5} /> {/* Removed Y-axis label "Visitors" */}
            <AnimatedAxis 
              orientation="bottom" 
              label="Zeitraum" // Changed label to "Zeitraum"
              numTicks={timeRange === 'today' ? 6 : (timeRange === 'week' ? 7 : 10)}
              tickFormat={(d) => getXAxisTickFormat(d as Date, timeRange)}
            />
            <AreaSeries // Replaced LineSeries with AreaSeries
              dataKey="area-1" // Changed dataKey for clarity, can be anything unique
              data={chartData}
              xAccessor={getX}
              yAccessor={getY}
              fillOpacity={0.4} // Added fillOpacity
              lineProps={{ stroke: '#4338ca', strokeWidth: 2 }} // Added lineProps
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
