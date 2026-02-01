export async function seed(knex) {
  await knex('notifications').del();
  
  await knex('notifications').insert([
    {
      message: 'System maintenance scheduled for next Sunday',
      level: 'info'
    },
    {
      message: 'High crime activity detected in Colombo district',
      level: 'critical'
    },
    {
      message: 'New update available - please refresh your dashboard',
      level: 'warning'
    }
  ]);
}