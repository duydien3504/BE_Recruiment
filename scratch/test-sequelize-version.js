const { sequelize } = require('../src/config/database');
const { CvBuilder, User, Role } = require('../src/models');

async function test() {
    await sequelize.authenticate();
    
    // Create a dummy user first
    let role = await Role.findOne();
    if (!role) role = await Role.create({ roleName: 'TEST' });
    let user = await User.create({ email: 'test@version.com', password: '123', fullName: 'Test', roleId: role.roleId, status: 'Active' });

    // Create a CV
    let cv = await CvBuilder.create({ userId: user.userId, cvData: { hello: "world" } });
    console.log("Initial version:", cv.version);
    
    // Update it
    await cv.update({ cvData: { hello: "world", edited: true } });
    console.log("Updated version:", cv.version);
    
    // Update via Repository style
    const record = await CvBuilder.findByPk(cv.id);
    await record.update({ cvData: { hello: "world", edited: true, third: true } });
    console.log("Third version:", record.version);

    await cv.destroy();
    await user.destroy();
    process.exit(0);
}

test().catch(console.error);
