export async function seed(knex) {
  await knex('crime_types').del();
  
  await knex('crime_types').insert([
    { name: 'Theft' },
    { name: 'Assault' },
    { name: 'Robbery' },
    { name: 'Burglary' },
    { name: 'Cybercrime' },
    { name: 'Vandalism' },
    { name: 'Narcotics' }
  ]);
}