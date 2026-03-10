const bcrypt = require('bcryptjs');
const { Role, Category, Location, Level, Skill, User, Company, JobPost } = require('../src/models');

const seedData = async () => {
    try {
        console.log('Đang kiểm tra dữ liệu mặc định hệ thống...');

        // 1. Kiểm tra và tạo ROLES (3 data)
        const roleCount = await Role.count();
        if (roleCount === 0) {
            await Role.bulkCreate([
                { roleName: 'ADMIN' },
                { roleName: 'EMPLOYER' },
                { roleName: 'CANDIDATE' }
            ]);
        }

        // 2. Kiểm tra và tạo LOCATION (63 tỉnh/thành phố)
        const locationCount = await Location.count();
        if (locationCount === 0) {
            const locations = [
                'Hà Nội', 'Hà Giang', 'Cao Bằng', 'Bắc Kạn', 'Tuyên Quang', 'Lào Cai', 'Điện Biên', 'Lai Châu', 'Sơn La', 'Yên Bái',
                'Hòa Bình', 'Thái Nguyên', 'Lạng Sơn', 'Quảng Ninh', 'Bắc Giang', 'Phú Thọ', 'Vĩnh Phúc', 'Bắc Ninh', 'Hải Dương', 'Hải Phòng',
                'Hưng Yên', 'Thái Bình', 'Hà Nam', 'Nam Định', 'Ninh Bình', 'Thanh Hóa', 'Nghệ An', 'Hà Tĩnh', 'Quảng Bình', 'Quảng Trị',
                'Thừa Thiên Huế', 'Đà Nẵng', 'Quảng Nam', 'Quảng Ngãi', 'Bình Định', 'Phú Yên', 'Khánh Hòa', 'Ninh Thuận', 'Bình Thuận', 'Kon Tum',
                'Gia Lai', 'Đắk Lắk', 'Đắk Nông', 'Lâm Đồng', 'Bình Phước', 'Tây Ninh', 'Bình Dương', 'Đồng Nai', 'Bà Rịa - Vũng Tàu', 'Hồ Chí Minh',
                'Long An', 'Tiền Giang', 'Bến Tre', 'Trà Vinh', 'Vĩnh Long', 'Đồng Tháp', 'An Giang', 'Kiên Giang', 'Cần Thơ', 'Hậu Giang',
                'Sóc Trăng', 'Bạc Liêu', 'Cà Mau'
            ];
            await Location.bulkCreate(locations.map(name => ({ name })));
        }

        // 3. Kiểm tra và tạo LEVEL (6 data)
        const levelCount = await Level.count();
        if (levelCount === 0) {
            await Level.bulkCreate([
                { name: 'Intern' },
                { name: 'Fresher' },
                { name: 'Junior' },
                { name: 'Middle' },
                { name: 'Senior' },
                { name: 'Manager' }
            ]);
        }

        // 4. Kiểm tra và tạo SKILL (~100 data)
        const skillCount = await Skill.count();
        if (skillCount === 0) {
            const skills = [
                'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Go',
                'Rust', 'TypeScript', 'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes',
                'AWS', 'Azure', 'GCP', 'Linux', 'Git', 'CI/CD', 'Jenkins', 'React', 'Angular', 'Vue.js',
                'Node.js', 'Express', 'Django', 'Flask', 'Spring Boot', 'ASP.NET', 'Laravel', 'TensorFlow', 'PyTorch', 'Machine Learning',
                'Data Analysis', 'SEO', 'SEM', 'Content Writing', 'Copywriting', 'Social Media', 'Google Ads', 'Facebook Ads', 'Email Marketing', 'Figma',
                'Photoshop', 'Illustrator', 'Premiere', 'After Effects', 'UI/UX', 'AutoCAD', 'SolidWorks', 'Revit', 'Project Management', 'Agile',
                'Scrum', 'Jira', 'Trello', 'Communication', 'Teamwork', 'Problem Solving', 'Leadership', 'Time Management', 'Customer Service', 'Sales',
                'B2B', 'B2C', 'Negotiation', 'Public Speaking', 'Accounting', 'Financial Analysis', 'Excel', 'Power BI', 'Tableau', 'HR Management',
                'Recruiting', 'Payroll', 'Legal Drafting', 'Contract Negotiation', 'Real Estate', 'Logistics', 'Supply Chain', 'Quality Assurance', 'Testing', 'Selenium',
                'Cypress', 'Appium', 'Networking', 'Cybersecurity', 'Blockchain', 'Smart Contracts', 'Web3', 'Unity', 'Unreal Engine', '3D Modeling'
            ];
            await Skill.bulkCreate(skills.map(name => ({ name })));
        }

        // 5. Kiểm tra và tạo CATEGORY (200 data chi tiết)
        const categoryCount = await Category.count();
        if (categoryCount === 0) {
            const baseCategories = ['Công nghệ Thông tin', 'Marketing - Truyền thông', 'Kế toán - Tài chính', 'Hành chính - Nhân sự', 'Xây dựng - Kiến trúc', 'Kinh doanh - Bán hàng', 'Y tế - Dược phẩm', 'Du lịch - Nhà hàng', 'Giáo dục - Đào tạo', 'Cơ khí - Kỹ thuật'];
            const specializations = ['Chuyên viên', 'Quản lý', 'Trưởng phòng', 'Kỹ sư', 'Nhà phân tích', 'Thực tập sinh', 'Trợ lý', 'Cố vấn', 'Giám đốc', 'Nhân viên'];
            const levelSpecs = ['Mới tốt nghiệp', 'Có kinh nghiệm'];

            let categoriesToCreate = [];
            // Tổng hợp ra đủ khoảng 200 danh mục kết hợp
            for (let base of baseCategories) {
                for (let spec of specializations) {
                    for (let ls of levelSpecs) {
                        categoriesToCreate.push({ name: `${spec} ${base} (${ls})` });
                    }
                }
            }
            await Category.bulkCreate(categoriesToCreate);
        }

        // 6. Kiểm tra tài khoản User (Admin và Employer)
        let adminRole = await Role.findOne({ where: { roleName: 'ADMIN' } });
        let employerRole = await Role.findOne({ where: { roleName: 'EMPLOYER' } });

        const adminEmail = 'duydien3504@gmail.com';
        const employerEmail = 'themcao20@gmail.com';

        let adminUser = await User.findOne({ where: { email: adminEmail } });
        if (!adminUser && adminRole) {
            const hashedAdminPass = await bcrypt.hash('Abcd1234@@', 10);
            adminUser = await User.create({
                email: adminEmail,
                password: hashedAdminPass,
                fullName: 'Quản trị viên Hệ Thống',
                roleId: adminRole.roleId,
                status: 'Active'
            });
        }

        let employerUser = await User.findOne({ where: { email: employerEmail } });
        let company = null;
        if (!employerUser && employerRole) {
            const hashedEmpPass = await bcrypt.hash('Abcd1234@', 10);
            employerUser = await User.create({
                email: employerEmail,
                password: hashedEmpPass,
                fullName: 'Nhà tuyển dụng',
                roleId: employerRole.roleId,
                status: 'Active'
            });

            // Yêu cầu Employer phải có cty để đăng Việc Làm
            company = await Company.create({
                userId: employerUser.userId,
                name: 'Công ty Cổ phần Tuyển Dụng',
                taxCode: '0123456789',
                scale: '100-500',
                addressDetail: 'Quận 1, TP Hồ Chí Minh',
                status: 'Active'
            });
        } else if (employerUser) {
            company = await Company.findOne({ where: { userId: employerUser.userId } });
        }

        // 7. Tạo khoảng 300 data JobPost
        const jobCount = await JobPost.count();
        if (jobCount === 0 && company) {
            let limitLocations = await Location.findAll();
            let limitCategories = await Category.findAll();
            let limitLevels = await Level.findAll();

            let jobsToCreate = [];
            for (let i = 1; i <= 300; i++) {
                // Phân phối ngẫu nhiên đều
                const randLoc = limitLocations[i % limitLocations.length];
                const randCat = limitCategories[i % limitCategories.length];
                const randLvl = limitLevels[i % limitLevels.length];

                jobsToCreate.push({
                    companyId: company.companyId,
                    categoryId: randCat.categoryId,
                    locationId: randLoc.locationId,
                    levelId: randLvl.levelId,
                    title: `Tuyển gấp ${randCat.name} - ${randLvl.name} (Vị trí số ${i})`,
                    description: `Chúng tôi đang tìm kiếm ứng viên ưu tú cho vị trí ${randCat.name}. Môi trường năng động, cơ hội thăng tiến rõ rệt. Đội ngũ thân thiện.`,
                    requirements: `- Kinh nghiệm tối thiểu theo yêu cầu.\n- Tốt nghiệp Đại học/Cao đẳng.\n- Thái độ làm việc chuyên nghiệp.\n- Có khả năng xử lý vấn đề.`,
                    salaryMin: 5000000 + (i * 50000),      // Khác nhau từng tin
                    salaryMax: 15000000 + (i * 100000),
                    status: 'Active', // Auto duyệt để test
                    expiredAt: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000) // Hạn 30 ngày
                });
            }

            // Chia nhỏ mảng để Bulk create nhẹ nhàng ở Neon (PostgreSQL)
            while (jobsToCreate.length > 0) {
                const chunk = jobsToCreate.splice(0, 100);
                await JobPost.bulkCreate(chunk);
            }
        }
    } catch (error) {
        console.error('Lỗi khi seed data:', error.message);
    }
};

module.exports = seedData;
