export async function seed(knex) {
  await knex('prediction_zones').del();
  
  const divisions = await knex('divisions').limit(5).select('id');
  
  if (divisions.length === 0) {
    console.log('Skipping prediction_zones seed - no divisions found');
    return;
  }
  
  const zones = [];
  const risks = ['LOW', 'MEDIUM', 'HIGH'];
  
  divisions.forEach((division, idx) => {
    const baseLat = 6.9 + (idx * 0.1);
    const baseLng = 79.85 + (idx * 0.1);
    
    zones.push({
      division_id: division.id,
      polygon_geojson: JSON.stringify([
        [baseLng, baseLat],
        [baseLng + 0.05, baseLat],
        [baseLng + 0.05, baseLat + 0.05],
        [baseLng, baseLat + 0.05],
        [baseLng, baseLat]
      ]),
      risk: risks[idx % 3],
      score: (Math.random() * 0.5 + 0.3).toFixed(3)
    });
  });
  
  await knex('prediction_zones').insert(zones);
}