export async function up(knex) {
  await knex.schema.createTable('blog_posts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('slug', 160).notNullable().unique();
    table.string('title', 160).notNullable();
    table.string('excerpt', 280).nullable();
    table.text('content_md', 'longtext').nullable();
    table.string('author', 120).nullable();
    table.datetime('published_at').nullable();
    table.enum('status', ['draft', 'published']).defaultTo('draft');
    
    table.index('slug');
    table.index('status');
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('blog_posts');
}