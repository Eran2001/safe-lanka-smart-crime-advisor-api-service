import { v4 as uuidv4 } from 'uuid';

import db from '../db/knex.js';
import { parsePagination, buildPaginatedResponse, parseSort } from '../utils/pagination.js';
import { generateCSV, parseCSV } from '../utils/csv.js';

const allowedSortFields = ['date', 'time', 'created_at', 'count'];

export const getCrimeRecords = async (req, res, next) => {
  try {
    const { divisionId, crimeTypeId, dateFrom, dateTo, q, sort } = req.query;
    const { page, pageSize, offset } = parsePagination(req.query);
    
    let query = db('crime_records as cr')
      .select(
        'cr.*',
        'div.name as division_name',
        'ct.name as crime_type_name',
        'u.full_name as created_by_name'
      )
      .leftJoin('divisions as div', 'cr.division_id', 'div.id')
      .leftJoin('crime_types as ct', 'cr.crime_type_id', 'ct.id')
      .leftJoin('users as u', 'cr.created_by', 'u.id');
    
    if (divisionId) {
      query = query.where('cr.division_id', divisionId);
    }
    
    if (crimeTypeId) {
      query = query.where('cr.crime_type_id', crimeTypeId);
    }
    
    if (dateFrom) {
      query = query.where('cr.date', '>=', dateFrom);
    }
    
    if (dateTo) {
      query = query.where('cr.date', '<=', dateTo);
    }
    
    if (q) {
      query = query.where(function() {
        this.where('cr.address', 'like', `%${q}%`)
          .orWhere('cr.notes', 'like', `%${q}%`);
      });
    }
    
    const sortConfig = parseSort(sort, allowedSortFields);
    if (sortConfig) {
      query = query.orderBy(`cr.${sortConfig.field}`, sortConfig.direction);
    } else {
      query = query.orderBy('cr.date', 'desc').orderBy('cr.time', 'desc');
    }
    
    const totalQuery = query.clone();
    const total = await totalQuery.count('* as count').first();
    
    const records = await query.limit(pageSize).offset(offset);
    
    res.json({
      success: true,
      ...buildPaginatedResponse(records, total.count, page, pageSize)
    });
  } catch (error) {
    next(error);
  }
};

export const getCrimeRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const record = await db('crime_records as cr')
      .select(
        'cr.*',
        'div.name as division_name',
        'ct.name as crime_type_name',
        'u.full_name as created_by_name'
      )
      .leftJoin('divisions as div', 'cr.division_id', 'div.id')
      .leftJoin('crime_types as ct', 'cr.crime_type_id', 'ct.id')
      .leftJoin('users as u', 'cr.created_by', 'u.id')
      .where('cr.id', id)
      .first();
    
    if (!record) {
      const error = new Error('Crime record not found');
      error.code = 'NOT_FOUND';
      throw error;
    }
    
    res.json({
      success: true,
      data: { record }
    });
  } catch (error) {
    next(error);
  }
};

export const createCrimeRecord = async (req, res, next) => {
  try {
    const {
      date,
      time,
      divisionId,
      crimeTypeId,
      locationLat,
      locationLng,
      address,
      count,
      notes
    } = req.body;
    
    const id = uuidv4();
    
    await db('crime_records').insert({
      id,
      date,
      time,
      division_id: divisionId,
      crime_type_id: crimeTypeId,
      location_lat: locationLat,
      location_lng: locationLng,
      address,
      count: count || 1,
      notes,
      created_by: req.user.id
    });
    
    const record = await db('crime_records as cr')
      .select(
        'cr.*',
        'div.name as division_name',
        'ct.name as crime_type_name'
      )
      .leftJoin('divisions as div', 'cr.division_id', 'div.id')
      .leftJoin('crime_types as ct', 'cr.crime_type_id', 'ct.id')
      .where('cr.id', id)
      .first();
    
    res.status(201).json({
      success: true,
      data: { record }
    });
  } catch (error) {
    next(error);
  }
};

