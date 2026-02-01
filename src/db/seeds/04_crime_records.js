export async function seed(knex) {
  await knex('crime_records').del();
  
  // Get division and crime type IDs
  const divisions = await knex('divisions').select('id', 'name');
  const crimeTypes = await knex('crime_types').select('id', 'name');
  const users = await knex('users').where('approved', true).select('id');
  
  if (divisions.length === 0 || crimeTypes.length === 0 || users.length === 0) {
    console.log('Skipping crime_records seed - dependencies not found');
    return;
  }
  
  const createdBy = users[0].id;
  const records = [];
  
  // Generate 100 sample records over the past 12 months
  const baseDate = new Date('2025-02-01');
  
  for (let i = 0; i < 100; i++) {
    const daysAgo = Math.floor(Math.random() * 365);
    const recordDate = new Date(baseDate);
    recordDate.setDate(recordDate.getDate() - daysAgo);
    
    const division = divisions[Math.floor(Math.random() * divisions.length)];
    const crimeType = crimeTypes[Math.floor(Math.random() * crimeTypes.length)];
    
    // Random coordinates within Sri Lanka bounds
    const lat = 6.0 + Math.random() * 3.5; // 6.0 to 9.5
    const lng = 79.5 + Math.random() * 2.0; // 79.5 to 81.5
    
    records.push({
      date: recordDate.toISOString().split('T')[0],
      time: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
      division_id: division.id,
      crime_type_id: crimeType.id,
      location_lat: lat.toFixed(7),
      location_lng: lng.toFixed(7),
      address: `${division.name} District`,
      count: Math.floor(Math.random() * 3) + 1,
      notes: `Sample ${crimeType.name} incident in ${division.name}`,
      created_by: createdBy
    });
  }
  
  await knex('crime_records').insert(records);
}