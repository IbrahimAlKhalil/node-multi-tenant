module.exports = {
  async up(knex) {
    await knex('directus_permissions').insert({
      collection: 'directus_folders',
      action: 'read',
      permissions: {
        _and: [{ name: { _contains: ['Posts', 'Tutorials', 'Questions'] } }],
      },
      validation: {},
      fields: '*',
    });
  },

  async down(knex) {
    await knex.schema.dropTable('directus_permissions');
  },
};
