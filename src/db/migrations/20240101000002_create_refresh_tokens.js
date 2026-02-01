export async function up(knex) {
  await knex.schema.createTable('refresh_tokens', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.uuid('user_id').notNullable();
    table.string('token', 512).notNullable().unique();
    table.datetime('expires_at').notNullable();
    table.boolean('revoked').defaultTo(false);
    table.datetime('created_at').defaultTo(knex.fn.now());
    
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.index('user_id');
    table.index('token');
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('refresh_tokens');
}