const { sequelize } = require('./src/config/database');
const { User, Role, Company, Conversation, Message } = require('./src/models');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

async function seedChat() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Check Roles
        const roles = await Role.findAll();
        console.log('Existing Roles:', roles.map(r => r.roleName));

        // Find or Create Role: CANDIDATE (check case-insensitive or exact match from list)
        // Assuming strict for now, but let's be flexible
        let candidateRole = roles.find(r => r.roleName.toUpperCase() === 'CANDIDATE');
        if (!candidateRole) {
            console.log('Creating Candidate Role...');
            candidateRole = await Role.create({ roleName: 'Candidate' });
        }

        let employerRole = roles.find(r => r.roleName.toUpperCase() === 'EMPLOYER' || r.roleName.toUpperCase() === 'RECRUITER');
        if (!employerRole) {
            console.log('Creating Employer Role...');
            employerRole = await Role.create({ roleName: 'Employer' });
        }

        let adminRole = roles.find(r => r.roleName.toUpperCase() === 'ADMIN');
        if (!adminRole) {
            adminRole = await Role.create({ roleName: 'Admin' });
        }

        // 1. Find or Create Candidate User
        let candidate = await User.findOne({ where: { roleId: candidateRole.roleId } });
        if (!candidate) {
            console.log('Creating a dummy Candidate user...');
            const hashedPassword = await bcrypt.hash('123456', 10);
            candidate = await User.create({
                userId: uuidv4(),
                email: 'candidate_test@gmail.com',
                password: hashedPassword,
                fullName: 'Nguyen Van Candidate',
                roleId: candidateRole.roleId,
                isActive: true,
                isVerified: true
            });
        }
        console.log(`Using Candidate: ${candidate.email}`);

        // 2. Find Employer with Company
        let employer = await User.findOne({
            where: { roleId: employerRole.roleId },
            include: [{ model: Company, as: 'company' }]
        });

        if (!employer) {
            console.log('Creating a dummy Employer user...');
            const hashedPassword = await bcrypt.hash('123456', 10);
            employer = await User.create({
                userId: uuidv4(),
                email: 'employer_test@gmail.com',
                password: hashedPassword,
                fullName: 'Tran Van Employer',
                roleId: employerRole.roleId,
                isActive: true,
                isVerified: true
            });
        }

        if (!employer.company) {
            console.log('Creating a dummy Company for Employer...');
            await Company.create({
                companyId: uuidv4(),
                userId: employer.userId,
                name: 'Test Company Co., Ltd',
                email: 'contact@testcompany.com',
                taxCode: '0101010101',
                status: 'Active'
            });
            // Reload to get association
            employer = await User.findByPk(employer.userId, { include: [{ model: Company, as: 'company' }] });
        }
        console.log(`Using Employer: ${employer.email} (Company: ${employer.company.name})`);

        // 3. Create Conversation
        console.log(`Seeding chat between ${candidate.fullName} and ${employer.company.name}...`);

        let conversation = await Conversation.findOne({
            where: {
                userId: candidate.userId,
                companyId: employer.company.companyId
            }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                userId: candidate.userId,
                companyId: employer.company.companyId,
                lastMessageAt: new Date()
            });
            console.log('Created NEW conversation.');
        } else {
            console.log('Conversation already exists.');
        }

        // 4. Create Messages
        await Message.create({
            conversationsId: conversation.conversationsId,
            senderId: candidate.userId, // Candidate sends
            content: `Chào công ty ${employer.company.name}, tôi rất quan tâm đến vị trí này!`,
            isRead: false
        });

        await Message.create({
            conversationsId: conversation.conversationsId,
            senderId: employer.userId, // Employer sends (via company)
            content: `Chào bạn ${candidate.fullName}, cảm ơn bạn. Bạn có thể gửi CV không?`,
            isRead: false
        });

        // Update last message time
        await conversation.update({ lastMessageAt: new Date() });

        console.log('✅ Successfully seeded chat conversation!');

    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        // await sequelize.close(); // Keep open if needed or close
        process.exit();
    }
}

seedChat();
