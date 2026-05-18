/**
 * Danh sách các mẫu CV hoàn chỉnh kèm dữ liệu mô phỏng theo từng chuyên ngành.
 * Dùng để seed dữ liệu demo, testing hoặc preview template trên frontend.
 *
 * Cấu trúc mỗi mẫu:
 *   - templateId   : khớp với CV_TEMPLATES trong templates.js
 *   - themeConfig  : màu sắc, font, layout
 *   - columnLayout : phân bổ section vào cột trái / phải
 *   - cvData       : toàn bộ nội dung CV (personal, about, experience, education, skills, projects, contact)
 */

const SAMPLE_CV_DATA = [

    // ─────────────────────────────────────────────────────────────────────────
    // 1. PHẦN MỀM / BACKEND ENGINEER  — templateId: modern_it_01
    // ─────────────────────────────────────────────────────────────────────────
    {
        templateId: 'modern_it_01',
        themeConfig: {
            primaryColor: '#111111',
            secondaryColor: '#2d3e50',
            fontFamily: 'Inter',
            layoutMode: 'sidebar-left'
        },
        columnLayout: {
            left: ['personal', 'contact', 'skills', 'education'],
            right: ['about', 'experience', 'projects']
        },
        cvData: {
            personal: {
                fullName: 'Nguyễn Minh Tuấn',
                jobTitle: 'Senior Backend Engineer',
                email: 'minhtuan.dev@gmail.com',
                phoneNumber: '0912 345 678',
                address: 'Quận Bình Thạnh, TP. Hồ Chí Minh',
                avatarUrl: 'https://i.pravatar.cc/150?img=12',
                linkedIn: 'linkedin.com/in/minhtuan-dev',
                github: 'github.com/minhtuan-be'
            },
            about: 'Kỹ sư Backend với hơn 5 năm kinh nghiệm xây dựng hệ thống phân tán, RESTful API và microservices trên nền tảng Node.js và Java Spring Boot. Có tư duy thiết kế kiến trúc sạch (Clean Architecture), quan tâm đến hiệu năng, bảo mật và khả năng mở rộng. Đã từng chịu trách nhiệm kỹ thuật cho các hệ thống phục vụ hơn 500,000 người dùng đồng thời.',
            experience: [
                {
                    company: 'MoMo (M_Service)',
                    position: 'Senior Backend Engineer',
                    startDate: '2022-03',
                    endDate: null,
                    isCurrent: true,
                    location: 'TP. Hồ Chí Minh',
                    description: 'Thiết kế và triển khai Payment Gateway microservice xử lý trung bình 12,000 giao dịch/phút với uptime 99.98%. Tối ưu hóa các câu truy vấn PostgreSQL phức tạp, giảm response time từ 420ms xuống còn 95ms. Tích hợp hệ thống xác thực OTP đa kênh (SMS, Email, Zalo) sử dụng Redis pub/sub và BullMQ.'
                },
                {
                    company: 'Tiki Corporation',
                    position: 'Backend Engineer',
                    startDate: '2020-06',
                    endDate: '2022-02',
                    isCurrent: false,
                    location: 'TP. Hồ Chí Minh',
                    description: 'Phát triển module Inventory Management cho hệ thống e-commerce, xử lý đồng bộ tồn kho thời gian thực trên 15 kho hàng trên toàn quốc. Áp dụng event-driven architecture với Kafka, đảm bảo tính nhất quán dữ liệu khi có hơn 200 seller cập nhật cùng lúc.'
                },
                {
                    company: 'KMS Technology',
                    position: 'Junior Software Engineer',
                    startDate: '2018-08',
                    endDate: '2020-05',
                    isCurrent: false,
                    location: 'TP. Hồ Chí Minh',
                    description: 'Tham gia phát triển ứng dụng SaaS cho khách hàng Hoa Kỳ sử dụng Java Spring Boot. Viết unit test đạt coverage 85%, tích hợp CI/CD pipeline với Jenkins và Docker.'
                }
            ],
            education: [
                {
                    school: 'Đại học Bách khoa TP. Hồ Chí Minh',
                    degree: 'Kỹ sư',
                    major: 'Khoa học Máy tính',
                    startDate: '2014-09',
                    endDate: '2018-06',
                    gpa: '3.6 / 4.0'
                }
            ],
            skills: {
                displayStyle: 'progressbar',
                items: [
                    { name: 'Node.js / Express', level: 92 },
                    { name: 'Java Spring Boot', level: 80 },
                    { name: 'PostgreSQL / MySQL', level: 88 },
                    { name: 'Redis / BullMQ', level: 82 },
                    { name: 'Docker / Kubernetes', level: 75 },
                    { name: 'Kafka / RabbitMQ', level: 70 },
                    { name: 'AWS (EC2, S3, Lambda)', level: 72 },
                    { name: 'GraphQL', level: 65 }
                ]
            },
            projects: [
                {
                    name: 'Open-source: NodeJS Rate Limiter',
                    description: 'Thư viện rate limiting cho Express.js hỗ trợ cả sliding window và token bucket, đạt 1,200 GitHub stars. Được tích hợp trong hơn 40 dự án sản xuất.',
                    techStack: ['Node.js', 'Redis', 'TypeScript'],
                    url: 'github.com/minhtuan-be/node-rate-limiter'
                }
            ],
            contact: {
                email: 'minhtuan.dev@gmail.com',
                phone: '0912 345 678',
                website: 'minhtuan.dev',
                github: 'github.com/minhtuan-be'
            }
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 2. DIGITAL MARKETING MANAGER  — templateId: creative_marketing_01
    // ─────────────────────────────────────────────────────────────────────────
    {
        templateId: 'creative_marketing_01',
        themeConfig: {
            primaryColor: '#FF5722',
            secondaryColor: '#3e2723',
            fontFamily: 'Roboto',
            layoutMode: 'sidebar-left'
        },
        columnLayout: {
            left: ['personal', 'contact', 'skills', 'about'],
            right: ['experience', 'education', 'projects']
        },
        cvData: {
            personal: {
                fullName: 'Trần Thị Hương Ly',
                jobTitle: 'Digital Marketing Manager',
                email: 'huongly.marketing@gmail.com',
                phoneNumber: '0987 654 321',
                address: 'Quận Tây Hồ, Hà Nội',
                avatarUrl: 'https://i.pravatar.cc/150?img=47',
                linkedIn: 'linkedin.com/in/huongly-marketing',
                facebook: 'facebook.com/huongly.mkt'
            },
            about: 'Digital Marketing Manager với 6 năm kinh nghiệm xây dựng chiến lược thương hiệu và tăng trưởng doanh thu cho các doanh nghiệp B2C và D2C tại thị trường Việt Nam. Chuyên sâu về Performance Marketing, SEO kỹ thuật, và xây dựng Funnel tự động hóa. Từng quản lý ngân sách media hàng tháng lên đến 2 tỷ đồng với ROAS trung bình 4.8x.',
            experience: [
                {
                    company: 'The Coffee House',
                    position: 'Digital Marketing Manager',
                    startDate: '2021-04',
                    endDate: null,
                    isCurrent: true,
                    location: 'Hà Nội',
                    description: 'Xây dựng và thực thi chiến lược Digital Marketing toàn kênh (Facebook, TikTok, Google, Email) giúp tăng doanh thu online 135% trong 12 tháng. Triển khai hệ thống Marketing Automation trên HubSpot, tự động hóa 8 luồng nuôi dưỡng khách hàng (lead nurturing), giảm CAC 32%. Quản lý đội nhóm 5 người gồm Content, SEO, Paid Ads và Designer.'
                },
                {
                    company: 'Shopee Vietnam',
                    position: 'Senior Performance Marketing Specialist',
                    startDate: '2019-01',
                    endDate: '2021-03',
                    isCurrent: false,
                    location: 'Hà Nội',
                    description: 'Quản lý và tối ưu chiến dịch quảng cáo Meta Ads với ngân sách 800 triệu đồng/tháng, đạt ROAS 5.2x trong mùa Flash Sale 9.9. Phân tích dữ liệu user behavior với Google Analytics 4 và Mixpanel, đề xuất A/B test cải thiện conversion rate landing page từ 2.1% lên 4.6%.'
                },
                {
                    company: 'Agency REVU',
                    position: 'Content & SEO Specialist',
                    startDate: '2017-07',
                    endDate: '2018-12',
                    isCurrent: false,
                    location: 'Hà Nội',
                    description: 'Lên chiến lược nội dung và SEO On-page / Off-page cho 12 khách hàng đồng thời. Đưa 3 website khách hàng lên top 3 từ khoá thương mại cạnh tranh cao trong vòng 6 tháng.'
                }
            ],
            education: [
                {
                    school: 'Đại học Ngoại Thương Hà Nội',
                    degree: 'Cử nhân',
                    major: 'Kinh doanh Quốc tế',
                    startDate: '2013-09',
                    endDate: '2017-06',
                    gpa: '3.4 / 4.0'
                }
            ],
            skills: {
                displayStyle: 'tag',
                items: [
                    { name: 'Performance Marketing (Meta / Google)', level: 95 },
                    { name: 'TikTok Ads', level: 85 },
                    { name: 'SEO Kỹ thuật', level: 82 },
                    { name: 'HubSpot CRM', level: 78 },
                    { name: 'Google Analytics 4', level: 88 },
                    { name: 'Email Marketing / Automation', level: 80 },
                    { name: 'Canva / Figma (Basic Design)', level: 65 },
                    { name: 'Power BI / Looker Studio', level: 70 }
                ]
            },
            projects: [
                {
                    name: 'Chiến dịch Tết 2024 – The Coffee House',
                    description: 'Lên concept và thực thi chiến dịch đa kênh "Tết Ấm Bên Nhau", đạt 18 triệu organic reach trên Facebook và TikTok, tăng trưởng 47% đơn hàng Gift Set so với Tết 2023.',
                    techStack: ['Meta Ads', 'TikTok Ads', 'Email', 'Influencer'],
                    url: ''
                }
            ],
            contact: {
                email: 'huongly.marketing@gmail.com',
                phone: '0987 654 321',
                website: ''
            }
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 3. UX / PRODUCT DESIGNER  — templateId: premium_rose_06
    // ─────────────────────────────────────────────────────────────────────────
    {
        templateId: 'premium_rose_06',
        themeConfig: {
            primaryColor: '#fb7185',
            secondaryColor: '#4c0519',
            fontFamily: 'Lato',
            layoutMode: 'sidebar-right'
        },
        columnLayout: {
            left: ['about', 'experience', 'projects'],
            right: ['personal', 'contact', 'skills', 'education']
        },
        cvData: {
            personal: {
                fullName: 'Lê Phương Khanh',
                jobTitle: 'Senior UX / Product Designer',
                email: 'khanh.uxdesign@gmail.com',
                phoneNumber: '0901 234 567',
                address: 'Quận 3, TP. Hồ Chí Minh',
                avatarUrl: 'https://i.pravatar.cc/150?img=32',
                linkedIn: 'linkedin.com/in/khanh-ux',
                portfolio: 'behance.net/khanh-ux-design'
            },
            about: 'Senior UX Designer với 5 năm kinh nghiệm tạo ra sản phẩm số lấy người dùng làm trung tâm (User-Centered Design) trong các lĩnh vực Fintech, E-commerce và EdTech. Thành thạo toàn bộ Design Process từ User Research, Wireframing, Prototyping đến Usability Testing. Đã định hình và dẫn dắt Design System cho 3 sản phẩm cấp doanh nghiệp.',
            experience: [
                {
                    company: 'VNPay',
                    position: 'Senior UX / Product Designer',
                    startDate: '2022-01',
                    endDate: null,
                    isCurrent: true,
                    location: 'TP. Hồ Chí Minh',
                    description: 'Thiết kế lại trải nghiệm luồng thanh toán QR trên ứng dụng VNPay, giảm số bước hoàn tất giao dịch từ 7 bước xuống 3 bước, tăng tỷ lệ chuyển đổi thanh toán 28%. Xây dựng và duy trì Design System (120+ component) trên Figma, đồng bộ với đội ngũ 6 Designer và 12 Frontend Developer. Tổ chức User Testing với 40+ người dùng thực tế mỗi tháng, phân tích insight và phản hồi lại vào sprint tiếp theo.'
                },
                {
                    company: 'Base.vn',
                    position: 'UX Designer',
                    startDate: '2020-03',
                    endDate: '2021-12',
                    isCurrent: false,
                    location: 'TP. Hồ Chí Minh',
                    description: 'Thiết kế UX/UI cho 4 module chính của nền tảng quản trị doanh nghiệp (HRM, CRM, Project, Approval Flow). Thực hiện Contextual Inquiry phỏng vấn 30+ SME owners, chuyển hóa thành Job Stories và Interface Flows. Cải thiện NPS Score của sản phẩm từ 32 lên 61 sau 2 vòng thiết kế lại.'
                },
                {
                    company: 'Freelance',
                    position: 'UI Designer',
                    startDate: '2018-06',
                    endDate: '2020-02',
                    isCurrent: false,
                    location: 'Remote',
                    description: 'Thiết kế giao diện mobile app và landing page cho 15+ khách hàng trong và ngoài nước, trên các nền tảng iOS / Android. Sử dụng Figma, Adobe XD và InVision.'
                }
            ],
            education: [
                {
                    school: 'Đại học Mỹ thuật TP. Hồ Chí Minh',
                    degree: 'Cử nhân',
                    major: 'Thiết kế Đồ họa',
                    startDate: '2014-09',
                    endDate: '2018-06',
                    gpa: ''
                }
            ],
            skills: {
                displayStyle: 'progressbar',
                items: [
                    { name: 'Figma / FigJam', level: 97 },
                    { name: 'User Research & Testing', level: 90 },
                    { name: 'Design System', level: 88 },
                    { name: 'Prototyping (InVision, Principle)', level: 82 },
                    { name: 'Adobe Illustrator / Photoshop', level: 78 },
                    { name: 'Motion Design (After Effects)', level: 60 },
                    { name: 'HTML / CSS (Basic)', level: 55 }
                ]
            },
            projects: [
                {
                    name: 'VNPay QR Payment Redesign',
                    description: 'Dẫn đầu dự án thiết kế lại toàn bộ luồng QR Payment. Nghiên cứu, wireframe, prototype và test với 80 người dùng thực tế. Kết quả: giảm 57% tỷ lệ bỏ dở giữa chừng (drop-off rate).',
                    techStack: ['Figma', 'Maze', 'Hotjar'],
                    url: 'behance.net/khanh-ux-design/vnpay-qr'
                },
                {
                    name: 'EduPrime – LMS for K12',
                    description: 'Thiết kế toàn bộ sản phẩm EdTech từ zero-to-one: từ Research Report → Information Architecture → UI Kit → Handoff. Sản phẩm ra mắt với 15,000 học sinh dùng trong tháng đầu tiên.',
                    techStack: ['Figma', 'Notion', 'Loom'],
                    url: 'behance.net/khanh-ux-design/eduprime'
                }
            ],
            contact: {
                email: 'khanh.uxdesign@gmail.com',
                phone: '0901 234 567',
                website: 'behance.net/khanh-ux-design'
            }
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 4. KẾ TOÁN TRƯỞNG / FINANCE  — templateId: elegant_business_01
    // ─────────────────────────────────────────────────────────────────────────
    {
        templateId: 'elegant_business_01',
        themeConfig: {
            primaryColor: '#3F51B5',
            secondaryColor: '#1a237e',
            fontFamily: 'Merriweather',
            layoutMode: 'sidebar-left'
        },
        columnLayout: {
            left: ['personal', 'contact', 'skills', 'education'],
            right: ['about', 'experience', 'projects']
        },
        cvData: {
            personal: {
                fullName: 'Phạm Thị Bích Ngọc',
                jobTitle: 'Kế toán Trưởng (Chief Accountant)',
                email: 'bichngoc.cpa@gmail.com',
                phoneNumber: '0933 111 222',
                address: 'Quận Long Biên, Hà Nội',
                avatarUrl: 'https://i.pravatar.cc/150?img=25',
                linkedIn: 'linkedin.com/in/bichngoc-cpa'
            },
            about: 'Kế toán Trưởng với chứng chỉ CPA Việt Nam, hơn 10 năm kinh nghiệm trong lĩnh vực kế toán, kiểm soát nội bộ và quản trị tài chính tại các doanh nghiệp sản xuất và phân phối quy mô vừa và lớn. Có kinh nghiệm làm việc trực tiếp với kiểm toán độc lập (Big4 – Deloitte, EY) và đàm phán tín dụng ngân hàng.',
            experience: [
                {
                    company: 'Công ty CP Nhựa Tiền Phong',
                    position: 'Kế toán Trưởng',
                    startDate: '2018-05',
                    endDate: null,
                    isCurrent: true,
                    location: 'Hà Nội',
                    description: 'Điều hành phòng kế toán 8 nhân sự, chịu trách nhiệm toàn bộ công tác lập BCTC hàng tháng/quý/năm theo VAS và IFRS. Tái cấu trúc quy trình kế toán công nợ, giảm thời gian đối chiếu từ 5 ngày xuống 1 ngày nhờ tự động hóa trên SAP FICO. Xây dựng hệ thống Kiểm soát Nội bộ (Internal Control Framework) đạt chuẩn COSO 2013, giảm sai sót ghi nhận doanh thu xuống dưới 0.05%.'
                },
                {
                    company: 'Deloitte Vietnam',
                    position: 'Audit Senior',
                    startDate: '2014-08',
                    endDate: '2018-04',
                    isCurrent: false,
                    location: 'Hà Nội',
                    description: 'Chủ trì kiểm toán BCTC độc lập cho 12+ khách hàng lớn thuộc lĩnh vực sản xuất, ngân hàng và bất động sản. Phát hiện và báo cáo các rủi ro trọng yếu liên quan đến dự phòng giảm giá HTK và ghi nhận doanh thu kỳ sai. Đào tạo và kèm cặp 4 nhân viên cấp Audit Associate.'
                },
                {
                    company: 'Công ty TNHH TM Hoàng Long',
                    position: 'Kế toán Tổng hợp',
                    startDate: '2012-01',
                    endDate: '2014-07',
                    isCurrent: false,
                    location: 'Hà Nội',
                    description: 'Thực hiện đầy đủ các nghiệp vụ kế toán tổng hợp: hạch toán doanh thu, chi phí, công nợ, tài sản cố định và lập BCTC quý theo VAS. Quyết toán thuế TNDN, GTGT hàng năm với cơ quan thuế.'
                }
            ],
            education: [
                {
                    school: 'Học viện Tài chính',
                    degree: 'Cử nhân',
                    major: 'Kế toán – Kiểm toán',
                    startDate: '2008-09',
                    endDate: '2012-06',
                    gpa: '3.5 / 4.0'
                }
            ],
            skills: {
                displayStyle: 'tag',
                items: [
                    { name: 'Lập BCTC (VAS / IFRS)', level: 95 },
                    { name: 'SAP FICO / ERP', level: 88 },
                    { name: 'Kiểm soát nội bộ (COSO)', level: 85 },
                    { name: 'Quyết toán Thuế TNDN / GTGT', level: 90 },
                    { name: 'Excel Nâng cao / Power Query', level: 82 },
                    { name: 'Quản lý dòng tiền (Cash Flow)', level: 80 },
                    { name: 'MISA Accounting', level: 88 },
                    { name: 'Kiểm toán Nội bộ', level: 78 }
                ]
            },
            projects: [
                {
                    name: 'Dự án Chuyển đổi SAP S/4HANA',
                    description: 'Tham gia nhóm core team dự án chuyển đổi từ hệ thống kế toán cũ sang SAP S/4HANA. Đảm nhiệm mapping dữ liệu, UAT kế toán và đào tạo 15 kế toán viên sau go-live.',
                    techStack: ['SAP S/4HANA', 'SAP FICO', 'Excel'],
                    url: ''
                }
            ],
            contact: {
                email: 'bichngoc.cpa@gmail.com',
                phone: '0933 111 222',
                website: ''
            }
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 5. DATA SCIENTIST / AI  — templateId: premium_tech_04
    // ─────────────────────────────────────────────────────────────────────────
    {
        templateId: 'premium_tech_04',
        themeConfig: {
            primaryColor: '#10b981',
            secondaryColor: '#060606',
            fontFamily: 'Fira Code',
            layoutMode: 'sidebar-left'
        },
        columnLayout: {
            left: ['personal', 'contact', 'skills', 'education'],
            right: ['about', 'experience', 'projects']
        },
        cvData: {
            personal: {
                fullName: 'Vũ Hoàng Nam',
                jobTitle: 'Data Scientist / ML Engineer',
                email: 'hoangnam.ds@gmail.com',
                phoneNumber: '0978 888 999',
                address: 'Quận Cầu Giấy, Hà Nội',
                avatarUrl: 'https://i.pravatar.cc/150?img=8',
                linkedIn: 'linkedin.com/in/hoangnam-ds',
                github: 'github.com/hoangnam-ml',
                kaggle: 'kaggle.com/hoangnam'
            },
            about: 'Data Scientist với 4 năm kinh nghiệm xây dựng và triển khai các mô hình Machine Learning vào môi trường Production, tập trung vào lĩnh vực Recommender Systems, NLP và Time-Series Forecasting. Có kinh nghiệm làm việc với data pipeline quy mô lớn (>100GB/ngày), thành thạo MLOps và A/B testing. Đóng góp tích cực vào cộng đồng open-source với hơn 850 GitHub stars.',
            experience: [
                {
                    company: 'VNG Corporation – ZaloPay',
                    position: 'Data Scientist',
                    startDate: '2021-09',
                    endDate: null,
                    isCurrent: true,
                    location: 'Hà Nội',
                    description: 'Xây dựng hệ thống gợi ý ưu đãi cá nhân hóa (Personalized Offer Recommendation) sử dụng Two-Tower Neural Network, tăng CTR từ 3.2% lên 7.8% và doanh thu ưu đãi tháng tăng 22%. Triển khai mô hình phát hiện gian lận (Fraud Detection) dựa trên Gradient Boosting + Graph Feature, giảm tỷ lệ giao dịch gian lận 65% trong 6 tháng đầu. Xây dựng Feature Store nội bộ với Apache Feast và Apache Kafka, phục vụ 5 team Data Science.'
                },
                {
                    company: 'FPT Software',
                    position: 'Machine Learning Engineer',
                    startDate: '2019-07',
                    endDate: '2021-08',
                    isCurrent: false,
                    location: 'Hà Nội',
                    description: 'Phát triển mô hình OCR kết hợp Layout Analysis cho hệ thống trích xuất hóa đơn điện tử của Tổng cục Thuế, đạt độ chính xác 96.4% trên tập test. Xây dựng pipeline ETL và data warehouse trên AWS (S3, Glue, Redshift) xử lý 50 triệu bản ghi/ngày. Triển khai mô hình Sentiment Analysis cho phân tích phản hồi khách hàng.'
                },
                {
                    company: 'VINIF Research Grant',
                    position: 'Research Intern – NLP',
                    startDate: '2018-06',
                    endDate: '2019-06',
                    isCurrent: false,
                    location: 'Hà Nội',
                    description: 'Nghiên cứu mô hình Transformer cho bài toán Named Entity Recognition tiếng Việt. Đồng tác giả bài báo được chấp nhận tại PACLIC 2019. Fine-tune PhoBERT đạt F1-score 91.3% trên tập PhoNER.'
                }
            ],
            education: [
                {
                    school: 'Đại học Bách khoa Hà Nội',
                    degree: 'Kỹ sư',
                    major: 'Công nghệ Thông tin – Trí tuệ Nhân tạo',
                    startDate: '2015-09',
                    endDate: '2019-06',
                    gpa: '3.72 / 4.0'
                }
            ],
            skills: {
                displayStyle: 'progressbar',
                items: [
                    { name: 'Python (Pandas, NumPy, Scikit-learn)', level: 95 },
                    { name: 'Deep Learning (PyTorch / TensorFlow)', level: 88 },
                    { name: 'NLP / Transformers (HuggingFace)', level: 85 },
                    { name: 'SQL / Spark / Hive', level: 82 },
                    { name: 'MLOps (MLflow, Kubeflow, BentoML)', level: 78 },
                    { name: 'AWS / GCP (SageMaker, Vertex AI)', level: 75 },
                    { name: 'Apache Kafka / Airflow', level: 70 },
                    { name: 'Docker / Kubernetes', level: 68 }
                ]
            },
            projects: [
                {
                    name: 'ViSentiment – Vietnamese Sentiment Analysis',
                    description: 'Open-source thư viện phân tích cảm xúc tiếng Việt fine-tuned trên PhoBERT với 85,000 mẫu gán nhãn thủ công. Đạt 93.1% accuracy, được dùng trong 8 đề tài nghiên cứu và 3 sản phẩm thương mại.',
                    techStack: ['Python', 'PyTorch', 'HuggingFace', 'FastAPI'],
                    url: 'github.com/hoangnam-ml/visentiment'
                },
                {
                    name: 'Kaggle – Predict Student Performance',
                    description: 'Đạt hạng Top 4% (Silver Medal) trong cuộc thi Kaggle dự đoán điểm số học sinh. Áp dụng kỹ thuật Feature Engineering nâng cao và Ensemble (LightGBM + CatBoost + XGBoost) với Optuna tuning.',
                    techStack: ['Python', 'LightGBM', 'CatBoost', 'Optuna'],
                    url: 'kaggle.com/hoangnam/student-performance'
                }
            ],
            contact: {
                email: 'hoangnam.ds@gmail.com',
                phone: '0978 888 999',
                website: 'github.com/hoangnam-ml'
            }
        }
    }
];

module.exports = SAMPLE_CV_DATA;
