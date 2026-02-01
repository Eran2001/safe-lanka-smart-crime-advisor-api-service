export async function up(knex) {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('full_name', 120).notNullable();
    table.string('email', 255).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.enum('role', ['ADMIN', 'OFFICER', 'ANALYST']).defaultTo('OFFICER');
    table.string('division', 120).nullable();
    table.boolean('approved').defaultTo(false);
    table.string('avatar_url', 255).nullable();
    table.timestamps(true, true);
    
    table.index('email');
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('users');
}