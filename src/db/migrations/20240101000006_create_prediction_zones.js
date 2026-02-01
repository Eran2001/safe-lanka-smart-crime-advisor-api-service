export async function up(knex) {
  await knex.schema.createTable('prediction_zones', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.uuid('division_id').notNullable();
    table.json('polygon_geojson').notNullable();
    table.enum('risk', ['LOW', 'MEDIUM', 'HIGH']).notNullable();
    table.decimal('score', 4, 3).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    table.foreign('division_id').references('divisions.id');
    table.index('division_id');
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('prediction_zones');
}