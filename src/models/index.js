const { sequelize } = require('../config/database');

// Import all models
const Role = require('./Role');
const User = require('./User');
const Otp = require('./Otp');
const Company = require('./Company');
const Category = require('./Category');
const Location = require('./Location');
const Skill = require('./Skill');
const JobPost = require('./JobPost');
const Level = require('./Level');
const JobSkill = require('./JobSkill');
const Resume = require('./Resume');
const UserSkill = require('./UserSkill');
const Application = require('./Application');
const Interview = require('./Interview');
const SavedJob = require('./SavedJob');
const Follow = require('./Follow');
const Notification = require('./Notification');
const Conversation = require('./Conversation');
const Message = require('./Message');
const Transaction = require('./Transaction');
const InterviewQuestion = require('./InterviewQuestion');
const CvBuilder = require('./CvBuilder');

// Define Associations

// User - Role (Many-to-One)
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });

// User - Company (One-to-One)
User.hasOne(Company, { foreignKey: 'userId', as: 'company' });
Company.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User - Otp (One-to-Many)
User.hasMany(Otp, { foreignKey: 'userId', as: 'otps' });
Otp.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Company - JobPost (One-to-Many)
Company.hasMany(JobPost, { foreignKey: 'companyId', as: 'jobPosts' });
JobPost.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

// JobPost - Category (Many-to-One)
JobPost.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(JobPost, { foreignKey: 'categoryId', as: 'jobPosts' });

// JobPost - Location (Many-to-One)
JobPost.belongsTo(Location, { foreignKey: 'locationId', as: 'location' });
Location.hasMany(JobPost, { foreignKey: 'locationId', as: 'jobPosts' });

// JobPost - Level (Many-to-One)
JobPost.belongsTo(Level, { foreignKey: 'levelId', as: 'level' });
Level.hasMany(JobPost, { foreignKey: 'levelId', as: 'jobPosts' });

// JobPost - Skill (Many-to-Many through JobSkill)
JobPost.belongsToMany(Skill, { through: JobSkill, foreignKey: 'jobPostId', otherKey: 'skillId', as: 'skills' });
Skill.belongsToMany(JobPost, { through: JobSkill, foreignKey: 'skillId', otherKey: 'jobPostId', as: 'jobPosts' });

// User - Skill (Many-to-Many through UserSkill)
User.belongsToMany(Skill, { through: UserSkill, foreignKey: 'userId', otherKey: 'skillId', as: 'skills' });
Skill.belongsToMany(User, { through: UserSkill, foreignKey: 'skillId', otherKey: 'userId', as: 'users' });

// User - Resume (One-to-Many)
User.hasMany(Resume, { foreignKey: 'userId', as: 'resumes' });
Resume.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User - CvBuilder (One-to-One)
User.hasOne(CvBuilder, { foreignKey: 'userId', as: 'cvBuilder' });
CvBuilder.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Application - JobPost (Many-to-One)
Application.belongsTo(JobPost, { foreignKey: 'jobPostId', as: 'jobPost' });
JobPost.hasMany(Application, { foreignKey: 'jobPostId', as: 'applications' });

// Application - User (Many-to-One)
Application.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Application, { foreignKey: 'userId', as: 'applications' });

// Application - Resume (Many-to-One)
Application.belongsTo(Resume, { foreignKey: 'resumesId', as: 'resume' });
Resume.hasMany(Application, { foreignKey: 'resumesId', as: 'applications' });

// Application - Interview (One-to-One)
Application.hasOne(Interview, { foreignKey: 'applicationId', as: 'interview' });
Interview.belongsTo(Application, { foreignKey: 'applicationId', as: 'application' });

// Application - InterviewQuestion (One-to-Many)
Application.hasMany(InterviewQuestion, { foreignKey: 'applicationId', as: 'interviewQuestions' });
InterviewQuestion.belongsTo(Application, { foreignKey: 'applicationId', as: 'application' });

// User - SavedJob - JobPost (Many-to-Many)
User.belongsToMany(JobPost, { through: SavedJob, foreignKey: 'userId', otherKey: 'jobPostId', as: 'savedJobs' });
JobPost.belongsToMany(User, { through: SavedJob, foreignKey: 'jobPostId', otherKey: 'userId', as: 'savedByUsers' });

// SavedJob Associations (Direct access)
SavedJob.belongsTo(JobPost, { foreignKey: 'jobPostId', as: 'jobPost' });
SavedJob.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User - Follow - Company (Many-to-Many)
User.belongsToMany(Company, { through: Follow, foreignKey: 'userId', otherKey: 'companyId', as: 'followedCompanies' });
Company.belongsToMany(User, { through: Follow, foreignKey: 'companyId', otherKey: 'userId', as: 'followers' });

// Follow Associations (Direct access)
Follow.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
Follow.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User - Notification (One-to-Many)
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Conversation - User (Many-to-One)
Conversation.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Conversation, { foreignKey: 'userId', as: 'conversations' });

// Conversation - Company (Many-to-One)
Conversation.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
Company.hasMany(Conversation, { foreignKey: 'companyId', as: 'conversations' });

// Conversation - Message (One-to-Many)
Conversation.hasMany(Message, { foreignKey: 'conversationsId', as: 'messages' });
Message.belongsTo(Conversation, { foreignKey: 'conversationsId', as: 'conversation' });

// Message - User (sender) (Many-to-One)
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });

// Transaction - Company (Many-to-One)
Transaction.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
Company.hasMany(Transaction, { foreignKey: 'companyId', as: 'transactions' });

// Transaction - JobPost (Many-to-One)
Transaction.belongsTo(JobPost, { foreignKey: 'jobPostId', as: 'jobPost' });
JobPost.hasMany(Transaction, { foreignKey: 'jobPostId', as: 'transactions' });

// Export all models and sequelize instance
module.exports = {
    sequelize,
    Role,
    User,
    Otp,
    Company,
    Category,
    Location,
    Level,
    Skill,
    JobPost,
    JobSkill,
    Resume,
    UserSkill,
    Application,
    Interview,
    SavedJob,
    Follow,
    Notification,
    Conversation,
    Message,
    Transaction,
    InterviewQuestion,
    CvBuilder
};
