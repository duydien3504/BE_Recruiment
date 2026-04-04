'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Enable unaccent extension
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS unaccent;');

    // Create index for accent-insensitive search on job title
    // Note: unaccent(lower(title)) is useful for optimized iLike-style searches
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS job_posts_title_unaccent_idx 
      ON job_posts (unaccent(lower(title)));
    `);
    
    // Also for experience_required
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS job_posts_exp_unaccent_idx 
      ON job_posts (unaccent(lower(experience_required)));
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('DROP INDEX IF EXISTS job_posts_title_unaccent_idx;');
    await queryInterface.sequelize.query('DROP INDEX IF EXISTS job_posts_exp_unaccent_idx;');
  }
};
