import Papa from 'papaparse';
import { RunRecord } from '@/types';

interface RawCsvRow {
  date?: string;
  person?: string;
  'miles run'?: string;
  [key: string]: string | undefined;
}

/**
 * Parses uploaded CSV file and extracts run records
 * Handles various column name formats and trims whitespace
 */
export async function parseCsvFile(file: File): Promise<RunRecord[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<RawCsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.toLowerCase().trim(),
      complete: (results: { data: any[]; }) => {
        try {
          const records = results.data.map((row: { [x: string]: string; date: string; person: string; }, index: number) => {
            const date = row.date?.trim() || '';
            const person = row.person?.trim() || '';
            const milesStr = row['miles run']?.trim() || row['milesrun']?.trim() || '';
            
            const milesRun = parseFloat(milesStr);
            
            if (!date || !person || isNaN(milesRun)) {
              throw new Error(`Invalid data at row ${index + 2}`);
            }
            
            return {
              date,
              person,
              milesRun,
            };
          });
          
          resolve(records);
        } catch (error) {
          reject(error);
        }
      },
      error: (error: { message: any; }) => {
        reject(new Error(`CSV parsing failed: ${error.message}`));
      },
    });
  });
}