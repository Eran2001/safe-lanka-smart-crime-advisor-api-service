export async function up(knex) {
  await knex.schema.createTable('notifications', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('message', 255).notNullable();
    table.enum('level', ['info', 'warning', 'critical']).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.index('created_at');
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('notifications');
}