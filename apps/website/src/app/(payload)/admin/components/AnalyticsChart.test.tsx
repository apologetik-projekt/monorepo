import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import AnalyticsChart from './AnalyticsChart';

// Mock @visx/xychart and other @visx dependencies
// It's good practice to mock these to avoid rendering complex SVGs in unit tests
// and to prevent errors if these components have complex internal logic not relevant to this component's test.
jest.mock('@visx/xychart', () => ({
  XYChart: ({ children }) => <div data-testid="xychart">{children}</div>,
  AnimatedAxis: ({ orientation, label }) => <div data-testid={`animated-axis-${orientation}`}>{label}</div>,
  AnimatedGrid: () => <div data-testid="animated-grid" />,
  LineSeries: () => <div data-testid="line-series" />,
  Tooltip: () => <div data-testid="tooltip" />,
}));

// The actual data generation logic is complex and involves Date objects.
// For these tests, we are more interested in whether the component attempts to update
// data based on timeRange, which is signaled by console.log.
// We don't need to mock genDateValue as it's no longer directly used;
// the data generation is now internal to AnalyticsChart's useEffect.

describe('AnalyticsChart Component', () => {
  let consoleSpy;

  beforeEach(() => {
    // Spy on console.log before each test
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.log after each test
    consoleSpy.mockRestore();
  });

  test('renders correctly with default time range "This Month"', () => {
    render(<AnalyticsChart />);
    
    const selectElement = screen.getByLabelText(/select time range/i);
    expect(selectElement).toBeInTheDocument();
    expect(selectElement).toHaveValue('month'); // Default value
    
    // Check for chart presence by its mock
    expect(screen.getByTestId('xychart')).toBeInTheDocument();
    // Check for initial console log indicating data fetch for 'month'
    expect(consoleSpy).toHaveBeenCalledWith('Updating chart data for time range:', 'month');
  });

  test('allows changing time range selection', () => {
    render(<AnalyticsChart />);
    
    const selectElement = screen.getByLabelText(/select time range/i);
    
    fireEvent.change(selectElement, { target: { value: 'today' } });
    expect(selectElement).toHaveValue('today');
    
    fireEvent.change(selectElement, { target: { value: 'week' } });
    expect(selectElement).toHaveValue('week');
  });

  test('updates chart data indication when time range changes', () => {
    render(<AnalyticsChart />);
    
    const selectElement = screen.getByLabelText(/select time range/i);
    
    // Initial load for 'month' (already spied in beforeEach and asserted in the first test,
    // but we clear and check again for explicit flow per test)
    expect(consoleSpy).toHaveBeenCalledWith('Updating chart data for time range:', 'month');
    
    consoleSpy.mockClear(); 
    fireEvent.change(selectElement, { target: { value: 'today' } });
    expect(selectElement).toHaveValue('today');
    // Check that console.log was called for 'today'
    expect(consoleSpy).toHaveBeenCalledWith('Updating chart data for time range:', 'today');

    consoleSpy.mockClear();
    fireEvent.change(selectElement, { target: { value: 'week' } });
    expect(selectElement).toHaveValue('week');
    // Check that console.log was called for 'week'
    expect(consoleSpy).toHaveBeenCalledWith('Updating chart data for time range:', 'week');
  });

  test('renders axis labels based on props', () => {
    render(<AnalyticsChart />);
    // Default is 'month'
    expect(screen.getByTestId('animated-axis-bottom')).toHaveTextContent('Month');
    expect(screen.getByTestId('animated-axis-left')).toHaveTextContent('Views/Clicks');

    // Change to 'today'
    const selectElement = screen.getByLabelText(/select time range/i);
    fireEvent.change(selectElement, { target: { value: 'today' } });
    expect(screen.getByTestId('animated-axis-bottom')).toHaveTextContent('Today');
    
    // Change to 'week'
    fireEvent.change(selectElement, { target: { value: 'week' } });
    expect(screen.getByTestId('animated-axis-bottom')).toHaveTextContent('Week');
  });
});
