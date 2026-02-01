export async function up(knex) {
  await knex.schema.createTable('feedback', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.uuid('user_id').notNullable();
    table.integer('rating').notNullable();
    table.enum('category', ['usability', 'accuracy', 'features', 'other']).notNullable();
    table.text('comment').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.index('user_id');
    
    table.check('rating >= 1 AND rating <= 5');
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('feedback');
}