import bcrypt from 'bcrypt';

export async function seed(knex) {
  await knex('users').del();
  
  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  const officerPassword = await bcrypt.hash('Officer@123', 10);
  const analystPassword = await bcrypt.hash('Analyst@123', 10);
  
  await knex('users').insert([
    {
      full_name: 'Admin User',
      email: 'admin@safelanka.lk',
      password_hash: hashedPassword,
      role: 'ADMIN',
      approved: true,
      division: null
    },
    {
      full_name: 'John Officer',
      email: 'officer1@safelanka.lk',
      password_hash: officerPassword,
      role: 'OFFICER',
      approved: false,
      division: 'Colombo'
    },
    {
      full_name: 'Sarah Analyst',
      email: 'analyst1@safelanka.lk',
      password_hash: analystPassword,
      role: 'ANALYST',
      approved: false,
      division: 'Kandy'
    },
    {
      full_name: 'Mike Officer',
      email: 'officer2@safelanka.lk',
      password_hash: officerPassword,
      role: 'OFFICER',
      approved: true,
      division: 'Gampaha'
    }
  ]);
}