import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnalyticsChart from './AnalyticsChart'; // Corrected import path

// Mock fetch
global.fetch = jest.fn();

// Mock process.env
const originalEnv = process.env;

const mockPlausibleData = {
  meta: {
    time_labels: ['2023-01-01T00:00:00.000Z', '2023-01-02T00:00:00.000Z'],
  },
  results: [
    { dimensions: ['2023-01-01T00:00:00.000Z'], metrics: [10] },
    { dimensions: ['2023-01-02T00:00:00.000Z'], metrics: [20] },
  ],
};

describe('AnalyticsChart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('Data Fetching', () => {
    it('should call fetch with Authorization header when PLAUSIBLE_API_KEY is set', async () => {
      process.env.PLAUSIBLE_API_KEY = 'test-api-key';
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPlausibleData,
      });

      render(<AnalyticsChart />);
      
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/v2/query'),
          expect.objectContaining({
            headers: expect.objectContaining({
              'Authorization': 'Bearer test-api-key',
            }),
          })
        );
      });
    });

    it('should display error and not call fetch if PLAUSIBLE_API_KEY is not set', async () => {
      delete process.env.PLAUSIBLE_API_KEY;
      render(<AnalyticsChart />);
      
      expect(await screen.findByText('Fehler: PLAUSIBLE_API_KEY is not configured. Please set the environment variable.')).toBeInTheDocument();
      expect(fetch).not.toHaveBeenCalled();
    });

    it('should display data correctly after a successful fetch', async () => {
      process.env.PLAUSIBLE_API_KEY = 'test-api-key';
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPlausibleData,
      });

      render(<AnalyticsChart />);

      await waitFor(() => {
        expect(screen.queryByText('Lade Diagrammdaten...')).not.toBeInTheDocument();
      });
      expect(screen.queryByText('Keine Daten für den ausgewählten Zeitraum verfügbar.')).not.toBeInTheDocument();
    });
    
    it('should preserve old data when a fetch is in progress', async () => {
      process.env.PLAUSIBLE_API_KEY = 'test-api-key';
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          meta: { time_labels: ['2023-02-01T00:00:00.000Z'] },
          results: [{ dimensions: ['2023-02-01T00:00:00.000Z'], metrics: [5] }],
        }),
      });

      render(<AnalyticsChart />);
      
      await waitFor(() => {
        expect(screen.queryByText('Lade Diagrammdaten...')).not.toBeInTheDocument();
      });

      (fetch as jest.Mock).mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(() => resolve({ 
          ok: true,
          json: async () => mockPlausibleData,
        }), 500))
      );
      
      fireEvent.change(screen.getByLabelText('Zeitraum auswählen:'), { target: { value: 'week' } });
      
      expect(await screen.findByText('Lade Diagrammdaten...')).toBeInTheDocument();
      expect(screen.queryByText('Keine Daten für den ausgewählten Zeitraum verfügbar.')).not.toBeInTheDocument();

      await waitFor(() => {
         expect(screen.queryByText('Lade Diagrammdaten...')).not.toBeInTheDocument();
      }, { timeout: 1000 }); 
    });


    it('should display an error message if the fetch fails', async () => {
      process.env.PLAUSIBLE_API_KEY = 'test-api-key';
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Internal Server Error',
      });

      render(<AnalyticsChart />);

      expect(await screen.findByText(/Fehler: Failed to fetch data: 500/)).toBeInTheDocument();
    });
  });

  describe('Chart Rendering and UI', () => {
    beforeEach(() => {
      process.env.PLAUSIBLE_API_KEY = 'test-api-key';
      (fetch as jest.Mock).mockResolvedValue({ 
        ok: true,
        json: async () => mockPlausibleData,
      });
    });

    it('should render the chart title "Webseiten Aufrufe"', async () => {
      render(<AnalyticsChart />);
      expect(await screen.findByRole('heading', { name: /Webseiten Aufrufe/i })).toBeInTheDocument();
    });

    it('should render translated labels for time range selector and options', async () => {
      render(<AnalyticsChart />);
      expect(screen.getByLabelText('Zeitraum auswählen:')).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Heute' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Diese Woche' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Dieser Monat' })).toBeInTheDocument();
    });

    it('should not have a Y-axis label "Visitors"', async () => {
      render(<AnalyticsChart />);
      await waitFor(() => expect(screen.queryByText('Lade Diagrammdaten...')).not.toBeInTheDocument());
      expect(screen.queryByText('Visitors')).not.toBeInTheDocument();
    });
    
    it('should no longer render the "Selected Time Range:" paragraph', async () => {
      render(<AnalyticsChart />);
      await waitFor(() => expect(screen.queryByText('Lade Diagrammdaten...')).not.toBeInTheDocument());
      expect(screen.queryByText(/Selected Time Range:/i)).not.toBeInTheDocument();
    });

    it('should display "Lade Diagrammdaten..." message during loading', async () => {
      (fetch as jest.Mock).mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: async () => mockPlausibleData,
        }), 100)) 
      );
      render(<AnalyticsChart />);
      expect(await screen.findByText('Lade Diagrammdaten...')).toBeInTheDocument();
      await waitFor(() => expect(screen.queryByText('Lade Diagrammdaten...')).not.toBeInTheDocument(), { timeout: 500 });
    });

    it('should display "Fehler: " message on error', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 403,
        text: async () => 'Forbidden',
      });
      render(<AnalyticsChart />);
      expect(await screen.findByText(/Fehler: Failed to fetch data: 403/)).toBeInTheDocument();
    });

    it('should display "Keine Daten..." message when no data is available', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ meta: { time_labels: [] }, results: [] }), 
      });
      render(<AnalyticsChart />);
      expect(await screen.findByText('Keine Daten für den ausgewählten Zeitraum verfügbar.')).toBeInTheDocument();
    });
  });
});
