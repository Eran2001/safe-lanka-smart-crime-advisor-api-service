export async function up(knex) {
  await knex.schema.createTable('divisions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('name', 120).notNullable().unique();
    table.string('code', 20).notNullable().unique();
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('divisions');
}