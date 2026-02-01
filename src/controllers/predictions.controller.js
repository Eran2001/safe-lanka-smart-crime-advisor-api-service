import { v4 as uuidv4 } from 'uuid';

import db from '../db/knex.js';

export const getHeatmap = async (req, res, next) => {
  try {
    const zones = await db('prediction_zones as pz')
      .select('pz.*', 'div.name as division_name')
      .leftJoin('divisions as div', 'pz.division_id', 'div.id');
    
    res.json({
      success: true,
      data: { zones }
    });
  } catch (error) {
    next(error);
  }
};

export const createHeatmapZone = async (req, res, next) => {
  try {
    const { divisionId, polygonGeojson, risk, score } = req.body;
    
    const id = uuidv4();
    await db('prediction_zones').insert({
      id,
      division_id: divisionId,
      polygon_geojson: JSON.stringify(polygonGeojson),
      risk,
      score
    });
    
    const zone = await db('prediction_zones').where({ id }).first();
    
    res.status(201).json({
      success: true,
      data: { zone }
    });
  } catch (error) {
    next(error);
  }
};

export const updateHeatmapZone = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = {};
    
    if (req.body.polygonGeojson) updates.polygon_geojson = JSON.stringify(req.body.polygonGeojson);
    if (req.body.risk) updates.risk = req.body.risk;
    if (req.body.score !== undefined) updates.score = req.body.score;
    
    updates.updated_at = db.fn.now();
    
    await db('prediction_zones').where({ id }).update(updates);
    
    const zone = await db('prediction_zones').where({ id }).first();
    
    res.json({
      success: true,
      data: { zone }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteHeatmapZone = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db('prediction_zones').where({ id }).del();
    
    res.json({
      success: true,
      data: { message: 'Zone deleted' }
    });
  } catch (error) {
    next(error);
  }
};

export const getTrends = async (req, res, next) => {
  try {
    const { divisionId, dateFrom, dateTo } = req.query;
    
    let query = db('trend_points as tp')
      .select('tp.*', 'div.name as division_name')
      .leftJoin('divisions as div', 'tp.division_id', 'div.id');
    
    if (divisionId) {
      query = query.where('tp.division_id', divisionId);
    }
    
    if (dateFrom) {
      query = query.where('tp.date', '>=', dateFrom);
    }
    
    if (dateTo) {
      query = query.where('tp.date', '<=', dateTo);
    }
    
    const points = await query.orderBy('tp.date', 'asc');
    
    res.json({
      success: true,
      data: { points }
    });
  } catch (error) {
    next(error);
  }
};

export const createTrendPoint = async (req, res, next) => {
  try {
    const { date, total, divisionId } = req.body;
    
    const id = uuidv4();
    await db('trend_points').insert({
      id,
      date,
      total,
      division_id: divisionId || null
    });
    
    const point = await db('trend_points').where({ id }).first();
    
    res.status(201).json({
      success: true,
      data: { point }
    });
  } catch (error) {
    next(error);
  }
};

export const updateTrendPoint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = {};
    
    if (req.body.total !== undefined) updates.total = req.body.total;
    if (req.body.date) updates.date = req.body.date;
    
    await db('trend_points').where({ id }).update(updates);
    
    const point = await db('trend_points').where({ id }).first();
    
    res.json({
      success: true,
      data: { point }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTrendPoint = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db('trend_points').where({ id }).del();
    
    res.json({
      success: true,
      data: { message: 'Trend point deleted' }
    });
  } catch (error) {
    next(error);
  }
};