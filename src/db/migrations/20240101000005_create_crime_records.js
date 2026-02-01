export async function up(knex) {
  await knex.schema.createTable('crime_records', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.date('date').notNullable();
    table.time('time').notNullable();
    table.uuid('division_id').notNullable();
    table.uuid('crime_type_id').notNullable();
    table.decimal('location_lat', 10, 7).nullable();
    table.decimal('location_lng', 10, 7).nullable();
    table.string('address', 255).nullable();
    table.integer('count').defaultTo(1);
    table.text('notes').nullable();
    table.uuid('created_by').notNullable();
    table.timestamps(true, true);
    
    table.foreign('division_id').references('divisions.id');
    table.foreign('crime_type_id').references('crime_types.id');
    table.foreign('created_by').references('users.id');
    
    table.index('date');
    table.index(['division_id', 'crime_type_id']);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('crime_records');
}