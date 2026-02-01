import { stringify } from 'csv-stringify/sync';
import { parse } from 'csv-parse/sync';

export const generateCSV = (data, columns) => {
  return stringify(data, {
    header: true,
    columns: columns
  });
};

export const parseCSV = (content) => {
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });
};