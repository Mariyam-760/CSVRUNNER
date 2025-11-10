import { RunRecord, ValidationResult } from '@/types';

/**
 * Validates run records for data integrity
 * Checks for required fields, valid dates, and positive miles
 */
export function validateRunRecords(records: RunRecord[]): ValidationResult {
  const errors: string[] = [];

  if (!records || records.length === 0) {
    errors.push('CSV file contains no valid data rows');
    return { isValid: false, errors };
  }

  records.forEach((record, idx) => {
    const rowNumber = idx + 2; // Account for header row

    // Validate person name
    if (!record.person || record.person.trim() === '') {
      errors.push(`Row ${rowNumber}: Missing person name`);
    }

    // Validate date format (basic check)
    if (!record.date || record.date.trim() === '') {
      errors.push(`Row ${rowNumber}: Missing date`);
    } else if (!isValidDateFormat(record.date)) {
      errors.push(`Row ${rowNumber}: Invalid date format '${record.date}' (expected YYYY-MM-DD or MM/DD/YYYY)`);
    }

    // Validate miles run
    if (isNaN(record.milesRun)) {
      errors.push(`Row ${rowNumber}: Invalid miles value`);
    } else if (record.milesRun < 0) {
      errors.push(`Row ${rowNumber}: Miles cannot be negative`);
    } else if (record.milesRun > 200) {
      errors.push(`Row ${rowNumber}: Miles value (${record.milesRun}) seems unrealistic`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Checks if date string matches common formats
 */
function isValidDateFormat(dateStr: string): boolean {
  // Check YYYY-MM-DD format
  const iso = /^\d{4}-\d{2}-\d{2}$/;
  // Check MM/DD/YYYY or M/D/YYYY format
  const us = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
  // Check DD-MM-YYYY format
  const eu = /^\d{1,2}-\d{1,2}-\d{4}$/;
  
  if (!iso.test(dateStr) && !us.test(dateStr) && !eu.test(dateStr)) {
    return false;
  }
  
  // Try to create a valid date object
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date.getTime());
}