import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// The path to AnalyticsChart is relative to this test file.
import AnalyticsChart from './AnalyticsChart';

// Mocking @tanstack/react-query's useQuery
const mockUseQuery = jest.fn();
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'), // Retain other exports
  useQuery: (queryKey: unknown[], queryFn: () => Promise<unknown>, options?: unknown) => mockUseQuery(queryKey, queryFn, options),
}));

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, 
      gcTime: Infinity, 
    },
  },
});

const renderWithClient = (client: QueryClient, ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={client}>
      {ui}
    </QueryClientProvider>
  );
};

describe('AnalyticsChart', () => {
  let testQueryClient: QueryClient;

  beforeEach(() => {
    testQueryClient = createTestQueryClient();
    mockUseQuery.mockReset(); 
  });

  afterEach(() => {
    testQueryClient.clear(); 
  });

  test('renders loading state correctly', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    });

    renderWithClient(testQueryClient, <AnalyticsChart />);
    expect(screen.getByText('Lade Diagrammdaten...')).toBeInTheDocument();
  });

  test('renders error state correctly', () => {
    const errorMessage = "Failed to fetch data";
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error(errorMessage),
    });

    renderWithClient(testQueryClient, <AnalyticsChart />);
    expect(screen.getByText(`Fehler: ${errorMessage}`)).toBeInTheDocument();
  });

  test('renders data correctly when fetch is successful', async () => {
    const mockData = [
      { x: new Date('2023-01-01T10:00:00.000Z'), y: 100 },
      { x: new Date('2023-01-01T11:00:00.000Z'), y: 150 },
    ];
    mockUseQuery.mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
      error: null,
    });

    renderWithClient(testQueryClient, <AnalyticsChart />);

    expect(screen.queryByText('Lade Diagrammdaten...')).not.toBeInTheDocument();
    expect(screen.queryByText(/Fehler:/)).not.toBeInTheDocument();
    expect(screen.queryByText('Keine Daten für den ausgewählten Zeitraum verfügbar.')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Zeitraum auswählen:')).toBeEnabled();
  });

  test('renders "no data" message when fetch is successful but data is empty', () => {
    mockUseQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    });

    renderWithClient(testQueryClient, <AnalyticsChart />);
    expect(screen.getByText('Keine Daten für den ausgewählten Zeitraum verfügbar.')).toBeInTheDocument();
  });

  test('useQuery is called with the correct timeRange when selection changes', async () => {
    mockUseQuery.mockReturnValue({
      data: [], 
      isLoading: false,
      isError: false,
      error: null,
    });

    renderWithClient(testQueryClient, <AnalyticsChart />);

    expect(mockUseQuery).toHaveBeenCalledWith(
      ['analyticsData', 'month'], 
      expect.any(Function),       
      expect.any(Object)          
    );

    const selectElement = screen.getByLabelText('Zeitraum auswählen:');
    fireEvent.change(selectElement, { target: { value: 'week' } });

    await waitFor(() => {
      expect(mockUseQuery).toHaveBeenCalledWith(
        ['analyticsData', 'week'],
        expect.any(Function),
        expect.any(Object)
      );
    });

    fireEvent.change(selectElement, { target: { value: 'today' } });
    await waitFor(() => {
       expect(mockUseQuery).toHaveBeenCalledWith(
        ['analyticsData', 'today'],
        expect.any(Function),
        expect.any(Object)
      );
    });
  });
});
