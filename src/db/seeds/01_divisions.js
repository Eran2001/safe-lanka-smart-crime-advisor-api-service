export async function seed(knex) {
  await knex('divisions').del();
  
  await knex('divisions').insert([
    { name: 'Colombo', code: 'COL' },
    { name: 'Gampaha', code: 'GAM' },
    { name: 'Kalutara', code: 'KAL' },
    { name: 'Kandy', code: 'KAN' },
    { name: 'Matale', code: 'MAT' },
    { name: 'Nuwara Eliya', code: 'NUE' },
    { name: 'Galle', code: 'GAL' },
    { name: 'Matara', code: 'MTR' },
    { name: 'Hambantota', code: 'HAM' },
    { name: 'Jaffna', code: 'JAF' },
    { name: 'Kilinochchi', code: 'KIL' },
    { name: 'Mannar', code: 'MAN' },
    { name: 'Vavuniya', code: 'VAV' },
    { name: 'Mullaitivu', code: 'MUL' }
  ]);
}