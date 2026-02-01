export async function up(knex) {
  await knex.schema.createTable('trend_points', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.date('date').notNullable();
    table.integer('total').notNullable();
    table.uuid('division_id').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.foreign('division_id').references('divisions.id');
    table.index(['date', 'division_id']);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('trend_points');
}