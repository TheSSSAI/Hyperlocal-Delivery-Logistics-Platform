import apiClient from './apiClient';
import { EarningsSummary, WeeklyStatement } from '../shared/types/earnings.types';

/**
 * Fetches the rider's earnings summary for a given period.
 * @param period - The time period to fetch the summary for ('daily' or 'weekly').
 * @param date - The specific date to anchor the period (e.g., any day within the target week). ISO 8601 format.
 * @returns A promise that resolves with the earnings summary.
 * @throws {ApiError} on failure.
 */
const getEarningsSummary = async (params: {
  period: 'daily' | 'weekly';
  date: string;
}): Promise<EarningsSummary> => {
  const response = await apiClient.get<EarningsSummary>('/earnings/summary', {
    params,
  });
  return response.data;
};

/**
 * Fetches a list of available weekly statements for the rider.
 * @returns A promise that resolves with an array of weekly statement metadata.
 * @throws {ApiError} on failure.
 */
const getWeeklyStatementsList = async (): Promise<WeeklyStatement[]> => {
    const response = await apiClient.get<WeeklyStatement[]>('/earnings/statements');
    return response.data;
};

/**
 * Fetches the URL to download a specific weekly statement PDF.
 * @param statementId - The ID of the weekly statement to download.
 * @returns A promise that resolves with the download URL.
 * @throws {ApiError} on failure.
 */
const getStatementDownloadUrl = async (statementId: string): Promise<{ url: string }> => {
    const response = await apiClient.get<{ url: string }>(`/earnings/statements/${statementId}/download`);
    return response.data;
};


export const earningsApi = {
  getEarningsSummary,
  getWeeklyStatementsList,
  getStatementDownloadUrl,
};