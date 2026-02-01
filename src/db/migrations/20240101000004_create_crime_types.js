export async function up(knex) {
  await knex.schema.createTable('crime_types', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('name', 120).notNullable().unique();
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('crime_types');
}