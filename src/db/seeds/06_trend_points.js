export async function seed(knex) {
  await knex('trend_points').del();
  
  const divisions = await knex('divisions').limit(3).select('id');
  
  const points = [];
  const baseDate = new Date('2025-02-01');
  
  // Generate monthly trend points for the past year
  for (let month = 0; month < 12; month++) {
    const pointDate = new Date(baseDate);
    pointDate.setMonth(pointDate.getMonth() - month);
    
    // Overall trend (no division)
    points.push({
      date: pointDate.toISOString().split('T')[0],
      total: Math.floor(Math.random() * 100) + 50,
      division_id: null
    });
    
    // Division-specific trends
    divisions.forEach(division => {
      points.push({
        date: pointDate.toISOString().split('T')[0],
        total: Math.floor(Math.random() * 30) + 10,
        division_id: division.id
      });
    });
  }
  
  await knex('trend_points').insert(points);
}