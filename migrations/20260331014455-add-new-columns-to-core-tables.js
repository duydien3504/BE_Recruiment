'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Bảng users
    await queryInterface.addColumn('users', 'date_of_birth', { type: Sequelize.DATE, allowNull: true });
    await queryInterface.addColumn('users', 'gender', { type: Sequelize.ENUM('male', 'female', 'other'), allowNull: true });
    await queryInterface.addColumn('users', 'last_login', { type: Sequelize.DATE, allowNull: true });

    // Bảng job_posts
    await queryInterface.addColumn('job_posts', 'job_type', { type: Sequelize.ENUM('fulltime', 'parttime', 'remote'), allowNull: true, defaultValue: 'fulltime' });
    await queryInterface.addColumn('job_posts', 'experience_required', { type: Sequelize.STRING(100), allowNull: true });
    await queryInterface.addColumn('job_posts', 'quantity', { type: Sequelize.INTEGER, allowNull: true, defaultValue: 1 });

    // Bảng applications
    await queryInterface.addColumn('applications', 'applied_at', { type: Sequelize.DATE, allowNull: true });

    // Bảng companies
    await queryInterface.addColumn('companies', 'verified', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false });
  },

  async down(queryInterface, Sequelize) {
    // Kịch bản undo
    await queryInterface.removeColumn('users', 'date_of_birth');
    await queryInterface.removeColumn('users', 'gender');
    await queryInterface.removeColumn('users', 'last_login');
    await queryInterface.removeColumn('job_posts', 'job_type');
    await queryInterface.removeColumn('job_posts', 'experience_required');
    await queryInterface.removeColumn('job_posts', 'quantity');
    await queryInterface.removeColumn('applications', 'applied_at');
    await queryInterface.removeColumn('companies', 'verified');
  }
};