export const updateCrimeRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = {};
    
    const allowedFields = [
      'date', 'time', 'divisionId', 'crimeTypeId', 
      'locationLat', 'locationLng', 'address', 'count', 'notes'
    ];
    
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        updates[dbKey] = req.body[key];
      }
    });
    
    if (Object.keys(updates).length === 0) {
      const error = new Error('No valid fields to update');
      error.code = 'VALIDATION_ERROR';
      throw error;
    }
    
    updates.updated_at = db.fn.now();
    
    const existing = await db('crime_records').where({ id }).first();
    if (!existing) {
      const error = new Error('Crime record not found');
      error.code = 'NOT_FOUND';
      throw error;
    }
    
    await db('crime_records').where({ id }).update(updates);
    
    const record = await db('crime_records as cr')
      .select(
        'cr.*',
        'div.name as division_name',
        'ct.name as crime_type_name'
      )
      .leftJoin('divisions as div', 'cr.division_id', 'div.id')
      .leftJoin('crime_types as ct', 'cr.crime_type_id', 'ct.id')
      .where('cr.id', id)
      .first();
    
    res.json({
      success: true,
      data: { record }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCrimeRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const deleted = await db('crime_records').where({ id }).del();
    
    if (!deleted) {
      const error = new Error('Crime record not found');
      error.code = 'NOT_FOUND';
      throw error;
    }
    
    res.json({
      success: true,
      data: { message: 'Record deleted successfully' }
    });
  } catch (error) {
    next(error);
  }
};

export const exportCrimeRecords = async (req, res, next) => {
  try {
    const { divisionId, crimeTypeId, dateFrom, dateTo } = req.query;
    
    let query = db('crime_records as cr')
      .select(
        'cr.date',
        'cr.time',
        'div.name as division',
        'ct.name as crime_type',
        'cr.location_lat',
        'cr.location_lng',
        'cr.address',
        'cr.count',
        'cr.notes'
      )
      .leftJoin('divisions as div', 'cr.division_id', 'div.id')
      .leftJoin('crime_types as ct', 'cr.crime_type_id', 'ct.id');
    
    if (divisionId) query = query.where('cr.division_id', divisionId);
    if (crimeTypeId) query = query.where('cr.crime_type_id', crimeTypeId);
    if (dateFrom) query = query.where('cr.date', '>=', dateFrom);
    if (dateTo) query = query.where('cr.date', '<=', dateTo);
    
    const records = await query.orderBy('cr.date', 'desc');
    
    const csv = generateCSV(records, [
      'date', 'time', 'division', 'crime_type', 
      'location_lat', 'location_lng', 'address', 'count', 'notes'
    ]);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=crime_records.csv');
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

export const importCrimeRecords = async (req, res, next) => {
  try {
    const { dryRun } = req.query;
    
    if (!req.file) {
      const error = new Error('CSV file required');
      error.code = 'VALIDATION_ERROR';
      throw error;
    }
    
    const csvContent = req.file.buffer.toString('utf-8');
    const rows = parseCSV(csvContent);
    
    const divisions = await db('divisions').select('id', 'name');
    const crimeTypes = await db('crime_types').select('id', 'name');
    
    const divisionMap = {};
    divisions.forEach(d => { divisionMap[d.name.toLowerCase()] = d.id; });
    
    const crimeTypeMap = {};
    crimeTypes.forEach(ct => { crimeTypeMap[ct.name.toLowerCase()] = ct.id; });
    
    const records = [];
    const errors = [];
    
    rows.forEach((row, idx) => {
      const divisionId = divisionMap[row.division?.toLowerCase()];
      const crimeTypeId = crimeTypeMap[row.crime_type?.toLowerCase()];
      
      if (!divisionId) {
        errors.push({ row: idx + 1, field: 'division', message: 'Invalid division' });
      }
      if (!crimeTypeId) {
        errors.push({ row: idx + 1, field: 'crime_type', message: 'Invalid crime type' });
      }
      
      if (divisionId && crimeTypeId) {
        records.push({
          id: uuidv4(),
          date: row.date,
          time: row.time || '00:00:00',
          division_id: divisionId,
          crime_type_id: crimeTypeId,
          location_lat: row.location_lat || null,
          location_lng: row.location_lng || null,
          address: row.address || null,
          count: parseInt(row.count, 10) || 1,
          notes: row.notes || null,
          created_by: req.user.id
        });
      }
    });
    
    if (!dryRun && records.length > 0) {
      await db('crime_records').insert(records);
    }
    
    res.json({
      success: true,
      data: {
        imported: dryRun ? 0 : records.length,
        valid: records.length,
        errors
      }
    });
  } catch (error) {
    next(error);
  }
};