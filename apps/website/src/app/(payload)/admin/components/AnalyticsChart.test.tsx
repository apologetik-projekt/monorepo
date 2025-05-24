import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react'; // Added waitFor
import '@testing-library/jest-dom'; 
import AnalyticsChart from './AnalyticsChart';

// Mock @visx/xychart components
jest.mock('@visx/xychart', () => ({
  XYChart: ({ children }) => <div data-testid="xychart">{children}</div>,
  AnimatedAxis: ({ orientation, label }) => <div data-testid={`animated-axis-${orientation}`}>{label}</div>,
  AnimatedGrid: () => <div data-testid="animated-grid" />,
  LineSeries: () => <div data-testid="line-series" />,
  Tooltip: () => <div data-testid="tooltip" />,
}));

describe('AnalyticsChart Component with Plausible API', () => {
  beforeEach(() => {
    // Mock global.fetch and provide a default successful empty response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ meta: { time_labels: [] }, results: [] }),
        text: () => Promise.resolve(''), // Added for error responses that might call .text()
      })
    );
  });

  afterEach(() => {
    // Clear the fetch mock after each test
    fetch.mockClear();
    jest.restoreAllMocks(); // Restore any other mocks, e.g. console if spied
  });

  test('renders loading state and then "No data available..." for default range', async () => {
    render(<AnalyticsChart />);
    
    const selectElement = screen.getByLabelText(/select time range/i);
    expect(selectElement).toBeInTheDocument();
    expect(selectElement).toHaveValue('month'); // Default value
    
    // Initially, "Loading..." should be shown
    expect(screen.getByText(/loading chart data.../i)).toBeInTheDocument();

    // Wait for the initial fetch to complete (mocked to return empty data)
    await waitFor(() => {
      expect(screen.getByText(/no data available for the selected range/i)).toBeInTheDocument();
    });

    // Check that fetch was called for the initial 'month' load
    expect(fetch).toHaveBeenCalledWith(
      'https://anna.apologetik-projekt.de/api/v2/query',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"date_range":"month"'),
      })
    );
    // Check for mocked chart elements (even if no data, chart structure might render)
    expect(screen.getByTestId('xychart')).toBeInTheDocument();
  });

  test('fetches and processes data when time range changes to "today"', async () => {
    // Mock for the initial 'month' load (can be empty as it's not the focus of this test)
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ meta: { time_labels: [] }, results: [] }),
      text: async () => '',
    });
    render(<AnalyticsChart />);
    
    const selectElement = screen.getByLabelText(/select time range/i);

    // Mock for the "today" selection
    const todayData = {
      meta: { time_labels: ["2023-01-02T08:00:00", "2023-01-02T09:00:00"] },
      results: [
        { dimensions: ["2023-01-02T08:00:00"], metrics: [5] },
        { dimensions: ["2023-01-02T09:00:00"], metrics: [8] },
      ]
    };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => todayData,
      text: async () => '',
    });
    
    fireEvent.change(selectElement, { target: { value: 'today' } });
    expect(selectElement).toHaveValue('today');

    // Wait for loading to finish and UI to update
    await waitFor(() => {
      // Check fetch call for "today"
      expect(fetch).toHaveBeenCalledWith(
        'https://anna.apologetik-projekt.de/api/v2/query',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"date_range":"day"'), // For "today"
        })
      );
      // Check if the Y-axis label is "Visitors" (it should always be this now)
      expect(screen.getByTestId('animated-axis-left')).toHaveTextContent('Visitors');
      // Check if the bottom axis label updates to "Today"
      expect(screen.getByTestId('animated-axis-bottom')).toHaveTextContent('Today');
    });
     // Example: Check if the chart component is rendered (even if data points aren't specifically checked)
    expect(screen.getByTestId('xychart')).toBeInTheDocument();
    expect(screen.queryByText(/loading chart data.../i)).not.toBeInTheDocument();
    expect(screen.queryByText(/no data available for the selected range/i)).not.toBeInTheDocument();

  });

  test('displays an error message if API call fails', async () => {
    // Mock for initial load (can be empty)
     fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ meta: { time_labels: [] }, results: [] }),
      text: async () => '',
    });
    render(<AnalyticsChart />);

    // Mock fetch to return an error
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => 'Internal Server Error', // Or json: async () => ({ message: ... })
    });

    const selectElement = screen.getByLabelText(/select time range/i);
    // Change selection to trigger a new fetch
    fireEvent.change(selectElement, { target: { value: 'week' } });

    // Wait for the error message to appear
    expect(await screen.findByText(/failed to fetch data: 500/i)).toBeInTheDocument();
    expect(screen.getByText(/please check the console for more details/i)).toBeInTheDocument();
    
    // Ensure chart is not shown
    expect(screen.queryByTestId('xychart')).not.toBeInTheDocument();
  });

  test('handles authentication error from API', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ meta: { time_labels: [] }, results: [] }),
      text: async () => '',
    });
    render(<AnalyticsChart />);
  
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401, // Simulate authentication error
      text: async () => 'Unauthorized',
    });
  
    const selectElement = screen.getByLabelText(/select time range/i);
    fireEvent.change(selectElement, { target: { value: 'week' } });
  
    expect(await screen.findByText(/failed to fetch data: 401/i)).toBeInTheDocument();
    expect(await screen.findByText(/authentication failed/i)).toBeInTheDocument();
  });
});
