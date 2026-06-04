/**
 * 40 mẫu CV hoàn chỉnh – đa ngành nghề.
 * Quy tắc màu:
 *   sidebar tối (secondaryColor tối) → textColor SÁNG
 *   sidebar sáng / minimal-1-col    → textColor TỐI
 *   avatarUrl: ui-avatars.com theo primaryColor
 */
const SAMPLE_CV_DATA = [

    // ── 1. FRONTEND DEVELOPER ─────────────────────────────────────────────────
    {
        templateId: 'minimal_it_02',
        themeConfig: {
            primaryColor: '#1e40af',
            secondaryColor: '#1e3a8a',
            fontFamily: 'Inter',
            layoutMode: 'sidebar-left',
            textColor: '#e0e7ff',
            bodyTextColor: '#1e293b'
        },
        columnLayout: {
            left: ['personal', 'contact', 'skills', 'education'],
            right: ['about', 'experience', 'projects']
        },
        cvData: {
            personal: {
                fullName: 'Trần Quốc Bảo',
                jobTitle: 'Senior Frontend Developer',
                email: 'quocbao.fe@gmail.com',
                phoneNumber: '0901 112 233',
                address: 'Quận Gò Vấp, TP. Hồ Chí Minh',
                avatarUrl: 'https://ui-avatars.com/api/?name=Tran+Quoc+Bao&background=1e40af&color=ffffff&size=150&bold=true',
                linkedIn: 'linkedin.com/in/quocbao-fe',
                github: 'github.com/quocbao-frontend'
            },
            about: 'Senior Frontend Developer với 5 năm kinh nghiệm xây dựng ứng dụng web hiệu năng cao sử dụng React và TypeScript. Thành thạo tối ưu hóa Core Web Vitals, thiết kế Design System chuẩn WCAG 2.1 và tích hợp CI/CD. Đã dẫn dắt team 4 FE engineer cho nền tảng SaaS phục vụ 200,000+ người dùng.',
            experience: [
                {
                    company: 'Momo (M_Service)',
                    position: 'Senior Frontend Developer',
                    startDate: '2022-04',
                    endDate: null,
                    isCurrent: true,
                    location: 'TP. Hồ Chí Minh',
                    description: 'Xây dựng Super App MoMo bằng React Native + React Web với micro-frontend architecture. Tối ưu Lighthouse score từ 52 lên 94, giảm bundle size 38%. Thiết lập Design System 150+ component dùng chung cho cả 3 platform.'
                },
                {
                    company: 'Shopback Vietnam',
                    position: 'Frontend Developer',
                    startDate: '2020-01',
                    endDate: '2022-03',
                    isCurrent: false,
                    location: 'TP. Hồ Chí Minh',
                    description: 'Phát triển trang landing page và cashback dashboard sử dụng Next.js và TailwindCSS. Triển khai SSR/SSG, cải thiện TTI từ 4.2s xuống 1.1s. Tích hợp A/B testing với Optimizely tăng conversion rate 18%.'
                },
                {
                    company: 'Sendo.vn',
                    position: 'Junior Frontend Developer',
                    startDate: '2018-07',
                    endDate: '2019-12',
                    isCurrent: false,
                    location: 'TP. Hồ Chí Minh',
                    description: 'Phát triển trang sản phẩm và giỏ hàng cho sàn TMĐT Sendo. Tích hợp payment widget và xây dựng responsive layout chuẩn mobile-first.'
                }
            ],
            education: [
                {
                    school: 'Đại học Khoa học Tự nhiên TP. HCM',
                    degree: 'Cử nhân',
                    major: 'Công nghệ Thông tin',
                    startDate: '2014-09',
                    endDate: '2018-06',
                    gpa: '3.5 / 4.0'
                }
            ],
            skills: {
                displayStyle: 'progressbar',
                items: [
                    { name: 'React / Next.js', level: 95 },
                    { name: 'TypeScript', level: 90 },
                    { name: 'Vue 3 / Nuxt', level: 75 },
                    { name: 'TailwindCSS / SCSS', level: 92 },
                    { name: 'GraphQL / REST API', level: 82 },
                    { name: 'Jest / Vitest / Cypress', level: 78 },
                    { name: 'Webpack / Vite', level: 80 },
                    { name: 'Docker / CI-CD', level: 65 }
                ]
            },
            projects: [
                {
                    name: 'MoMo Design System',
                    description: 'Xây dựng thư viện component React với Storybook, hỗ trợ dark mode, a11y chuẩn WCAG 2.1. Được dùng bởi 12 team product với 150+ component.',
                    techStack: ['React', 'TypeScript', 'Storybook', 'TailwindCSS'],
                    url: 'github.com/quocbao-frontend/momo-ds'
                }
            ],
            contact: {
                email: 'quocbao.fe@gmail.com',
                phone: '0901 112 233',
                github: 'github.com/quocbao-frontend',
                linkedIn: 'linkedin.com/in/quocbao-fe'
            }
        }
    },

    // ── 2. MOBILE DEVELOPER ───────────────────────────────────────────────────
    {
        templateId: 'modern_it_01',
        themeConfig: {
            primaryColor: '#0f172a',
            secondaryColor: '#1e293b',
            fontFamily: 'Be Vietnam Pro',
            layoutMode: 'sidebar-left',
            textColor: '#f1f5f9',
            bodyTextColor: '#1e293b'
        },
        columnLayout: {
            left: ['personal', 'contact', 'skills', 'education'],
            right: ['about', 'experience', 'projects']
        },
        cvData: {
            personal: {
                fullName: 'Ngô Thành Long',
                jobTitle: 'Senior Mobile Developer',
                email: 'thanhlong.mobile@gmail.com',
                phoneNumber: '0933 445 566',
                address: 'Quận Tân Bình, TP. Hồ Chí Minh',
                avatarUrl: 'https://ui-avatars.com/api/?name=Ngo+Thanh+Long&background=0f172a&color=ffffff&size=150&bold=true',
                linkedIn: 'linkedin.com/in/thanhlong-mobile',
                github: 'github.com/thanhlong-dev'
            },
            about: 'Senior Mobile Developer 6 năm kinh nghiệm xây dựng ứng dụng iOS/Android sử dụng Flutter và React Native. Chuyên sâu về hiệu năng ứng dụng, animation 60fps và tích hợp native module. Từng publish 8 ứng dụng lên App Store và Google Play với tổng 500,000+ lượt tải.',
            experience: [
                {
                    company: 'VinID (Vingroup)',
                    position: 'Senior Mobile Developer',
                    startDate: '2021-06',
                    endDate: null,
                    isCurrent: true,
                    location: 'Hà Nội',
                    description: 'Lead phát triển ứng dụng VinID trên Flutter (iOS + Android) với 4 triệu người dùng. Tối ưu cold start time từ 3.8s xuống 1.2s. Thiết kế kiến trúc BLoC + Clean Architecture cho 6 feature module độc lập.'
                },
                {
                    company: 'Grab Vietnam',
                    position: 'Mobile Developer',
                    startDate: '2019-03',
                    endDate: '2021-05',
                    isCurrent: false,
                    location: 'TP. Hồ Chí Minh',
                    description: 'Phát triển Grab Driver App bằng React Native. Triển khai offline-first architecture với SQLite, đảm bảo hoạt động ổn định khi mất mạng. Viết native module Objective-C/Kotlin cho map và push notification.'
                },
                {
                    company: 'KiotViet',
                    position: 'Junior Mobile Developer',
                    startDate: '2017-08',
                    endDate: '2019-02',
                    isCurrent: false,
                    location: 'TP. Hồ Chí Minh',
                    description: 'Phát triển ứng dụng POS mobile cho tiểu thương. Tích hợp Bluetooth printer, barcode scanner và thanh toán QR.'
                }
            ],
            education: [
                {
                    school: 'Đại học Bách khoa TP. Hồ Chí Minh',
                    degree: 'Kỹ sư',
                    major: 'Kỹ thuật Máy tính',
                    startDate: '2013-09',
                    endDate: '2017-06',
                    gpa: '3.4 / 4.0'
                }
            ],
            skills: {
                displayStyle: 'progressbar',
                items: [
                    { name: 'Flutter / Dart', level: 95 },
                    { name: 'React Native', level: 88 },
                    { name: 'iOS (Swift / Objective-C)', level: 72 },
                    { name: 'Android (Kotlin / Java)', level: 75 },
                    { name: 'Firebase / FCM', level: 85 },
                    { name: 'BLoC / Redux', level: 88 },
                    { name: 'REST API / GraphQL', level: 80 },
                    { name: 'CI/CD (Fastlane / Bitrise)', level: 70 }
                ]
            },
            projects: [
                {
                    name: 'VinID Super App',
                    description: 'Phát triển toàn bộ core app Flutter cho VinID: thanh toán, tích điểm, loyalty, dịch vụ Vingroup. Đạt rating 4.7/5 trên App Store với 4M+ downloads.',
                    techStack: ['Flutter', 'BLoC', 'Hive', 'Firebase'],
                    url: ''
                }
            ],
            contact: {
                email: 'thanhlong.mobile@gmail.com',
                phone: '0933 445 566',
                github: 'github.com/thanhlong-dev',
                linkedIn: 'linkedin.com/in/thanhlong-mobile'
            }
        }
    },

    // ── 3. DEVOPS / CLOUD ENGINEER ────────────────────────────────────────────
    {
        templateId: 'premium_tech_04',
        themeConfig: {
            primaryColor: '#059669',
            secondaryColor: '#0a0a0a',
            fontFamily: 'Fira Code',
            layoutMode: 'sidebar-left',
            textColor: '#d1fae5',
            bodyTextColor: '#064e3b'
        },
        columnLayout: {
            left: ['personal', 'contact', 'skills', 'education'],
            right: ['about', 'experience', 'projects']
        },
        cvData: {
            personal: {
                fullName: 'Đinh Văn Khải',
                jobTitle: 'Senior DevOps / Cloud Engineer',
                email: 'vanKhai.devops@gmail.com',
                phoneNumber: '0977 321 654',
                address: 'Quận Hai Bà Trưng, Hà Nội',
                avatarUrl: 'https://ui-avatars.com/api/?name=Dinh+Van+Khai&background=059669&color=ffffff&size=150&bold=true',
                linkedIn: 'linkedin.com/in/vankhai-devops',
                github: 'github.com/vankhai-infra'
            },
            about: 'DevOps / Cloud Engineer 5 năm kinh nghiệm thiết kế và vận hành hạ tầng cloud quy mô lớn trên AWS và GCP. Chuyên sâu về Kubernetes, Terraform, CI/CD pipeline và Site Reliability Engineering. Đã giảm downtime 99.2% và tiết kiệm 35% chi phí cloud cho hệ thống phục vụ 1 triệu người dùng.',
            experience: [
                {
                    company: 'Techcombank',
                    position: 'Senior DevOps Engineer',
                    startDate: '2022-01',
                    endDate: null,
                    isCurrent: true,
                    location: 'Hà Nội',
                    description: 'Thiết kế và triển khai Kubernetes cluster on-premise (200+ node) phục vụ core banking. Xây dựng GitOps pipeline với ArgoCD và Helm, giảm thời gian deploy từ 2 giờ xuống 8 phút. Triển khai observability stack (Prometheus + Grafana + Loki) với 500+ alert rule.'
                },
                {
                    company: 'VNG Cloud',
                    position: 'Cloud Infrastructure Engineer',
                    startDate: '2019-07',
                    endDate: '2021-12',
                    isCurrent: false,
                    location: 'TP. Hồ Chí Minh',
                    description: 'Xây dựng hạ tầng multi-cloud (AWS + GCP) cho 50+ khách hàng doanh nghiệp với Terraform IaC. Tự động hóa provisioning giảm thời gian setup từ 3 ngày xuống 2 giờ. Thiết kế DR strategy đạt RTO < 15 phút, RPO < 5 phút.'
                },
                {
                    company: 'FPT Telecom',
                    position: 'System Administrator',
                    startDate: '2017-09',
                    endDate: '2019-06',
                    isCurrent: false,
                    location: 'Hà Nội',
                    description: 'Quản lý 300+ server Linux, triển khai monitoring với Zabbix. Tự động hóa task vận hành bằng Ansible Playbook, tiết kiệm 20 giờ/tuần công việc thủ công.'
                }
            ],
            education: [
                {
                    school: 'Học viện Công nghệ Bưu chính Viễn thông',
                    degree: 'Kỹ sư',
                    major: 'Hệ thống Thông tin',
                    startDate: '2013-09',
                    endDate: '2017-06',
                    gpa: '3.3 / 4.0'
                }
            ],
            skills: {
                displayStyle: 'progressbar',
                items: [
                    { name: 'Kubernetes / Helm / ArgoCD', level: 93 },
                    { name: 'Terraform / Ansible', level: 90 },
                    { name: 'AWS (EKS, RDS, Lambda, S3)', level: 88 },
                    { name: 'Docker / Podman', level: 95 },
                    { name: 'CI/CD (GitLab CI, Jenkins)', level: 87 },
                    { name: 'Prometheus / Grafana / Loki', level: 85 },
                    { name: 'Linux / Bash Scripting', level: 92 },
                    { name: 'Python / Go (scripting)', level: 70 }
                ]
            },
            projects: [
                {
                    name: 'Techcombank Private Cloud Platform',
                    description: 'Thiết kế Private Cloud Platform trên K8s với multi-tenancy, RBAC, network policy. Phục vụ 80+ team dev với 500+ microservice, uptime 99.98%.',
                    techStack: ['Kubernetes', 'ArgoCD', 'Terraform', 'Prometheus'],
                    url: ''
                }
            ],
            contact: {
                email: 'vanKhai.devops@gmail.com',
                phone: '0977 321 654',
                github: 'github.com/vankhai-infra',
                linkedIn: 'linkedin.com/in/vankhai-devops'
            }
        }
    },

    // ── 4. PRODUCT MANAGER ────────────────────────────────────────────────────
    {
        templateId: 'premium_sky_01',
        themeConfig: {
            primaryColor: '#0369a1',
            secondaryColor: '#e0f2fe',
            fontFamily: 'Inter',
            layoutMode: 'top-header',
            textColor: '#0c4a6e',
            bodyTextColor: '#0c4a6e'
        },
        columnLayout: {
            left: ['skills', 'education'],
            right: ['about', 'experience', 'projects']
        },
        cvData: {
            personal: {
                fullName: 'Nguyễn Thị Phương Anh',
                jobTitle: 'Senior Product Manager',
                email: 'phuonganh.pm@gmail.com',
                phoneNumber: '0908 765 432',
                address: 'Quận Đống Đa, Hà Nội',
                avatarUrl: 'https://ui-avatars.com/api/?name=Nguyen+Phuong+Anh&background=0369a1&color=ffffff&size=150&bold=true',
                linkedIn: 'linkedin.com/in/phuonganh-pm',
                website: 'phuonganh.notion.site'
            },
            about: 'Senior Product Manager 7 năm kinh nghiệm xây dựng và phát triển sản phẩm kỹ thuật số tại các công ty Fintech và EdTech hàng đầu Việt Nam. Thành thạo phương pháp Product Discovery, OKR Framework và Data-Driven Decision Making. Đã launch 4 sản phẩm từ 0 lên 1 triệu người dùng trong 18 tháng.',
            experience: [
                {
                    company: 'VNPay',
                    position: 'Senior Product Manager – Payments',
                    startDate: '2021-03',
                    endDate: null,
                    isCurrent: true,
                    location: 'Hà Nội',
                    description: 'Định nghĩa và thực thi product roadmap cho VNPay QR, tăng trưởng GMV từ 2,500 tỷ lên 7,200 tỷ đồng/tháng trong 18 tháng. Dẫn dắt squad 12 người (eng, design, data), chạy 3 sprint đồng thời với OKR hàng quý. Phân tích funnel conversion, thiết kế 22 A/B test, cải thiện activation rate 41%.'
                },
                {
                    company: 'Topica Edtech',
                    position: 'Product Manager',
                    startDate: '2018-05',
                    endDate: '2021-02',
                    isCurrent: false,
                    location: 'Hà Nội',
                    description: 'Quản lý sản phẩm LMS Topica Native với 120,000 học viên. Redesign onboarding flow, tăng Day-7 retention từ 22% lên 48%. Tích hợp AI speech recognition cho bài tập phát âm tiếng Anh.'
                },
                {
                    company: 'GHN (Giao Hàng Nhanh)',
                    position: 'Associate Product Manager',
                    startDate: '2016-08',
                    endDate: '2018-04',
                    isCurrent: false,
                    location: 'Hà Nội',
                    description: 'Phát triển portal GHN dành cho merchant. Tối ưu luồng tạo đơn, giảm thời gian trung bình từ 4 phút xuống 45 giây. Phối hợp với UX research team phỏng vấn 80+ merchant.'
                }
            ],
            education: [
                {
                    school: 'Đại học Ngoại Thương Hà Nội',
                    degree: 'Cử nhân',
                    major: 'Kinh tế Đối ngoại',
                    startDate: '2012-09',
                    endDate: '2016-06',
                    gpa: '3.6 / 4.0'
                }
            ],
            skills: {
                displayStyle: 'tag',
                items: [
                    { name: 'Product Discovery / Roadmap', level: 95 },
                    { name: 'OKR / KPI Framework', level: 90 },
                    { name: 'User Research & Interview', level: 88 },
                    { name: 'A/B Testing / Analytics', level: 87 },
                    { name: 'Figma (Wireframe)', level: 75 },
                    { name: 'SQL / Amplitude / Mixpanel', level: 80 },
                    { name: 'Jira / Linear / Notion', level: 92 },
                    { name: 'Stakeholder Management', level: 88 }
                ]
            },
            projects: [
                {
                    name: 'VNPay QR – Growth từ 0 lên 500K merchant',
                    description: 'Định nghĩa MVP, tự đi khảo sát 200 tiểu thương, thiết kế onboarding self-service. Kết quả: 500,000 merchant active sau 12 tháng, NPS 61.',
                    techStack: ['Figma', 'Amplitude', 'SQL', 'Jira'],
                    url: ''
                }
            ],
            contact: {
                email: 'phuonganh.pm@gmail.com',
                phone: '0908 765 432',
                website: 'phuonganh.notion.site',
                linkedIn: 'linkedin.com/in/phuonganh-pm'
            }
        }
    },

    // ── 5. BUSINESS ANALYST ───────────────────────────────────────────────────
    {
        templateId: 'elegant_business_01',
        themeConfig: {
            primaryColor: '#1d4ed8',
            secondaryColor: '#1e3a8a',
            fontFamily: 'Merriweather',
            layoutMode: 'sidebar-left',
            textColor: '#e0e7ff',
            bodyTextColor: '#1e3a8a'
        },
        columnLayout: {
            left: ['personal', 'contact', 'skills', 'education'],
            right: ['about', 'experience', 'projects']
        },
        cvData: {
            personal: {
                fullName: 'Lê Thị Thu Hằng',
                jobTitle: 'Senior Business Analyst',
                email: 'thuhang.ba@gmail.com',
                phoneNumber: '0944 556 677',
                address: 'Quận Cầu Giấy, Hà Nội',
                avatarUrl: 'https://ui-avatars.com/api/?name=Le+Thu+Hang&background=1d4ed8&color=ffffff&size=150&bold=true',
                linkedIn: 'linkedin.com/in/thuhang-ba'
            },
            about: 'Senior Business Analyst 6 năm kinh nghiệm phân tích nghiệp vụ và chuyển đổi số cho các tổ chức tài chính, bảo hiểm và bán lẻ. Thành thạo Business Process Modeling (BPMN 2.0), phân tích yêu cầu Agile/Scrum và lập tài liệu kỹ thuật. Có khả năng dẫn dắt workshop với stakeholders C-level.',
            experience: [
                {
                    company: 'Bảo Việt Insurance',
                    position: 'Senior Business Analyst',
                    startDate: '2021-02',
                    endDate: null,
                    isCurrent: true,
                    location: 'Hà Nội',
                    description: 'Phân tích và thiết kế hệ thống Core Insurance mới thay thế legacy system 20 năm. Thu thập yêu cầu từ 15 phòng ban, viết 200+ User Story với Acceptance Criteria chuẩn BDD. Dẫn dắt GAP analysis, phát hiện 47 điểm cần tùy chỉnh so với off-the-shelf solution.'
                },
                {
                    company: 'Techcombank',
                    position: 'Business Analyst',
                    startDate: '2018-09',
                    endDate: '2021-01',
                    isCurrent: false,
                    location: 'Hà Nội',
                    description: 'Phân tích nghiệp vụ dự án triển khai Open Banking API theo tiêu chuẩn PSD2. Vẽ sơ đồ luồng nghiệp vụ BPMN, phối hợp với team Java backend viết API spec OpenAPI 3.0. Hỗ trợ UAT cho 12 đối tác FinTech.'
                },
                {
                    company: 'FPT Software',
                    position: 'Junior Business Analyst',
                    startDate: '2016-07',
                    endDate: '2018-08',
                    isCurrent: false,
                    location: 'Hà Nội',
                    description: 'Phân tích yêu cầu và viết tài liệu SRS cho dự án ERP bán lẻ của khách hàng Nhật Bản. Làm bridge để truyền đạt yêu cầu nghiệp vụ sang tiếng Anh và tiếng Nhật.'
                }
            ],
            education: [
                {
                    school: 'Đại học Kinh tế Quốc dân',
                    degree: 'Cử nhân',
                    major: 'Hệ thống Thông tin Quản lý',
                    startDate: '2012-09',
                    endDate: '2016-06',
                    gpa: '3.55 / 4.0'
                }
            ],
            skills: {
                displayStyle: 'tag',
                items: [
                    { name: 'Business Process Modeling (BPMN)', level: 95 },
                    { name: 'User Story / Use Case', level: 92 },
                    { name: 'SQL / Power BI', level: 82 },
                    { name: 'Agile / Scrum', level: 88 },
                    { name: 'Figma (Prototype)', level: 70 },
                    { name: 'Jira / Confluence', level: 90 },
                    { name: 'Tiếng Anh (IELTS 7.0)', level: 85 },
                    { name: 'Tiếng Nhật (N3)', level: 60 }
                ]
            },
            projects: [
                {
                    name: 'Bảo Việt Core Insurance Replacement',
                    description: 'BA lead cho dự án 18 tháng, ngân sách 15 triệu USD. Phối hợp vendor Oracle + 15 phòng ban nội bộ. Go-live thành công đúng tiến độ với 0 critical defect sau 3 tháng production.',
                    techStack: ['BPMN', 'Jira', 'Confluence', 'Oracle Insurance'],
                    url: ''
                }
            ],
            contact: {
                email: 'thuhang.ba@gmail.com',
                phone: '0944 556 677',
                linkedIn: 'linkedin.com/in/thuhang-ba'
            }
        }
    },

    // ── 6. UI/UX DESIGNER ────────────────────────────────────────────────────
    {
        templateId: 'premium_rose_06',
        themeConfig: {
            primaryColor: '#be185d',
            secondaryColor: '#881337',
            fontFamily: 'Lato',
            layoutMode: 'sidebar-right',
            textColor: '#ffe4e6',
            bodyTextColor: '#1c1917'
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
                avatarUrl: 'https://ui-avatars.com/api/?name=Le+Phuong+Khanh&background=be185d&color=ffffff&size=150&bold=true',
                linkedIn: 'linkedin.com/in/khanh-ux',
                portfolio: 'behance.net/khanh-ux-design'
            },
            about: 'Senior UX Designer 5 năm kinh nghiệm thiết kế sản phẩm số lấy người dùng làm trung tâm trong Fintech, E-commerce và EdTech. Thành thạo toàn bộ Design Process từ User Research, Wireframing đến Usability Testing. Đã dẫn dắt Design System cho 3 sản phẩm cấp doanh nghiệp với 120+ component.',
            experience: [
                {
                    company: 'VNPay',
                    position: 'Senior UX / Product Designer',
                    startDate: '2022-01',
                    endDate: null,
                    isCurrent: true,
                    location: 'TP. Hồ Chí Minh',
                    description: 'Redesign luồng QR Payment giảm số bước từ 7 xuống 3, tăng conversion 28%. Xây dựng Design System 120+ component trên Figma, đồng bộ 6 Designer và 12 Frontend Developer. Tổ chức User Testing 40+ người/tháng.'
                },
                {
                    company: 'Base.vn',
                    position: 'UX Designer',
                    startDate: '2020-03',
                    endDate: '2021-12',
                    isCurrent: false,
                    location: 'TP. Hồ Chí Minh',
                    description: 'Thiết kế 4 module HRM, CRM, Project, Approval Flow. Phỏng vấn 30+ SME owners, cải thiện NPS Score từ 32 lên 61 sau 2 vòng redesign.'
                },
                {
                    company: 'Freelance',
                    position: 'UI Designer',
                    startDate: '2018-06',
                    endDate: '2020-02',
                    isCurrent: false,
                    location: 'Remote',
                    description: 'Thiết kế giao diện mobile app cho 15+ khách hàng trong và ngoài nước. Sử dụng Figma, Adobe XD và InVision.'
                }
            ],
            education: [
                {
                    school: 'Đại học Mỹ thuật TP. Hồ Chí Minh',
                    degree: 'Cử nhân',
                    major: 'Thiết kế Đồ họa',
                    startDate: '2014-09',
                    endDate: '2018-06',
                    gpa: '3.7 / 4.0'
                }
            ],
            skills: {
                displayStyle: 'progressbar',
                items: [
                    { name: 'Figma / FigJam', level: 97 },
                    { name: 'User Research & Testing', level: 90 },
                    { name: 'Design System', level: 88 },
                    { name: 'Prototyping (ProtoPie)', level: 82 },
                    { name: 'Adobe Illustrator / Photoshop', level: 78 },
                    { name: 'Motion Design (After Effects)', level: 60 },
                    { name: 'HTML / CSS (Basic)', level: 55 }
                ]
            },
            projects: [
                {
                    name: 'VNPay QR Payment Redesign',
                    description: 'Dẫn đầu dự án redesign, research + wireframe + prototype + test 80 người. Kết quả: giảm 57% drop-off rate.',
                    techStack: ['Figma', 'Maze', 'Hotjar'],
                    url: 'behance.net/khanh-ux-design/vnpay-qr'
                }
            ],
            contact: {
                email: 'khanh.uxdesign@gmail.com',
                phone: '0901 234 567',
                website: 'behance.net/khanh-ux-design',
                linkedIn: 'linkedin.com/in/khanh-ux'
            }
        }
    },

    // ── 7. GRAPHIC DESIGNER ───────────────────────────────────────────────────
    {
        templateId: 'premium_creative_05',
        themeConfig: {
            primaryColor: '#db2777',
            secondaryColor: '#4c1d95',
            fontFamily: 'Montserrat',
            layoutMode: 'top-header',
            textColor: '#fdf2f8',
            bodyTextColor: '#1e1b4b'
        },
        columnLayout: {
            left: ['skills', 'education'],
            right: ['about', 'experience', 'projects']
        },
        cvData: {
            personal: {
                fullName: 'Phan Thanh Thảo',
                jobTitle: 'Senior Graphic Designer',
                email: 'thanhthao.design@gmail.com',
                phoneNumber: '0966 778 889',
                address: 'Quận Phú Nhuận, TP. Hồ Chí Minh',
                avatarUrl: 'https://ui-avatars.com/api/?name=Phan+Thanh+Thao&background=db2777&color=ffffff&size=150&bold=true',
                linkedIn: 'linkedin.com/in/thanhthao-design',
                portfolio: 'thanhthao.myportfolio.com'
            },
            about: 'Senior Graphic Designer 7 năm kinh nghiệm tại agency và in-house, chuyên sâu về Brand Identity, Packaging Design và Social Media Visual. Đã xây dựng bộ nhận diện thương hiệu cho 40+ nhãn hàng F&B, FMCG và thời trang. Kết hợp tư duy chiến lược thương hiệu với kỹ năng thực thi sắc nét.',
            experience: [
                {
                    company: 'Masan Consumer',
                    position: 'Senior Graphic Designer',
                    startDate: '2021-07',
                    endDate: null,
                    isCurrent: true,
                    location: 'TP. Hồ Chí Minh',
                    description: 'Thiết kế packaging và visual identity cho danh mục 15 sản phẩm FMCG (Chinsu, Nam Ngư, WinMart). Dẫn đầu refresh brand identity cho dòng sản phẩm Kokomi tăng nhận diện 34%. Quản lý Brand Asset Library với 2,000+ file chuẩn hóa cho 50 agency partner.'
                },
                {
                    company: 'Ogilvy Vietnam',
                    position: 'Art Director',
                    startDate: '2018-03',
                    endDate: '2021-06',
                    isCurrent: false,
                    location: 'TP. Hồ Chí Minh',
                    description: 'Thực thi ý tưởng sáng tạo cho khách hàng lớn: Unilever, KFC, Heineken. Dẫn dắt team 3 designer, đảm bảo deliverable đúng hạn 98%. Đạt giải Bronze tại Effie Awards 2020 cho chiến dịch "Tết Tươi" của KFC.'
                },
                {
                    company: 'Lollypop Agency',
                    position: 'Graphic Designer',
                    startDate: '2016-01',
                    endDate: '2018-02',
                    isCurrent: false,
                    location: 'TP. Hồ Chí Minh',
                    description: 'Thiết kế branding, ấn phẩm và social media cho 20+ khách hàng vừa và nhỏ. Thành thạo quy trình in offset, digital print và production.'
                }
            ],
            education: [
                {
                    school: 'Đại học Kiến trúc TP. Hồ Chí Minh',
                    degree: 'Cử nhân',
                    major: 'Thiết kế Đồ họa & Truyền thông',
                    startDate: '2012-09',
                    endDate: '2016-06',
                    gpa: ''
                }
            ],
            skills: {
                displayStyle: 'progressbar',
                items: [
                    { name: 'Adobe Illustrator', level: 98 },
                    { name: 'Adobe Photoshop', level: 95 },
                    { name: 'InDesign / Packaging', level: 90 },
                    { name: 'Figma (UI/Motion)', level: 80 },
                    { name: 'After Effects', level: 72 },
                    { name: 'Brand Identity Strategy', level: 85 },
                    { name: 'Cinema 4D (Basic)', level: 50 }
                ]
            },
            projects: [
                {
                    name: 'Kokomi Brand Refresh 2023',
                    description: 'Dẫn đầu dự án refresh identity cho dòng mì Kokomi: logo, bao bì, POSM. Nghiên cứu thị trường, phát triển 5 concept, production cho 8 SKU. Tăng brand awareness 34% sau 6 tháng.',
                    techStack: ['Illustrator', 'Photoshop', 'InDesign'],
                    url: ''
                }
            ],
            contact: {
                email: 'thanhthao.design@gmail.com',
                phone: '0966 778 889',
                website: 'thanhthao.myportfolio.com',
                linkedIn: 'linkedin.com/in/thanhthao-design'
            }
        }
    },

    // ── 8. CONTENT CREATOR / COPYWRITER ──────────────────────────────────────
    {
        templateId: 'creative_marketing_01',
        themeConfig: {
            primaryColor: '#ea580c',
            secondaryColor: '#7c2d12',
            fontFamily: 'Roboto',
            layoutMode: 'sidebar-left',
            textColor: '#fff7ed',
            bodyTextColor: '#1c1917'
        },
        columnLayout: {
            left: ['personal', 'contact', 'skills', 'education'],
            right: ['about', 'experience', 'projects']
        },
        cvData: {
            personal: {
                fullName: 'Vũ Minh Châu',
                jobTitle: 'Content Strategist & Copywriter',
                email: 'minhchau.content@gmail.com',
                phoneNumber: '0922 334 445',
                address: 'Quận Hoàn Kiếm, Hà Nội',
                avatarUrl: 'https://ui-avatars.com/api/?name=Vu+Minh+Chau&background=ea580c&color=ffffff&size=150&bold=true',
                linkedIn: 'linkedin.com/in/minhchau-content',
                website: 'minhchau.substack.com'
            },
            about: 'Content Strategist 5 năm kinh nghiệm xây dựng nội dung sáng tạo và chiến lược editorial cho các thương hiệu F&B, Lifestyle và D2C tại Việt Nam. Chuyên sâu về Storytelling, Long-form Content và Viral Social Copy. Đã tạo ra 12 bài viết đạt 1M+ views organic và xây dựng cộng đồng 300,000+ followers cho khách hàng.',
            experience: [
                {
                    company: 'Highlands Coffee',
                    position: 'Content Strategy Manager',
                    startDate: '2022-02',
                    endDate: null,
                    isCurrent: true,
                    location: 'Hà Nội',
                    description: 'Xây dựng và thực thi content strategy đa kênh cho Highlands Coffee (Facebook 2.3M, TikTok 850K, Instagram 420K). Lên lịch nội dung 30 bài/tháng, dẫn dắt team 4 writer và 2 designer. Chiến dịch "Cà phê Sáng Việt" đạt 8.5M organic reach, tăng 28% brand mentions.'
                },
                {
                    company: 'Buzzmetrics (Nielsen)',
                    position: 'Senior Content Creator',
                    startDate: '2019-09',
                    endDate: '2022-01',
                    isCurrent: false,
                    location: 'Hà Nội',
                    description: 'Viết báo cáo insight thị trường và content marketing cho 20+ nhãn hàng FMCG, Ngân hàng, Bất động sản. Phát triển format "Social Listening Report" được 15 client dùng làm template chuẩn.'
                },
                {
                    company: 'Freelance Copywriter',
                    position: 'Copywriter',
                    startDate: '2017-06',
                    endDate: '2019-08',
                    isCurrent: false,
                    location: 'Hà Nội',
                    description: 'Viết copy cho landing page, email campaign và quảng cáo Facebook cho 30+ SME. Chuyên sâu thể loại long-form advertorial và email sequence tự động hóa.'
                }
            ],
            education: [
                {
                    school: 'Đại học Khoa học Xã hội & Nhân văn Hà Nội',
                    degree: 'Cử nhân',
                    major: 'Báo chí & Truyền thông',
                    startDate: '2013-09',
                    endDate: '2017-06',
                    gpa: '3.6 / 4.0'
                }
            ],
            skills: {
                displayStyle: 'tag',
                items: [
                    { name: 'Copywriting / Storytelling', level: 97 },
                    { name: 'Content Strategy', level: 92 },
                    { name: 'SEO Writing', level: 85 },
                    { name: 'Social Media (FB/TikTok/IG)', level: 90 },
                    { name: 'Email Marketing (Mailchimp)', level: 80 },
                    { name: 'Canva / Adobe Express', level: 75 },
                    { name: 'Google Analytics 4', level: 72 },
                    { name: 'Viral Content Research', level: 88 }
                ]
            },
            projects: [
                {
                    name: 'Chiến dịch "Cà phê Sáng Việt" 2023',
                    description: 'Lên concept, viết 45 bài content đa định dạng (video script, post, story, blog). Đạt 8.5M organic reach, 120K shares, tăng 28% brand mentions trong 3 tháng.',
                    techStack: ['Facebook', 'TikTok', 'Instagram', 'Canva'],
                    url: ''
                }
            ],
            contact: {
                email: 'minhchau.content@gmail.com',
                phone: '0922 334 445',
                website: 'minhchau.substack.com',
                linkedIn: 'linkedin.com/in/minhchau-content'
            }
        }
    },

    // ── 9. SEO SPECIALIST ─────────────────────────────────────────────────────
    {
        templateId: 'premium_compact_07',
        themeConfig: {
            primaryColor: '#4338ca',
            secondaryColor: '#1e1b4b',
            fontFamily: 'Inter',
            layoutMode: 'sidebar-left',
            textColor: '#e0e7ff',
            bodyTextColor: '#1e1b4b'
        },
        columnLayout: {
            left: ['personal', 'contact', 'skills', 'education'],
            right: ['about', 'experience', 'projects']
        },
        cvData: {
            personal: {
                fullName: 'Hoàng Đức Trung',
                jobTitle: 'SEO Lead / Technical SEO Specialist',
                email: 'ducttrung.seo@gmail.com',
                phoneNumber: '0955 667 778',
                address: 'Quận Bình Thạnh, TP. Hồ Chí Minh',
                avatarUrl: 'https://ui-avatars.com/api/?name=Hoang+Duc+Trung&background=4338ca&color=ffffff&size=150&bold=true',
                linkedIn: 'linkedin.com/in/ductrung-seo',
                website: 'ductrung.seo'
            },
            about: 'SEO Specialist 6 năm kinh nghiệm tăng trưởng organic traffic cho các website thương mại điện tử, tài chính và bất động sản. Chuyên sâu Technical SEO, Content Architecture và Link Building mũ trắng. Đã đưa 5 domain từ DA20 lên DA50+ trong 12 tháng và tăng organic revenue 3.2x cho khách hàng.',
            experience: [
                {
                    company: 'PropertyGuru Vietnam',
                    position: 'SEO Lead',
                    startDate: '2021-04',
                    endDate: null,
                    isCurrent: true,
                    location: 'TP. Hồ Chí Minh',
                    description: 'Dẫn dắt SEO strategy cho batdongsan.com.vn: tăng organic traffic từ 2.1M lên 5.8M phiên/tháng trong 18 tháng. Triển khai Technical SEO: Core Web Vitals tất cả trang đạt "Good", crawl budget optimization giảm 40% thời gian index. Xây dựng nội dung cluster 800+ bài tập trung 12 chủ đề bất động sản trọng tâm.'
                },
                {
                    company: 'Tiki Corporation',
                    position: 'Senior SEO Specialist',
                    startDate: '2018-11',
                    endDate: '2021-03',
                    isCurrent: false,
                    location: 'TP. Hồ Chí Minh',
                    description: 'Tối ưu SEO on-page cho 5 triệu URL sản phẩm và category. Xây dựng hệ thống tự động generate meta description bằng template, phủ 100% trang. Tăng organic revenue từ danh mục Điện tử 180% trong 12 tháng.'
                },
                {
                    company: 'SEOViệt Agency',
                    position: 'SEO Executive',
                    startDate: '2016-06',
                    endDate: '2018-10',
                    isCurrent: false,
                    location: 'TP. Hồ Chí Minh',
                    description: 'Thực hiện SEO On-page / Off-page cho 25 khách hàng đồng thời. Đưa 60+ từ khoá thương mại lên top 3 Google Việt Nam trong 6 tháng.'
                }
            ],
            education: [
                {
                    school: 'Đại học Kinh tế TP. Hồ Chí Minh',
                    degree: 'Cử nhân',
                    major: 'Thương mại Điện tử',
                    startDate: '2012-09',
                    endDate: '2016-06',
                    gpa: '3.3 / 4.0'
                }
            ],
            skills: {
                displayStyle: 'progressbar',
                items: [
                    { name: 'Technical SEO / CWV', level: 95 },
                    { name: 'Content Strategy / Cluster', level: 90 },
                    { name: 'Ahrefs / Semrush / Screaming Frog', level: 93 },
                    { name: 'Google Search Console / GA4', level: 92 },
                    { name: 'Link Building (White Hat)', level: 85 },
                    { name: 'Python / JS (Automation SEO)', level: 65 },
                    { name: 'Schema Markup / Structured Data', level: 88 },
                    { name: 'SQL (log analysis)', level: 70 }
                ]
            },
            projects: [
                {
                    name: 'PropertyGuru SEO Revamp – 5.8M phiên/tháng',
                    description: 'Tái cấu trúc toàn bộ internal linking, content silo và technical foundation. Kết quả 18 tháng: +177% organic traffic, +210% organic leads.',
                    techStack: ['Ahrefs', 'Screaming Frog', 'Python', 'Google Data Studio'],
                    url: ''
                }
            ],
            contact: {
                email: 'ducttrung.seo@gmail.com',
                phone: '0955 667 778',
                website: 'ductrung.seo',
                linkedIn: 'linkedin.com/in/ductrung-seo'
            }
        }
    },

    // ── 10. SALES MANAGER (B2B) ───────────────────────────────────────────────
    {
        templateId: 'premium_bold_10',
        themeConfig: {
            primaryColor: '#b91c1c',
            secondaryColor: '#1c1917',
            fontFamily: 'Roboto',
            layoutMode: 'sidebar-left',
            textColor: '#fef2f2',
            bodyTextColor: '#1c1917'
        },
        columnLayout: {
            left: ['personal', 'contact', 'skills', 'education'],
            right: ['about', 'experience', 'projects']
        },
        cvData: {
            personal: {
                fullName: 'Bùi Tiến Dũng',
                jobTitle: 'Regional Sales Manager',
                email: 'tiendung.sales@gmail.com',
                phoneNumber: '0988 123 456',
                address: 'Quận 1, TP. Hồ Chí Minh',
                avatarUrl: 'https://ui-avatars.com/api/?name=Bui+Tien+Dung&background=b91c1c&color=ffffff&size=150&bold=true',
                linkedIn: 'linkedin.com/in/tiendung-sales'
            },
            about: 'Regional Sales Manager 8 năm kinh nghiệm phát triển kinh doanh B2B trong lĩnh vực SaaS, ERP và giải pháp công nghệ cho doanh nghiệp. Thành tích vượt quota 6 năm liên tiếp, trung bình 127% target. Chuyên sâu về Enterprise Sales Cycle, MEDDIC framework và xây dựng đội ngũ bán hàng hiệu quả cao.',
            experience: [
                {
                    company: 'SAP Vietnam',
                    position: 'Regional Sales Manager – SME Segment',
                    startDate: '2020-06',
                    endDate: null,
                    isCurrent: true,
                    location: 'TP. Hồ Chí Minh',
                    description: 'Quản lý team 8 Account Executive, phụ trách pipeline 45 tỷ đồng/năm. Đạt 132% revenue target FY2023 (cao nhất khu vực SEA). Mở rộng thị trường SME từ 120 lên 280 khách hàng active. Thiết kế quy trình sales MEDDIC giảm sales cycle trung bình từ 5.2 tháng xuống 3.1 tháng.'
                },
                {
                    company: 'Salesforce Vietnam',
                    position: 'Enterprise Account Executive',
                    startDate: '2017-03',
                    endDate: '2020-05',
                    isCurrent: false,
                    location: 'TP. Hồ Chí Minh',
                    description: 'Phụ trách 40 enterprise account tại khu vực TP.HCM và Đông Nam Bộ với ARR 28 tỷ đồng. Ký kết deal lớn nhất công ty tại Việt Nam (8.5 tỷ đồng với Masan Group). Chạm mốc President Club 2019.'
                },
                {
                    company: 'FPT IS',
                    position: 'Sales Executive',
                    startDate: '2015-01',
                    endDate: '2017-02',
                    isCurrent: false,
                    location: 'TP. Hồ Chí Minh',
                    description: 'Phát triển khách hàng mới trong lĩnh vực phần mềm ERP và tích hợp hệ thống. Đạt Top 3 nhân viên kinh doanh xuất sắc toàn công ty 2016.'
                }
            ],
            education: [
                {
                    school: 'Đại học Kinh tế TP. Hồ Chí Minh',
                    degree: 'Cử nhân',
                    major: 'Quản trị Kinh doanh',
                    startDate: '2011-09',
                    endDate: '2015-06',
                    gpa: '3.3 / 4.0'
                }
            ],
            skills: {
                displayStyle: 'tag',
                items: [
                    { name: 'Enterprise B2B Sales', level: 97 },
                    { name: 'MEDDIC / SPIN Selling', level: 92 },
                    { name: 'Sales Team Management', level: 88 },
                    { name: 'Salesforce CRM', level: 90 },
                    { name: 'Negotiation & Closing', level: 93 },
                    { name: 'Pipeline Forecasting', level: 87 },
                    { name: 'Tiếng Anh (Business)', level: 85 },
                    { name: 'PowerPoint / Executive Presentation', level: 88 }
                ]
            },
            projects: [
                {
                    name: 'Mở rộng thị trường SME – SAP Vietnam 2022-2023',
                    description: 'Thiết kế go-to-market strategy mới cho phân khúc SME 50-500 nhân viên. Kết quả: +133% new logo, ARR tăng từ 18 tỷ lên 42 tỷ trong 2 năm.',
                    techStack: ['Salesforce', 'HubSpot', 'LinkedIn Sales Navigator'],
                    url: ''
                }
            ],
            contact: {
                email: 'tiendung.sales@gmail.com',
                phone: '0988 123 456',
                linkedIn: 'linkedin.com/in/tiendung-sales'
            }
        }
    },

    // ── 11. HUMAN RESOURCES MANAGER ──────────────────────────────────────────
    {
        templateId: 'premium_minimal_03',
        themeConfig: {
            primaryColor: '#0f766e',
            secondaryColor: '#f0fdfa',
            fontFamily: 'Montserrat',
            layoutMode: 'minimal-1-col',
            textColor: '#134e4a',
            bodyTextColor: '#134e4a'
        },
        columnLayout: {
            left: ['about', 'experience'],
            right: ['education', 'skills', 'projects']
        },
        cvData: {
            personal: {
                fullName: 'Đỗ Thị Lan Anh',
                jobTitle: 'Human Resources Manager',
                email: 'lananh.hr@gmail.com',
                phoneNumber: '0911 222 333',
                address: 'Quận Nam Từ Liêm, Hà Nội',
                avatarUrl: 'https://ui-avatars.com/api/?name=Do+Lan+Anh&background=0f766e&color=ffffff&size=150&bold=true',
                linkedIn: 'linkedin.com/in/lananh-hr'
            },
            about: 'HR Manager 8 năm kinh nghiệm quản trị nhân sự toàn diện (C&B, Talent Acquisition, L&D và Employee Relations) tại các công ty FDI và startup công nghệ quy mô 200-1,500 nhân viên. Thành thạo hệ thống đánh giá hiệu suất OKR/KPI, xây dựng chính sách tổng đãi ngộ cạnh tranh và chương trình phát triển lãnh đạo kế nhiệm.',
            experience: [
                {
                    company: 'Bosch Vietnam',
                    position: 'HR Manager',
                    startDate: '2020-09',
                    endDate: null,
                    isCurrent: true,
                    location: 'Hà Nội',
                    description: 'Phụ trách toàn bộ hoạt động HR cho 600 nhân viên tại 3 văn phòng Hà Nội, TP.HCM và Đà Nẵng. Triển khai hệ thống OKR toàn công ty, tăng tỷ lệ hoàn thành mục tiêu từ 58% lên 81%. Tái thiết kế C&B framework: giảm turnover rate từ 22% xuống 11% trong 18 tháng. Xây dựng Succession Planning cho 25 vị trí key role.'
                },
                {
                    company: 'Lazada Vietnam',
                    position: 'Senior HRBP',
                    startDate: '2017-04',
                    endDate: '2020-08',
                    isCurrent: false,
                    location: 'TP. Hồ Chí Minh',
                    description: 'HRBP cho 4 phòng ban (Tech, Product, Marketing, Operations) với 350 nhân sự. Dẫn dắt chương trình Graduate Trainee tuyển 30 sinh viên xuất sắc/năm. Thiết kế Manager Capability Program nâng cao năng lực cho 45 quản lý cấp trung.'
                },
                {
                    company: 'Unilever Vietnam',
                    position: 'HR Executive',
                    startDate: '2015-07',
                    endDate: '2017-03',
                    isCurrent: false,
                    location: 'TP. Hồ Chí Minh',
                    description: 'Tuyển dụng 80 vị trí/năm cho khối Sales và Supply Chain. Phối hợp tổ chức 15 chương trình L&D nội bộ và 8 workshop kỹ năng mềm/năm.'
                }
            ],
            education: [
                {
                    school: 'Đại học Lao động – Xã hội',
                    degree: 'Cử nhân',
                    major: 'Quản trị Nhân lực',
                    startDate: '2011-09',
                    endDate: '2015-06',
                    gpa: '3.7 / 4.0'
                }
            ],
            skills: {
                displayStyle: 'tag',
                items: [
                    { name: 'Talent Acquisition', level: 92 },
                    { name: 'C&B Design / Benchmark', level: 90 },
                    { name: 'OKR / KPI Framework', level: 88 },
                    { name: 'Learning & Development', level: 85 },
                    { name: 'HRIS (SAP HR / Workday)', level: 80 },
                    { name: 'Employee Engagement', level: 88 },
                    { name: 'Succession Planning', level: 82 },
                    { name: 'Labor Law Vietnam', level: 87 }
                ]
            },
            projects: [
                {
                    name: 'Bosch C&B Redesign – Giảm Turnover 50%',
                    description: 'Benchmark lương thị trường với Mercer, thiết kế lại salary band và bonus scheme. Kết quả: turnover giảm từ 22% xuống 11%, employee satisfaction tăng từ 3.2 lên 4.1/5.',
                    techStack: ['SAP HR', 'Mercer Benchmark', 'Power BI'],
                    url: ''
                }
            ],
            contact: {
                email: 'lananh.hr@gmail.com',
                phone: '0911 222 333',
                linkedIn: 'linkedin.com/in/lananh-hr'
            }
        }
    },

    // ── 12. SUPPLY CHAIN / LOGISTICS MANAGER ─────────────────────────────────
    {
        templateId: 'elegant_business_01',
        themeConfig: {
            primaryColor: '#047857',
            secondaryColor: '#064e3b',
            fontFamily: 'Merriweather',
            layoutMode: 'sidebar-left',
            textColor: '#d1fae5',
            bodyTextColor: '#064e3b'
        },
        columnLayout: {
            left: ['personal', 'contact', 'skills', 'education'],
            right: ['about', 'experience', 'projects']
        },
        cvData: {
            personal: {
                fullName: 'Trương Văn Minh',
                jobTitle: 'Supply Chain & Logistics Manager',
                email: 'vanminh.scm@gmail.com',
                phoneNumber: '0972 445 667',
                address: 'Quận Bình Dương',
                avatarUrl: 'https://ui-avatars.com/api/?name=Truong+Van+Minh&background=047857&color=ffffff&size=150&bold=true',
                linkedIn: 'linkedin.com/in/vanminh-scm'
            },
            about: 'Supply Chain Manager 9 năm kinh nghiệm tối ưu hóa chuỗi cung ứng và vận hành kho cho các tập đoàn sản xuất và phân phối đa quốc gia. Chuyên sâu về S&OP, Inventory Optimization và phát triển mạng lưới nhà cung cấp. Đã giảm 18% chi phí logistics và tăng On-Time-Delivery lên 97.5% cho nhà máy 5,000 công nhân.',
            experience: [
                {
                    company: 'Samsung Electronics Vietnam',
                    position: 'Supply Chain Manager',
                    startDate: '2019-04',
                    endDate: null,
                    isCurrent: true,
                    location: 'Bình Dương',
                    description: 'Quản lý chuỗi cung ứng cho nhà máy sản xuất TV và màn hình với 5,000 công nhân, doanh thu xuất khẩu 1.2 tỷ USD/năm. Triển khai S&OP process, giảm forecast error từ 18% xuống 7%. Tối ưu safety stock theo mô hình xác suất, giảm tồn kho 120 tỷ đồng. Phát triển 35 local supplier đạt chuẩn Samsung Global Supplier Standard.'
                },
                {
                    company: 'DHL Supply Chain Vietnam',
                    position: 'Operations Manager',
                    startDate: '2015-06',
                    endDate: '2019-03',
                    isCurrent: false,
                    location: 'TP. Hồ Chí Minh',
                    description: 'Quản lý 3PL warehouse 50,000m² cho 8 khách hàng FMCG, đạt inventory accuracy 99.7%. Triển khai WMS (SAP EWM) cho 2 kho lớn, tăng năng suất picking 35%. Dẫn dắt team 120 nhân viên kho bãi và 15 supervisor.'
                },
                {
                    company: 'Unilever Vietnam',
                    position: 'Logistics Coordinator',
                    startDate: '2013-01',
                    endDate: '2015-05',
                    isCurrent: false,
                    location: 'TP. Hồ Chí Minh',
                    description: 'Điều phối vận chuyển hàng hóa từ nhà máy đến 12 kho vùng trên toàn quốc. On-Time-Delivery duy trì 96.5%, tối ưu tải trọng xe tải tiết kiệm 12% chi phí vận tải.'
                }
            ],
            education: [
                {
                    school: 'Đại học Giao thông Vận tải TP. HCM',
                    degree: 'Kỹ sư',
                    major: 'Vận tải – Logistics',
                    startDate: '2009-09',
                    endDate: '2013-06',
                    gpa: '3.4 / 4.0'
                }
            ],
            skills: {
                displayStyle: 'tag',
                items: [
                    { name: 'S&OP / Demand Planning', level: 93 },
                    { name: 'SAP SCM / EWM', level: 88 },
                    { name: 'Inventory Optimization', level: 90 },
                    { name: 'Supplier Development', level: 85 },
                    { name: 'Lean / Six Sigma (Green Belt)', level: 82 },
                    { name: 'Power BI / Advanced Excel', level: 80 },
                    { name: 'Incoterms / Import-Export', level: 88 },
                    { name: 'Tiếng Anh / Tiếng Hàn (Cơ bản)', level: 75 }
                ]
            },
            projects: [
                {
                    name: 'Samsung S&OP Implementation',
                    description: 'Triển khai quy trình S&OP từ 0 tại nhà máy Samsung Bình Dương. Kết quả: forecast error giảm 61%, overstock giảm 120 tỷ đồng, OTIF tăng từ 89% lên 97.5%.',
                    techStack: ['SAP APO', 'Power BI', 'Advanced Excel'],
                    url: ''
                }
            ],
            contact: {
                email: 'vanminh.scm@gmail.com',
                phone: '0972 445 667',
                linkedIn: 'linkedin.com/in/vanminh-scm'
            }
        }
    },

    // ── 13. FINANCIAL ANALYST ─────────────────────────────────────────────────
    {
        templateId: 'premium_luxury_02',
        themeConfig: {
            primaryColor: '#d4af37',
            secondaryColor: '#1c1917',
            fontFamily: 'Playfair Display',
            layoutMode: 'sidebar-right',
            textColor: '#fefce8',
            bodyTextColor: '#1c1917'
        },
        columnLayout: {
            left: ['about', 'experience', 'projects'],
            right: ['personal', 'contact', 'skills', 'education']
        },
        cvData: {
            personal: {
                fullName: 'Nguyễn Hoàng Anh',
                jobTitle: 'Senior Financial Analyst (CFA)',
                email: 'hoanganh.cfa@gmail.com',
                phoneNumber: '0938 999 000',
                address: 'Quận 1, TP. Hồ Chí Minh',
                avatarUrl: 'https://ui-avatars.com/api/?name=Nguyen+Hoang+Anh&background=d4af37&color=1c1917&size=150&bold=true',
                linkedIn: 'linkedin.com/in/hoanganh-cfa'
            },
            about: 'Senior Financial Analyst với chứng chỉ CFA Level III, 7 năm kinh nghiệm trong lĩnh vực Corporate Finance, M&A Advisory và Equity Research tại các tổ chức tài chính hàng đầu. Thành thạo Financial Modelling (DCF, LBO, Comparable), Valuation và phân tích báo cáo tài chính theo chuẩn IFRS/VAS. Đã tham gia 8 thương vụ M&A tổng giá trị hơn 500 triệu USD.',
            experience: [
                {
                    company: 'KPMG Corporate Finance Vietnam',
                    position: 'Senior Financial Analyst',
                    startDate: '2021-01',
                    endDate: null,
                    isCurrent: true,
                    location: 'TP. Hồ Chí Minh',
                    description: 'Tư vấn M&A và định giá doanh nghiệp cho 5 thương vụ lớn/năm trong lĩnh vực bất động sản, ngân hàng và logistics. Xây dựng Financial Model phức tạp (3-statement + DCF + LBO) cho deal 120 triệu USD với 15 scenario. Viết Information Memorandum và Management Presentation thuyết phục investor nước ngoài.'
                },
                {
                    company: 'SSI Securities',
                    position: 'Equity Research Analyst',
                    startDate: '2017-07',
                    endDate: '2020-12',
                    isCurrent: false,
                    location: 'TP. Hồ Chí Minh',
                    description: 'Phân tích đầu tư và viết báo cáo cho 12 doanh nghiệp niêm yết ngành ngân hàng và bất động sản. Mô hình dự báo tăng trưởng EPS sai số < 8% qua 3 năm. Báo cáo "Ngân hàng Việt 2020" được Bloomberg trích dẫn.'
                },
                {
                    company: 'Mekong Capital',
                    position: 'Investment Analyst',
                    startDate: '2015-08',
                    endDate: '2017-06',
                    isCurrent: false,
                    location: 'TP. Hồ Chí Minh',
                    description: 'Thực hiện due diligence tài chính cho 4 thương vụ PE đầu tư vào doanh nghiệp tiêu dùng và F&B tăng trưởng nhanh. Xây dựng Investment Thesis và IRR/MOIC projection.'
                }
            ],
            education: [
                {
                    school: 'Đại học Kinh tế TP. Hồ Chí Minh',
                    degree: 'Thạc sĩ',
                    major: 'Tài chính Doanh nghiệp',
                    startDate: '2015-09',
                    endDate: '2017-06',
                    gpa: '3.8 / 4.0'
                }
            ],
            skills: {
                displayStyle: 'progressbar',
                items: [
                    { name: 'Financial Modelling (DCF, LBO)', level: 97 },
                    { name: 'Valuation (Comps, Precedents)', level: 95 },
                    { name: 'M&A Due Diligence', level: 90 },
                    { name: 'IFRS / VAS Accounting', level: 88 },
                    { name: 'Excel / VBA (Advanced)', level: 93 },
                    { name: 'Bloomberg / Refinitiv', level: 85 },
                    { name: 'PowerPoint (Executive Deck)', level: 90 },
                    { name: 'Tiếng Anh (Business – IELTS 8.0)', level: 92 }
                ]
            },
            projects: [
                {
                    name: 'M&A Advisory – Logistics Company 120M USD',
                    description: 'Lead analyst cho thương vụ bán cổ phần chiến lược 40% cho nhà đầu tư Nhật Bản. Xây dựng full Financial Model, tổ chức Management Presentation. Deal thành công trong 9 tháng.',
                    techStack: ['Excel (Advanced)', 'PowerPoint', 'Bloomberg'],
                    url: ''
                }
            ],
            contact: {
                email: 'hoanganh.cfa@gmail.com',
                phone: '0938 999 000',
                linkedIn: 'linkedin.com/in/hoanganh-cfa'
            }
        }
    },

    // ── 14. KẾ TOÁN TRƯỞNG ───────────────────────────────────────────────────
    {
        templateId: 'premium_academic_08',
        themeConfig: {
            primaryColor: '#334155',
            secondaryColor: '#f1f5f9',
            fontFamily: 'Merriweather',
            layoutMode: 'minimal-1-col',
            textColor: '#0f172a',
            bodyTextColor: '#0f172a'
        },
        columnLayout: {
            left: ['about', 'experience'],
            right: ['education', 'skills', 'projects']
        },
        cvData: {
            personal: {
                fullName: 'Phạm Thị Bích Ngọc',
                jobTitle: 'Kế toán Trưởng (Chief Accountant)',
                email: 'bichngoc.cpa@gmail.com',
                phoneNumber: '0933 111 222',
                address: 'Quận Long Biên, Hà Nội',
                avatarUrl: 'https://ui-avatars.com/api/?name=Pham+Bich+Ngoc&background=334155&color=ffffff&size=150&bold=true',
                linkedIn: 'linkedin.com/in/bichngoc-cpa'
            },
            about: 'Kế toán Trưởng với chứng chỉ CPA Việt Nam và 10 năm kinh nghiệm kế toán tổng hợp, kiểm soát nội bộ và quản trị tài chính. Thành thạo chuẩn mực VAS và IFRS, có kinh nghiệm làm việc với Big4 (Deloitte, EY) và đàm phán tín dụng ngân hàng.',
            experience: [
                {
                    company: 'Công ty CP Nhựa Tiền Phong',
                    position: 'Kế toán Trưởng',
                    startDate: '2018-05',
                    endDate: null,
                    isCurrent: true,
                    location: 'Hà Nội',
                    description: 'Điều hành phòng kế toán 8 nhân sự, lập BCTC theo VAS và IFRS. Tái cấu trúc quy trình công nợ trên SAP FICO, giảm thời gian đối chiếu từ 5 ngày xuống 1 ngày. Xây dựng Internal Control Framework chuẩn COSO 2013, giảm sai sót dưới 0.05%.'
                },
                {
                    company: 'Deloitte Vietnam',
                    position: 'Audit Senior',
                    startDate: '2014-08',
                    endDate: '2018-04',
                    isCurrent: false,
                    location: 'Hà Nội',
                    description: 'Kiểm toán BCTC độc lập cho 12+ khách hàng lớn (sản xuất, ngân hàng). Phát hiện rủi ro trọng yếu liên quan dự phòng HTK. Đào tạo 4 nhân viên cấp Associate.'
                },
                {
                    company: 'Công ty TNHH TM Hoàng Long',
                    position: 'Kế toán Tổng hợp',
                    startDate: '2012-01',
                    endDate: '2014-07',
                    isCurrent: false,
                    location: 'Hà Nội',
                    description: 'Hạch toán doanh thu, chi phí, TSCĐ và lập BCTC quý theo VAS. Quyết toán thuế TNDN, GTGT hàng năm.'
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
                    { name: 'Kiểm soát Nội bộ COSO', level: 85 },
                    { name: 'Quyết toán Thuế TNDN / GTGT', level: 90 },
                    { name: 'Excel Nâng cao / Power Query', level: 82 },
                    { name: 'MISA Accounting', level: 88 },
                    { name: 'Cash Flow Management', level: 80 },
                    { name: 'Kiểm toán Nội bộ', level: 78 }
                ]
            },
            projects: [
                {
                    name: 'Dự án Chuyển đổi SAP S/4HANA',
                    description: 'Core team chuyển đổi từ hệ thống cũ sang SAP S/4HANA: mapping data, UAT kế toán và đào tạo 15 kế toán viên sau go-live.',
                    techStack: ['SAP S/4HANA', 'SAP FICO', 'Excel'],
                    url: ''
                }
            ],
            contact: {
                email: 'bichngoc.cpa@gmail.com',
                phone: '0933 111 222',
                linkedIn: 'linkedin.com/in/bichngoc-cpa'
            }
        }
    },

    // ── 15. LUẬT SƯ / LEGAL COUNSEL ──────────────────────────────────────────
    {
        templateId: 'premium_academic_08',
        themeConfig: {
            primaryColor: '#1e3a5f',
            secondaryColor: '#f8fafc',
            fontFamily: 'Merriweather',
            layoutMode: 'minimal-1-col',
            textColor: '#0f172a',
            bodyTextColor: '#0f172a'
        },
        columnLayout: {
            left: ['about', 'experience'],
            right: ['education', 'skills', 'projects']
        },
        cvData: {
            personal: {
                fullName: 'Trần Ngọc Minh Khoa',
                jobTitle: 'Senior Legal Counsel – Corporate & M&A',
                email: 'minhkhoa.legal@gmail.com',
                phoneNumber: '0916 887 990',
                address: 'Quận Ba Đình, Hà Nội',
                avatarUrl: 'https://ui-avatars.com/api/?name=Tran+Minh+Khoa&background=1e3a5f&color=ffffff&size=150&bold=true',
                linkedIn: 'linkedin.com/in/minhkhoa-legal'
            },
            about: 'Senior Legal Counsel 8 năm kinh nghiệm pháp lý doanh nghiệp, M&A và luật đầu tư nước ngoài tại Việt Nam. Thành thạo tư vấn cơ cấu giao dịch M&A, soạn thảo hợp đồng thương mại quốc tế và xử lý tranh chấp thương mại. Hiểu sâu về Luật Đầu tư, Luật Doanh nghiệp và quy định tuân thủ cho FDI.',
            experience: [
                {
                    company: 'Mayer Brown (Vietnam)',
                    position: 'Senior Associate – Corporate / M&A',
                    startDate: '2020-03',
                    endDate: null,
                    isCurrent: true,
                    location: 'Hà Nội',
                    description: 'Tư vấn pháp lý cho 6 thương vụ M&A xuyên biên giới/năm tổng giá trị 300 triệu USD+. Soạn thảo và đàm phán SPA, SHA, JVA theo luật Anh và Việt Nam. Tư vấn cơ cấu đầu tư tối ưu thuế và tuân thủ cho 15 FDI enterprise trong lĩnh vực sản xuất và bất động sản.'
                },
                {
                    company: 'Vilaf Law Firm',
                    position: 'Associate Lawyer',
                    startDate: '2016-09',
                    endDate: '2020-02',
                    isCurrent: false,
                    location: 'Hà Nội',
                    description: 'Tư vấn Luật Doanh nghiệp, Đầu tư và Lao động cho 30+ doanh nghiệp FDI. Đại diện khách hàng trong tranh chấp thương mại tại VIAC, giải quyết thành công 8/10 vụ không cần phán quyết. Chuyên soạn hợp đồng EPC và PPP cho dự án hạ tầng.'
                },
                {
                    company: 'Văn phòng Luật sư Số Việt',
                    position: 'Luật sư Thực tập',
                    startDate: '2014-07',
                    endDate: '2016-08',
                    isCurrent: false,
                    location: 'Hà Nội',
                    description: 'Nghiên cứu pháp lý, soạn thảo hợp đồng mua bán, tư vấn thủ tục thành lập doanh nghiệp và đăng ký nhãn hiệu cho doanh nghiệp vừa và nhỏ.'
                }
            ],
            education: [
                {
                    school: 'Đại học Luật Hà Nội',
                    degree: 'Cử nhân',
                    major: 'Luật Kinh tế',
                    startDate: '2010-09',
                    endDate: '2014-06',
                    gpa: '3.75 / 4.0'
                }
            ],
            skills: {
                displayStyle: 'tag',
                items: [
                    { name: 'Corporate / M&A Law', level: 95 },
                    { name: 'Contract Drafting & Negotiation', level: 93 },
                    { name: 'FDI Structuring & Compliance', level: 90 },
                    { name: 'Commercial Arbitration (VIAC)', level: 85 },
                    { name: 'Luật Lao động Việt Nam', level: 88 },
                    { name: 'Tiếng Anh Pháp lý (IELTS 8.0)', level: 90 },
                    { name: 'Legal Research (Westlaw)', level: 82 },
                    { name: 'Tiếng Nhật Pháp lý (N2)', level: 70 }
                ]
            },
            projects: [
                {
                    name: 'M&A Cross-border – Retail Sector 85M USD',
                    description: 'Dẫn đầu pháp lý thương vụ nhà đầu tư Hàn Quốc mua 60% cổ phần chuỗi bán lẻ Việt Nam. Cơ cấu giao dịch tối ưu thuế, điều khoản bảo đảm quyền lợi seller và earn-out mechanism.',
                    techStack: ['Due Diligence', 'SPA / SHA', 'Competition Law'],
                    url: ''
                }
            ],
            contact: {
                email: 'minhkhoa.legal@gmail.com',
                phone: '0916 887 990',
                linkedIn: 'linkedin.com/in/minhkhoa-legal'
            }
        }
    },

    // ── 16. BÁC SĨ / DƯỢC SĨ ─────────────────────────────────────────────────
    {
        templateId: 'premium_minimal_03',
        themeConfig: {
            primaryColor: '#0369a1',
            secondaryColor: '#f0f9ff',
            fontFamily: 'Montserrat',
            layoutMode: 'minimal-1-col',
            textColor: '#0c4a6e',
            bodyTextColor: '#0c4a6e'
        },
        columnLayout: {
            left: ['about', 'experience'],
            right: ['education', 'skills', 'projects']
        },
        cvData: {
            personal: {
                fullName: 'Nguyễn Thị Thu Phương',
                jobTitle: 'Dược sĩ Lâm sàng / Clinical Pharmacist',
                email: 'thuphuong.pharmacist@gmail.com',
                phoneNumber: '0903 456 789',
                address: 'Quận Phú Nhuận, TP. Hồ Chí Minh',
                avatarUrl: 'https://ui-avatars.com/api/?name=Nguyen+Thu+Phuong&background=0369a1&color=ffffff&size=150&bold=true',
                linkedIn: 'linkedin.com/in/thuphuong-pharmacist'
            },
            about: 'Dược sĩ Lâm sàng 7 năm kinh nghiệm tại bệnh viện tuyến cuối và công ty dược phẩm đa quốc gia. Chuyên sâu về quản lý thuốc hóa trị, tư vấn sử dụng thuốc cho bệnh nhân ung thư và kiểm soát tương tác thuốc. Đã tham gia 3 thử nghiệm lâm sàng pha III và công bố 4 bài báo khoa học ISI.',
            experience: [
                {
                    company: 'Bệnh viện Ung Bướu TP. HCM',
                    position: 'Dược sĩ Lâm sàng',
                    startDate: '2020-02',
                    endDate: null,
                    isCurrent: true,
                    location: 'TP. Hồ Chí Minh',
                    description: 'Phụ trách dược lâm sàng khoa Ung bướu Nội, tư vấn phác đồ hóa trị cho 80 bệnh nhân/ngày. Kiểm soát tương tác thuốc, giảm 42% adverse drug reactions cần nhập viện. Xây dựng protocol quản lý thuốc high-alert tiêm truyền, được Bộ Y tế công nhận best practice.'
                },
                {
                    company: 'Roche Vietnam',
                    position: 'Medical Science Liaison',
                    startDate: '2016-09',
                    endDate: '2020-01',
                    isCurrent: false,
                    location: 'TP. Hồ Chí Minh',
                    description: 'Hỗ trợ khoa học cho dòng sản phẩm ung thư (Herceptin, Avastin, Perjeta) tại khu vực TP.HCM và miền Nam. Tổ chức 30+ Advisory Board Meeting với KOL. Hỗ trợ investigator cho 2 thử nghiệm lâm sàng pha III tại Việt Nam.'
                },
                {
                    company: 'Bệnh viện Đại học Y Dược TP. HCM',
                    position: 'Dược sĩ Thực hành',
                    startDate: '2014-07',
                    endDate: '2016-08',
                    isCurrent: false,
                    location: 'TP. Hồ Chí Minh',
                    description: 'Thực hành dược lâm sàng tại khoa Nội tổng hợp và khoa Tim mạch. Tư vấn sử dụng thuốc cho bác sĩ và bệnh nhân, kiểm soát đơn thuốc 200 bệnh nhân/ngày.'
                }
            ],
            education: [
                {
                    school: 'Đại học Y Dược TP. Hồ Chí Minh',
                    degree: 'Dược sĩ Đại học',
                    major: 'Dược Lâm sàng',
                    startDate: '2008-09',
                    endDate: '2014-06',
                    gpa: '8.4 / 10'
                }
            ],
            skills: {
                displayStyle: 'tag',
                items: [
                    { name: 'Dược Lâm sàng / Drug Therapy', level: 96 },
                    { name: 'Kiểm soát Tương tác Thuốc', level: 93 },
                    { name: 'Ung thư Dược lý', level: 90 },
                    { name: 'Clinical Trials (GCP)', level: 85 },
                    { name: 'Micromedex / UpToDate', level: 92 },
                    { name: 'Tiếng Anh Y khoa (IELTS 7.5)', level: 88 },
                    { name: 'Research & Medical Writing', level: 80 },
                    { name: 'Pharmacovigilance', level: 82 }
                ]
            },
            projects: [
                {
                    name: 'Protocol Quản lý Thuốc High-Alert IV',
                    description: 'Xây dựng và triển khai protocol quản lý 22 loại thuốc high-alert tiêm truyền tại BV Ung Bướu TP.HCM. Kết quả: giảm 42% adverse drug reactions, được Bộ Y tế công nhận best practice toàn quốc.',
                    techStack: ['Clinical Guidelines', 'Risk Management', 'Training'],
                    url: ''
                }
            ],
            contact: {
                email: 'thuphuong.pharmacist@gmail.com',
                phone: '0903 456 789',
                linkedIn: 'linkedin.com/in/thuphuong-pharmacist'
            }
        }
    },

    // ── 17. GIẢNG VIÊN ĐẠI HỌC ───────────────────────────────────────────────
    {
        templateId: 'premium_academic_08',
        themeConfig: {
            primaryColor: '#5b21b6',
            secondaryColor: '#faf5ff',
            fontFamily: 'Merriweather',
            layoutMode: 'minimal-1-col',
            textColor: '#3b0764',
            bodyTextColor: '#3b0764'
        },
        columnLayout: {
            left: ['about', 'experience'],
            right: ['education', 'skills', 'projects']
        },
        cvData: {
            personal: {
                fullName: 'PGS.TS. Lê Văn Hùng',
                jobTitle: 'Giảng viên Cao cấp – Khoa Công nghệ Thông tin',
                email: 'levanhung.cs@hust.edu.vn',
                phoneNumber: '0243 869 1234',
                address: 'Quận Hai Bà Trưng, Hà Nội',
                avatarUrl: 'https://ui-avatars.com/api/?name=Le+Van+Hung&background=5b21b6&color=ffffff&size=150&bold=true',
                linkedIn: 'linkedin.com/in/levanhung-prof',
                website: 'scholar.google.com/levanhung'
            },
            about: 'Phó Giáo sư Tiến sĩ Khoa học Máy tính, 15 năm giảng dạy và nghiên cứu tại Trường Đại học Bách khoa Hà Nội. Hướng nghiên cứu chính: Machine Learning, Computer Vision và AI ứng dụng y tế. Tác giả 45 bài báo quốc tế (ISI/Scopus), H-index 18, hướng dẫn 8 nghiên cứu sinh Tiến sĩ.',
            experience: [
                {
                    company: 'Đại học Bách khoa Hà Nội',
                    position: 'Phó Giáo sư – Khoa CNTT',
                    startDate: '2015-01',
                    endDate: null,
                    isCurrent: true,
                    location: 'Hà Nội',
                    description: 'Giảng dạy các môn Machine Learning, Deep Learning và Computer Vision cho 400+ sinh viên/năm. Chủ nhiệm đề tài nghiên cứu cấp Nhà nước "AI chẩn đoán ung thư phổi qua ảnh CT" giai đoạn 2020-2024 (ngân sách 8 tỷ đồng). Hướng dẫn 8 NCS, 25 Thạc sĩ đến thời điểm hiện tại. Phó Trưởng Phòng Nghiên cứu Khoa học & Hợp tác Quốc tế.'
                },
                {
                    company: 'KAIST (Korea)',
                    position: 'Post-doctoral Researcher',
                    startDate: '2012-09',
                    endDate: '2014-12',
                    isCurrent: false,
                    location: 'Daejeon, Hàn Quốc',
                    description: 'Nghiên cứu sau Tiến sĩ về Object Detection và Instance Segmentation. Công bố 6 bài báo IEEE/CVPR. Hợp tác với Samsung Research về nhận dạng cử chỉ tay thời gian thực.'
                },
                {
                    company: 'Đại học Bách khoa Hà Nội',
                    position: 'Giảng viên',
                    startDate: '2008-09',
                    endDate: '2012-08',
                    isCurrent: false,
                    location: 'Hà Nội',
                    description: 'Giảng dạy Cơ sở Dữ liệu, Trí tuệ Nhân tạo và Xử lý Ảnh. Bảo vệ Luận án Tiến sĩ loại xuất sắc năm 2012.'
                }
            ],
            education: [
                {
                    school: 'Đại học Bách khoa Hà Nội',
                    degree: 'Tiến sĩ',
                    major: 'Khoa học Máy tính',
                    startDate: '2008-09',
                    endDate: '2012-06',
                    gpa: 'Xuất sắc'
                }
            ],
            skills: {
                displayStyle: 'tag',
                items: [
                    { name: 'Machine Learning / Deep Learning', level: 97 },
                    { name: 'Computer Vision (CV)', level: 95 },
                    { name: 'Python / PyTorch / TensorFlow', level: 93 },
                    { name: 'Scientific Research & Writing', level: 95 },
                    { name: 'Grant Writing (Đề tài NAFOSTED)', level: 88 },
                    { name: 'Hướng dẫn NCS / Thạc sĩ', level: 92 },
                    { name: 'Tiếng Anh (Học thuật – IELTS 8.5)', level: 90 },
                    { name: 'Tiếng Hàn (B2)', level: 65 }
                ]
            },
            projects: [
                {
                    name: 'AI Chẩn đoán Ung thư Phổi – Đề tài Cấp Nhà nước',
                    description: 'Phát triển mô hình deep learning phát hiện khối u phổi trên CT scan với accuracy 94.8%, vượt performance bác sĩ chuyên khoa 7.2%. Đang triển khai thử nghiệm tại 5 bệnh viện tuyến tỉnh.',
                    techStack: ['PyTorch', 'MONAI', 'Docker', 'DICOM'],
                    url: 'scholar.google.com/levanhung'
                }
            ],
            contact: {
                email: 'levanhung.cs@hust.edu.vn',
                phone: '0243 869 1234',
                website: 'scholar.google.com/levanhung',
                linkedIn: 'linkedin.com/in/levanhung-prof'
            }
        }
    },

    // ── 18. KỸ SƯ XÂY DỰNG / KIẾN TRÚC SƯ ───────────────────────────────────
    {
        templateId: 'premium_startup_09',
        themeConfig: {
            primaryColor: '#6d28d9',
            secondaryColor: '#1e1b4b',
            fontFamily: 'Montserrat',
            layoutMode: 'top-header',
            textColor: '#ede9fe',
            bodyTextColor: '#1e1b4b'
        },
        columnLayout: {
            left: ['skills', 'education'],
            right: ['about', 'experience', 'projects']
        },
        cvData: {
            personal: {
                fullName: 'Võ Thanh Hải',
                jobTitle: 'Kỹ sư Kết cấu – Trưởng Dự án Xây dựng',
                email: 'thanhhai.structural@gmail.com',
                phoneNumber: '0907 654 321',
                address: 'Quận 7, TP. Hồ Chí Minh',
                avatarUrl: 'https://ui-avatars.com/api/?name=Vo+Thanh+Hai&background=6d28d9&color=ffffff&size=150&bold=true',
                linkedIn: 'linkedin.com/in/thanhhai-structural'
            },
            about: 'Kỹ sư Kết cấu 10 năm kinh nghiệm thiết kế và giám sát thi công các công trình dân dụng, công nghiệp và hạ tầng quy mô lớn. Thành thạo phân tích kết cấu bằng ETABS, SAFE và phần mềm BIM Revit. Đã chủ trì thiết kế kết cấu cho 15 dự án nhà cao tầng (20-45 tầng) tổng diện tích sàn 350,000m².',
            experience: [
                {
                    company: 'Coteccons Construction',
                    position: 'Structural Engineer – Project Manager',
                    startDate: '2019-06',
                    endDate: null,
                    isCurrent: true,
                    location: 'TP. Hồ Chí Minh',
                    description: 'Quản lý tổng thể dự án khu phức hợp The Sun Avenue (20ha, 8 block 35 tầng, tổng đầu tư 8,500 tỷ). Điều phối 15 nhà thầu phụ, 800 công nhân. Hoàn thành đúng tiến độ, tiết kiệm 120 tỷ chi phí vật liệu nhờ value engineering kết cấu sàn. Áp dụng BIM Revit LOD 350 toàn dự án, giảm 28% xung đột thiết kế.'
                },
                {
                    company: 'Hòa Bình Construction',
                    position: 'Senior Structural Design Engineer',
                    startDate: '2016-01',
                    endDate: '2019-05',
                    isCurrent: false,
                    location: 'TP. Hồ Chí Minh',
                    description: 'Thiết kế kết cấu 8 dự án nhà ở cao tầng và khu công nghiệp. Chuyên sâu về hệ sàn phẳng không dầm (flat slab), móng cọc nhồi và tường vây. Thẩm tra hồ sơ thiết kế cho 5 công trình cấp tỉnh.'
                },
                {
                    company: 'VNCC (Vietnam Consultants for Construction)',
                    position: 'Structural Engineer',
                    startDate: '2013-07',
                    endDate: '2015-12',
                    isCurrent: false,
                    location: 'TP. Hồ Chí Minh',
                    description: 'Tính toán và vẽ bản vẽ kết cấu cho công trình dân dụng và cầu đường. Phân tích động đất theo TCVN 9386 và tiêu chuẩn Eurocode 8.'
                }
            ],
            education: [
                {
                    school: 'Đại học Xây dựng Hà Nội',
                    degree: 'Kỹ sư',
                    major: 'Kỹ thuật Xây dựng – Kết cấu',
                    startDate: '2008-09',
                    endDate: '2013-06',
                    gpa: '8.2 / 10'
                }
            ],
            skills: {
                displayStyle: 'progressbar',
                items: [
                    { name: 'ETABS / SAP2000 (Kết cấu)', level: 95 },
                    { name: 'SAFE / Revit (BIM)', level: 88 },
                    { name: 'AutoCAD / Tekla Structures', level: 92 },
                    { name: 'Quản lý Dự án (MS Project)', level: 85 },
                    { name: 'TCVN / Eurocode / ACI', level: 90 },
                    { name: 'Value Engineering', level: 82 },
                    { name: 'Tiếng Anh Kỹ thuật', level: 80 },
                    { name: 'Phần mềm Dự toán (G8)', level: 75 }
                ]
            },
            projects: [
                {
                    name: 'The Sun Avenue – 8 Block 35 Tầng',
                    description: 'PM và Structural Lead cho khu phức hợp 8,500 tỷ VNĐ. Áp dụng BIM LOD 350, value engineering tiết kiệm 120 tỷ. Hoàn thành đúng tiến độ 36 tháng.',
                    techStack: ['Revit', 'ETABS', 'Navisworks', 'MS Project'],
                    url: ''
                }
            ],
            contact: {
                email: 'thanhhai.structural@gmail.com',
                phone: '0907 654 321',
                linkedIn: 'linkedin.com/in/thanhhai-structural'
            }
        }
    },

    // ── 19. CHUYÊN VIÊN NGÂN HÀNG ────────────────────────────────────────────
    {
        templateId: 'premium_luxury_02',
        themeConfig: {
            primaryColor: '#0369a1',
            secondaryColor: '#1e3a5f',
            fontFamily: 'Playfair Display',
            layoutMode: 'sidebar-right',
            textColor: '#e0f2fe',
            bodyTextColor: '#0c4a6e'
        },
        columnLayout: {
            left: ['about', 'experience', 'projects'],
            right: ['personal', 'contact', 'skills', 'education']
        },
        cvData: {
            personal: {
                fullName: 'Đinh Thị Thanh Hà',
                jobTitle: 'Chuyên viên Cao cấp – Tín dụng Doanh nghiệp',
                email: 'thanhha.banker@gmail.com',
                phoneNumber: '0927 112 334',
                address: 'Quận Hoàng Mai, Hà Nội',
                avatarUrl: 'https://ui-avatars.com/api/?name=Dinh+Thanh+Ha&background=0369a1&color=ffffff&size=150&bold=true',
                linkedIn: 'linkedin.com/in/thanhha-banker'
            },
            about: 'Chuyên viên Tín dụng Doanh nghiệp 8 năm kinh nghiệm tại ngân hàng top 3 Việt Nam. Thành thạo thẩm định tín dụng doanh nghiệp SME và Large Corporate, phân tích rủi ro tài chính và cơ cấu sản phẩm tín dụng phức hợp. Dư nợ tín dụng quản lý đạt 850 tỷ đồng với tỷ lệ nợ xấu 0.3%.',
            experience: [
                {
                    company: 'Vietcombank – Chi nhánh Hà Nội',
                    position: 'Chuyên viên Cao cấp – Khách hàng Doanh nghiệp',
                    startDate: '2019-01',
                    endDate: null,
                    isCurrent: true,
                    location: 'Hà Nội',
                    description: 'Quản lý danh mục 45 khách hàng doanh nghiệp với tổng dư nợ 850 tỷ đồng. Thẩm định và phê duyệt 80 hồ sơ tín dụng/năm tổng giá trị 600 tỷ. Tỷ lệ nợ xấu duy trì 0.3% (thấp hơn trung bình chi nhánh 1.2%). Phát triển 12 khách hàng mới FDI và tập đoàn lớn với doanh thu dịch vụ tăng 65%.'
                },
                {
                    company: 'Techcombank',
                    position: 'Chuyên viên Tín dụng',
                    startDate: '2015-06',
                    endDate: '2018-12',
                    isCurrent: false,
                    location: 'Hà Nội',
                    description: 'Thẩm định tín dụng SME doanh thu 50-500 tỷ/năm. Xây dựng mô hình đánh giá tín nhiệm nội bộ giảm thời gian thẩm định từ 10 ngày xuống 4 ngày. Đạt Top Performer Q3/2017 và Q1/2018.'
                },
                {
                    company: 'BIDV – Chi nhánh Hoàng Mai',
                    position: 'Chuyên viên Quan hệ Khách hàng',
                    startDate: '2013-08',
                    endDate: '2015-05',
                    isCurrent: false,
                    location: 'Hà Nội',
                    description: 'Tiếp nhận và xử lý hồ sơ tín dụng cá nhân và SME. Tư vấn sản phẩm vay mua nhà, vay sản xuất kinh doanh cho 200+ khách hàng/năm.'
                }
            ],
            education: [
                {
                    school: 'Học viện Ngân hàng',
                    degree: 'Cử nhân',
                    major: 'Tài chính – Ngân hàng',
                    startDate: '2009-09',
                    endDate: '2013-06',
                    gpa: '3.65 / 4.0'
                }
            ],
            skills: {
                displayStyle: 'progressbar',
                items: [
                    { name: 'Thẩm định Tín dụng Doanh nghiệp', level: 95 },
                    { name: 'Phân tích Báo cáo Tài chính', level: 93 },
                    { name: 'Quản lý Rủi ro Tín dụng', level: 90 },
                    { name: 'Cơ cấu Sản phẩm Tài trợ TM', level: 85 },
                    { name: 'Excel / Power BI (Phân tích)', level: 82 },
                    { name: 'CIC / Hệ thống Ngân hàng Core', level: 88 },
                    { name: 'Tiếng Anh Tài chính (IELTS 6.5)', level: 80 },
                    { name: 'Đàm phán & Quan hệ Khách hàng', level: 90 }
                ]
            },
            projects: [
                {
                    name: 'Cơ cấu Gói Tài trợ Chuỗi Cung ứng 200 Tỷ',
                    description: 'Thiết kế gói Supply Chain Finance cho tập đoàn sản xuất lớn với 80 nhà cung cấp. Tối ưu dòng tiền cho cả buyer và supplier, phí dịch vụ thu về 2.4 tỷ/năm.',
                    techStack: ['Financial Analysis', 'Deal Structuring', 'Risk Assessment'],
                    url: ''
                }
            ],
            contact: {
                email: 'thanhha.banker@gmail.com',
                phone: '0927 112 334',
                linkedIn: 'linkedin.com/in/thanhha-banker'
            }
        }
    },

    // ── 20. ENTREPRENEUR / STARTUP FOUNDER ───────────────────────────────────
    {
        templateId: 'premium_startup_09',
        themeConfig: {
            primaryColor: '#dc2626',
            secondaryColor: '#7f1d1d',
            fontFamily: 'Montserrat',
            layoutMode: 'top-header',
            textColor: '#fee2e2',
            bodyTextColor: '#1c1917'
        },
        columnLayout: {
            left: ['skills', 'education'],
            right: ['about', 'experience', 'projects']
        },
        cvData: {
            personal: {
                fullName: 'Nguyễn Minh Khôi',
                jobTitle: 'Co-founder & CEO – AgriTech Startup',
                email: 'minhkhoi.ceo@farmsmart.vn',
                phoneNumber: '0905 000 111',
                address: 'Quận 2, TP. Hồ Chí Minh',
                avatarUrl: 'https://ui-avatars.com/api/?name=Nguyen+Minh+Khoi&background=dc2626&color=ffffff&size=150&bold=true',
                linkedIn: 'linkedin.com/in/minhkhoi-ceo',
                website: 'farmsmart.vn'
            },
            about: 'Serial Entrepreneur với 2 startup thành công trong lĩnh vực AgriTech và EdTech. Co-founder & CEO của FarmSmart – nền tảng kết nối nông dân với thị trường sử dụng AI định giá và IoT giám sát mùa vụ. Đã gọi vốn thành công 3.5 triệu USD (Series A), phục vụ 45,000 hộ nông dân tại 12 tỉnh ĐBSCL.',
            experience: [
                {
                    company: 'FarmSmart Vietnam',
                    position: 'Co-founder & CEO',
                    startDate: '2020-03',
                    endDate: null,
                    isCurrent: true,
                    location: 'TP. Hồ Chí Minh',
                    description: 'Xây dựng FarmSmart từ ý tưởng đến sản phẩm thương mại hóa: nền tảng B2B2C kết nối 45,000 nông dân ĐBSCL với 200 doanh nghiệp thu mua. Gọi vốn thành công 3.5 triệu USD Series A từ Monk\'s Hill Ventures và Do Ventures. Xây dựng team 65 người từ 0, triển khai IoT sensor cho 8,000 hecta nông nghiệp, AI dự báo giá tăng độ chính xác 87%.'
                },
                {
                    company: 'EduQuest Vietnam',
                    position: 'Co-founder & CPO',
                    startDate: '2016-06',
                    endDate: '2020-02',
                    isCurrent: false,
                    location: 'TP. Hồ Chí Minh',
                    description: 'Đồng sáng lập nền tảng gamified learning K-12 đạt 500,000 người dùng tại Việt Nam và Philippines. Được Temasek Foundation tài trợ 800,000 USD. Exit thành công cho tập đoàn giáo dục Singapore năm 2020.'
                },
                {
                    company: 'McKinsey & Company',
                    position: 'Business Analyst',
                    startDate: '2014-07',
                    endDate: '2016-05',
                    isCurrent: false,
                    location: 'TP. Hồ Chí Minh',
                    description: 'Tư vấn chiến lược cho 6 dự án trong lĩnh vực tài chính và hàng tiêu dùng tại Đông Nam Á. Phân tích thị trường, xây dựng business case và hỗ trợ triển khai recommendation cho CEO/CFO.'
                }
            ],
            education: [
                {
                    school: 'INSEAD (Singapore)',
                    degree: 'MBA',
                    major: 'Entrepreneurship & Innovation',
                    startDate: '2012-09',
                    endDate: '2014-06',
                    gpa: 'Dean\'s List'
                }
            ],
            skills: {
                displayStyle: 'tag',
                items: [
                    { name: 'Startup Strategy & Vision', level: 97 },
                    { name: 'Venture Fundraising (VC/Angel)', level: 92 },
                    { name: 'Product Management', level: 88 },
                    { name: 'Team Building & Leadership', level: 93 },
                    { name: 'Business Development & Partnerships', level: 90 },
                    { name: 'Financial Modelling / Investor Deck', level: 85 },
                    { name: 'Agile / OKR', level: 88 },
                    { name: 'Tiếng Anh (Native-level)', level: 97 }
                ]
            },
            projects: [
                {
                    name: 'FarmSmart Series A – 3.5 triệu USD',
                    description: 'Chuẩn bị và trình bày investor deck cho 40 VC quốc tế. Đàm phán term sheet và close round trong 6 tháng với lead investor Monk\'s Hill Ventures. Định giá công ty đạt 18 triệu USD post-money.',
                    techStack: ['Pitch Deck', 'Financial Model', 'Due Diligence'],
                    url: 'farmsmart.vn'
                }
            ],
            contact: {
                email: 'minhkhoi.ceo@farmsmart.vn',
                phone: '0905 000 111',
                website: 'farmsmart.vn',
                linkedIn: 'linkedin.com/in/minhkhoi-ceo'
            }
        }
    }
,
    // ── 21. DATA SCIENTIST / ML ENGINEER ───────────────────────────
    {
        "templateId": "modern_it_01",
        "themeConfig": {
            "primaryColor": "#7c3aed",
            "secondaryColor": "#1e1b4b",
            "fontFamily": "Inter",
            "layoutMode": "sidebar-left",
            "textColor": "#ede9fe",
            "bodyTextColor": "#1e293b"
        },
        "columnLayout": {
            "left": [
                "profile",
                "contact",
                "skills",
                "education"
            ],
            "right": [
                "about",
                "experience",
                "projects",
                "customSections"
            ]
        },
        "cvData": {
            "personal": {
                "fullName": "Phạm Đức Anh",
                "title": "Senior Data Scientist / ML Engineer",
                "jobTitle": "Senior Data Scientist / ML Engineer",
                "email": "ducanh.ds@fpt.com.vn",
                "phoneNumber": "0908 221 334",
                "address": "Quận Cầu Giấy, Hà Nội",
                "avatarUrl": "https://ui-avatars.com/api/?name=Pham+Duc+Anh&background=7c3aed&color=ffffff&size=150&bold=true",
                "linkedIn": "linkedin.com/in/ducanh-ds",
                "github": "github.com/ducanh-ml"
            },
            "about": "Data Scientist 6 năm kinh nghiệm xây dựng mô hình ML cho Fintech và E-commerce tại Việt Nam. Thành thạo Python, Spark, TensorFlow và MLOps trên AWS. Đã triển khai hệ thống gợi ý sản phẩm tăng GMV 22% và mô hình phát hiện gian lận giảm thiệt hại 35 triệu USD/năm.",
            "experience": [
                {
                    "company": "FPT Software",
                    "position": "Senior Data Scientist",
                    "startDate": "2021-03",
                    "endDate": null,
                    "isCurrent": true,
                    "location": "Hà Nội",
                    "description": "Xây dựng recommendation engine phục vụ 3 triệu user/tháng, tăng CTR 18%. Triển khai pipeline MLOps với MLflow và SageMaker, rút ngắn thời gian deploy model từ 2 tuần xuống 2 ngày."
                },
                {
                    "company": "VNG Corporation",
                    "position": "Data Scientist",
                    "startDate": "2018-07",
                    "endDate": "2021-02",
                    "isCurrent": false,
                    "location": "TP. Hồ Chí Minh",
                    "description": "Phát triển mô hình churn prediction cho ZaloPay với AUC 0.91. Xử lý 500GB dữ liệu giao dịch/ngày bằng Spark trên Hadoop cluster."
                },
                {
                    "company": "Tiki Corporation",
                    "position": "Junior Data Analyst",
                    "startDate": "2016-06",
                    "endDate": "2018-06",
                    "isCurrent": false,
                    "location": "TP. Hồ Chí Minh",
                    "description": "Phân tích hành vi mua sắm, xây dựng dashboard Tableau phục vụ 15 team product. Tối ưu chiến dịch retargeting tăng conversion 12%."
                }
            ],
            "education": [
                {
                    "school": "Đại học Bách khoa Hà Nội",
                    "degree": "Thạc sĩ",
                    "major": "Khoa học Dữ liệu & AI",
                    "startDate": "2014-09",
                    "endDate": "2016-06",
                    "gpa": "3.8 / 4.0"
                }
            ],
            "skills": {
                "displayStyle": "progressbar",
                "items": [
                    {
                        "name": "Python / Pandas / NumPy",
                        "level": 96
                    },
                    {
                        "name": "TensorFlow / PyTorch",
                        "level": 90
                    },
                    {
                        "name": "Apache Spark / Airflow",
                        "level": 85
                    },
                    {
                        "name": "SQL / PostgreSQL / BigQuery",
                        "level": 92
                    },
                    {
                        "name": "MLOps / MLflow / Docker",
                        "level": 82
                    },
                    {
                        "name": "Scikit-learn / XGBoost",
                        "level": 94
                    },
                    {
                        "name": "AWS SageMaker",
                        "level": 78
                    },
                    {
                        "name": "Tiếng Anh (IELTS 7.5)",
                        "level": 88
                    }
                ]
            },
            "projects": [
                {
                    "name": "Fraud Detection Engine",
                    "description": "Xây dựng mô hình phát hiện gian lận real-time với latency < 50ms, xử lý 2 triệu giao dịch/ngày. Giảm false positive 40% so với rule-based cũ.",
                    "techStack": [
                        "Python",
                        "XGBoost",
                        "Kafka",
                        "Redis"
                    ],
                    "url": ""
                }
            ],
            "customSections": [
                {
                    "id": "cs-021",
                    "title": "Chứng chỉ & Publication",
                    "icon": "award",
                    "items": [
                        {
                            "id": "ci-021a",
                            "name": "AWS Certified Machine Learning – Specialty",
                            "subtitle": "Amazon Web Services",
                            "startDate": "2023-05",
                            "endDate": "2023-05",
                            "description": "Professional certification"
                        },
                        {
                            "id": "ci-021b",
                            "name": "Paper: Real-time Fraud Detection at Scale",
                            "subtitle": "Vietnam AI Summit 2023",
                            "startDate": "2023-11",
                            "endDate": "2023-11",
                            "description": "Speaker & author"
                        }
                    ]
                }
            ],
            "contact": {
                "email": "ducanh.ds@fpt.com.vn",
                "phone": "0908 221 334",
                "linkedIn": "linkedin.com/in/ducanh-ds",
                "github": "github.com/ducanh-ml"
            }
        }
    },
    // ── 22. BACKEND DEVELOPER (JAVA/NODE) ──────────────────────────
    {
        "templateId": "minimal_it_02",
        "themeConfig": {
            "primaryColor": "#059669",
            "secondaryColor": "#064e3b",
            "fontFamily": "Fira Code",
            "layoutMode": "sidebar-left",
            "textColor": "#d1fae5",
            "bodyTextColor": "#1e293b"
        },
        "columnLayout": {
            "left": [
                "profile",
                "contact",
                "skills",
                "education"
            ],
            "right": [
                "about",
                "experience",
                "projects",
                "customSections"
            ]
        },
        "cvData": {
            "personal": {
                "fullName": "Hoàng Minh Tuấn",
                "title": "Senior Backend Developer (Java/Node.js)",
                "jobTitle": "Senior Backend Developer (Java/Node.js)",
                "email": "tuann.backend@gmail.com",
                "phoneNumber": "0912 778 990",
                "address": "Quận 7, TP. Hồ Chí Minh",
                "avatarUrl": "https://ui-avatars.com/api/?name=Hoang+Minh+Tuan&background=059669&color=ffffff&size=150&bold=true",
                "linkedIn": "linkedin.com/in/tuan-backend",
                "github": "github.com/tuan-backend"
            },
            "about": "Backend Engineer 7 năm kinh nghiệm thiết kế hệ thống phân tán high-throughput cho Fintech và Logistics. Chuyên sâu Java Spring Boot, Node.js, Kafka và PostgreSQL. Đã thiết kế API gateway phục vụ 50,000 RPS với uptime 99.99%.",
            "experience": [
                {
                    "company": "MoMo (M_Service)",
                    "position": "Senior Backend Engineer",
                    "startDate": "2020-08",
                    "endDate": null,
                    "isCurrent": true,
                    "location": "TP. Hồ Chí Minh",
                    "description": "Thiết kế microservices payment core xử lý 15 triệu giao dịch/ngày. Tối ưu latency P99 từ 800ms xuống 120ms. Migration monolith sang 24 microservices với zero-downtime."
                },
                {
                    "company": "Grab Vietnam",
                    "position": "Backend Developer",
                    "startDate": "2017-05",
                    "endDate": "2020-07",
                    "isCurrent": false,
                    "location": "TP. Hồ Chí Minh",
                    "description": "Phát triển dispatch engine và pricing service bằng Java. Tích hợp Kafka event streaming cho 8 triệu ride/tháng."
                },
                {
                    "company": "NashTech",
                    "position": "Java Developer",
                    "startDate": "2015-01",
                    "endDate": "2017-04",
                    "isCurrent": false,
                    "location": "TP. Hồ Chí Minh",
                    "description": "Outsource banking project cho client Singapore. Xây dựng REST API và batch processing với Spring Batch."
                }
            ],
            "education": [
                {
                    "school": "Đại học Khoa học Tự nhiên TP. HCM",
                    "degree": "Cử nhân",
                    "major": "Công nghệ Thông tin",
                    "startDate": "2011-09",
                    "endDate": "2015-06",
                    "gpa": "3.6 / 4.0"
                }
            ],
            "skills": {
                "displayStyle": "tag",
                "items": [
                    {
                        "name": "Java / Spring Boot",
                        "level": 95
                    },
                    {
                        "name": "Node.js / NestJS",
                        "level": 88
                    },
                    {
                        "name": "PostgreSQL / Redis",
                        "level": 92
                    },
                    {
                        "name": "Kafka / RabbitMQ",
                        "level": 85
                    },
                    {
                        "name": "Docker / Kubernetes",
                        "level": 80
                    },
                    {
                        "name": "Microservices / DDD",
                        "level": 90
                    },
                    {
                        "name": "AWS / GCP",
                        "level": 78
                    },
                    {
                        "name": "System Design",
                        "level": 92
                    }
                ]
            },
            "projects": [
                {
                    "name": "MoMo Payment Core v2",
                    "description": "Thiết kế lại payment gateway hỗ trợ 50,000 TPS peak, circuit breaker pattern và distributed tracing với Jaeger.",
                    "techStack": [
                        "Java",
                        "Spring Boot",
                        "Kafka",
                        "PostgreSQL"
                    ],
                    "url": ""
                }
            ],
            "customSections": [
                {
                    "id": "cs-022",
                    "title": "Chứng chỉ",
                    "icon": "award",
                    "items": [
                        {
                            "id": "ci-022a",
                            "name": "Oracle Certified Professional: Java SE",
                            "subtitle": "Oracle",
                            "startDate": "2019-03",
                            "endDate": "2019-03",
                            "description": ""
                        },
                        {
                            "id": "ci-022b",
                            "name": "AWS Solutions Architect Associate",
                            "subtitle": "Amazon Web Services",
                            "startDate": "2022-01",
                            "endDate": "2022-01",
                            "description": ""
                        }
                    ]
                }
            ],
            "contact": {
                "email": "tuann.backend@gmail.com",
                "phone": "0912 778 990",
                "linkedIn": "linkedin.com/in/tuan-backend",
                "github": "github.com/tuan-backend"
            }
        }
    },
    // ── 23. QA / AUTOMATION TEST ENGINEER ──────────────────────────
    {
        "templateId": "premium_tech_04",
        "themeConfig": {
            "primaryColor": "#10b981",
            "secondaryColor": "#060606",
            "fontFamily": "Fira Code",
            "layoutMode": "sidebar-left",
            "textColor": "#d1fae5",
            "bodyTextColor": "#1e293b"
        },
        "columnLayout": {
            "left": [
                "profile",
                "contact",
                "skills",
                "education"
            ],
            "right": [
                "about",
                "experience",
                "projects"
            ]
        },
        "cvData": {
            "personal": {
                "fullName": "Lê Thị Hồng Nhung",
                "title": "QA Lead / Automation Test Engineer",
                "jobTitle": "QA Lead / Automation Test Engineer",
                "email": "nhung.qa@gmail.com",
                "phoneNumber": "0934 556 778",
                "address": "Quận Thủ Đức, TP. Hồ Chí Minh",
                "avatarUrl": "https://ui-avatars.com/api/?name=Le+Thi+Hong+Nhung&background=10b981&color=ffffff&size=150&bold=true",
                "linkedIn": "linkedin.com/in/nhung-qa"
            },
            "about": "QA Lead 5 năm kinh nghiệm xây dựng chiến lược kiểm thử tự động cho web và mobile app. Thành thạo Selenium, Cypress, Appium và CI/CD integration. Giảm bug production 65% và rút ngắn regression cycle từ 5 ngày xuống 4 giờ.",
            "experience": [
                {
                    "company": "Shopee Vietnam",
                    "position": "QA Lead",
                    "startDate": "2021-01",
                    "endDate": null,
                    "isCurrent": true,
                    "location": "TP. Hồ Chí Minh",
                    "description": "Xây dựng automation framework phục vụ 8 squad product. Coverage tăng từ 35% lên 82%. Tích hợp test pipeline vào Jenkins, chạy 2,000+ test cases mỗi deploy."
                },
                {
                    "company": "KMS Technology",
                    "position": "Senior QA Engineer",
                    "startDate": "2018-06",
                    "endDate": "2020-12",
                    "isCurrent": false,
                    "location": "TP. Hồ Chí Minh",
                    "description": "Automation testing cho client US (healthcare SaaS). Selenium + TestNG, API testing với Postman/Newman."
                },
                {
                    "company": "TMA Solutions",
                    "position": "Manual QA / Automation",
                    "startDate": "2016-03",
                    "endDate": "2018-05",
                    "isCurrent": false,
                    "location": "TP. Hồ Chí Minh",
                    "description": "Kiểm thử ERP system, viết test plan và test case. Bắt đầu chuyển sang automation với Selenium WebDriver."
                }
            ],
            "education": [
                {
                    "school": "Đại học Công nghệ TP. HCM (HUTECH)",
                    "degree": "Cử nhân",
                    "major": "Công nghệ Thông tin",
                    "startDate": "2012-09",
                    "endDate": "2016-06",
                    "gpa": "3.3 / 4.0"
                }
            ],
            "skills": {
                "displayStyle": "progressbar",
                "items": [
                    {
                        "name": "Selenium / Cypress",
                        "level": 92
                    },
                    {
                        "name": "Appium (Mobile)",
                        "level": 85
                    },
                    {
                        "name": "API Testing (Postman)",
                        "level": 90
                    },
                    {
                        "name": "Performance (JMeter)",
                        "level": 78
                    },
                    {
                        "name": "CI/CD (Jenkins / GitLab)",
                        "level": 82
                    },
                    {
                        "name": "Java / Python (Test Script)",
                        "level": 80
                    },
                    {
                        "name": "Agile / Scrum",
                        "level": 88
                    },
                    {
                        "name": "Test Strategy & Planning",
                        "level": 90
                    }
                ]
            },
            "projects": [
                {
                    "name": "Shopee E2E Automation Platform",
                    "description": "Framework Cypress + Appium cross-platform, parallel execution trên 20 device farm. Giảm manual regression effort 70%.",
                    "techStack": [
                        "Cypress",
                        "Appium",
                        "Jenkins",
                        "BrowserStack"
                    ],
                    "url": ""
                }
            ],
            "contact": {
                "email": "nhung.qa@gmail.com",
                "phone": "0934 556 778",
                "linkedIn": "linkedin.com/in/nhung-qa"
            }
        }
    },
    // ── 24. CYBERSECURITY SPECIALIST ───────────────────────────────
    {
        "templateId": "premium_compact_07",
        "themeConfig": {
            "primaryColor": "#ef4444",
            "secondaryColor": "#1e1b4b",
            "fontFamily": "Inter",
            "layoutMode": "sidebar-left",
            "textColor": "#fecaca",
            "bodyTextColor": "#1e293b"
        },
        "columnLayout": {
            "left": [
                "profile",
                "contact",
                "skills",
                "education"
            ],
            "right": [
                "about",
                "experience",
                "projects",
                "customSections"
            ]
        },
        "cvData": {
            "personal": {
                "fullName": "Nguyễn Văn Hùng",
                "title": "Cybersecurity Specialist / SOC Analyst",
                "jobTitle": "Cybersecurity Specialist / SOC Analyst",
                "email": "hung.security@viettel.vn",
                "phoneNumber": "0918 334 556",
                "address": "Quận Hai Bà Trưng, Hà Nội",
                "avatarUrl": "https://ui-avatars.com/api/?name=Nguyen+Van+Hung&background=ef4444&color=ffffff&size=150&bold=true",
                "linkedIn": "linkedin.com/in/hung-cybersec"
            },
            "about": "Chuyên gia An ninh mạng 5 năm kinh nghiệm tại SOC của Viettel và ngân hàng. Thành thạo penetration testing, SIEM (Splunk), incident response và compliance ISO 27001. Phát hiện và xử lý 120+ sự cố bảo mật nghiêm trọng, giảm MTTR 45%.",
            "experience": [
                {
                    "company": "Viettel Cyber Security",
                    "position": "Senior Security Analyst",
                    "startDate": "2020-04",
                    "endDate": null,
                    "isCurrent": true,
                    "location": "Hà Nội",
                    "description": "Vận hành SOC 24/7 giám sát 500+ doanh nghiệp. Triển khai Splunk SIEM, phát hiện APT attack cho 3 tập đoàn lớn. Đào tạo 25 analyst mới."
                },
                {
                    "company": "Techcombank",
                    "position": "Information Security Engineer",
                    "startDate": "2017-08",
                    "endDate": "2020-03",
                    "isCurrent": false,
                    "location": "Hà Nội",
                    "description": "Penetration testing hệ thống core banking. Triển khai WAF và DLP. Đạt chứng nhận PCI-DSS cho payment gateway."
                },
                {
                    "company": "BKAV Corporation",
                    "position": "Security Researcher",
                    "startDate": "2015-06",
                    "endDate": "2017-07",
                    "isCurrent": false,
                    "location": "Hà Nội",
                    "description": "Phân tích malware, reverse engineering. Phát hiện 2 zero-day vulnerability trên phần mềm phổ biến tại VN."
                }
            ],
            "education": [
                {
                    "school": "Học viện Kỹ thuật Mật mã",
                    "degree": "Cử nhân",
                    "major": "An toàn Thông tin",
                    "startDate": "2011-09",
                    "endDate": "2015-06",
                    "gpa": "3.7 / 4.0"
                }
            ],
            "skills": {
                "displayStyle": "progressbar",
                "items": [
                    {
                        "name": "Penetration Testing",
                        "level": 90
                    },
                    {
                        "name": "Splunk / SIEM",
                        "level": 88
                    },
                    {
                        "name": "Incident Response",
                        "level": 92
                    },
                    {
                        "name": "Network Security",
                        "level": 85
                    },
                    {
                        "name": "ISO 27001 / PCI-DSS",
                        "level": 82
                    },
                    {
                        "name": "Python / Bash Scripting",
                        "level": 78
                    },
                    {
                        "name": "Firewall / WAF / IDS",
                        "level": 86
                    },
                    {
                        "name": "Cloud Security (AWS)",
                        "level": 75
                    }
                ]
            },
            "projects": [
                {
                    "name": "Viettel SOC Platform Upgrade",
                    "description": "Migration SIEM sang Splunk Enterprise, tích hợp 200+ log source. Giảm false alert 55%, tăng detection rate 30%.",
                    "techStack": [
                        "Splunk",
                        "Python",
                        "ELK Stack"
                    ],
                    "url": ""
                }
            ],
            "customSections": [
                {
                    "id": "cs-024",
                    "title": "Chứng chỉ Bảo mật",
                    "icon": "award",
                    "items": [
                        {
                            "id": "ci-024a",
                            "name": "CEH – Certified Ethical Hacker",
                            "subtitle": "EC-Council",
                            "startDate": "2019-06",
                            "endDate": "2019-06",
                            "description": ""
                        },
                        {
                            "id": "ci-024b",
                            "name": "CompTIA Security+",
                            "subtitle": "CompTIA",
                            "startDate": "2018-03",
                            "endDate": "2018-03",
                            "description": ""
                        },
                        {
                            "id": "ci-024c",
                            "name": "OSCP – Offensive Security",
                            "subtitle": "Offensive Security",
                            "startDate": "2021-09",
                            "endDate": "2021-09",
                            "description": "Practical exam passed"
                        }
                    ]
                }
            ],
            "contact": {
                "email": "hung.security@viettel.vn",
                "phone": "0918 334 556",
                "linkedIn": "linkedin.com/in/hung-cybersec"
            }
        }
    },
    // ── 25. GAME DEVELOPER (UNITY/UNREAL) ──────────────────────────
    {
        "templateId": "creative_marketing_01",
        "themeConfig": {
            "primaryColor": "#f97316",
            "secondaryColor": "#431407",
            "fontFamily": "Roboto",
            "layoutMode": "sidebar-left",
            "textColor": "#ffedd5",
            "bodyTextColor": "#1c1917"
        },
        "columnLayout": {
            "left": [
                "profile",
                "contact",
                "skills",
                "education"
            ],
            "right": [
                "about",
                "experience",
                "projects"
            ]
        },
        "cvData": {
            "personal": {
                "fullName": "Trần Gia Bảo",
                "title": "Senior Game Developer (Unity/C#)",
                "jobTitle": "Senior Game Developer (Unity/C#)",
                "email": "bao.gamedev@gmail.com",
                "phoneNumber": "0903 667 889",
                "address": "Quận 3, TP. Hồ Chí Minh",
                "avatarUrl": "https://ui-avatars.com/api/?name=Tran+Gia+Bao&background=f97316&color=ffffff&size=150&bold=true",
                "linkedIn": "linkedin.com/in/bao-gamedev",
                "github": "github.com/bao-gamedev",
                "portfolio": "bao-gamedev.itch.io"
            },
            "about": "Game Developer 6 năm kinh nghiệm phát triển mobile game F2P tại VNG và studio indie. Chuyên Unity/C#, gameplay programming và monetization optimization. 3 game đạt top 50 App Store VN, tổng 2 triệu downloads.",
            "experience": [
                {
                    "company": "VNG Games (ZingPlay)",
                    "position": "Senior Game Developer",
                    "startDate": "2020-02",
                    "endDate": null,
                    "isCurrent": true,
                    "location": "TP. Hồ Chí Minh",
                    "description": "Lead gameplay cho card game mobile 500K DAU. Tối ưu draw call giảm 40%, FPS ổn định 60 trên device tầm trung. Thiết kế live-ops event tăng D7 retention 15%."
                },
                {
                    "company": "Amanotes",
                    "position": "Unity Developer",
                    "startDate": "2017-09",
                    "endDate": "2020-01",
                    "isCurrent": false,
                    "location": "Hà Nội",
                    "description": "Phát triển rhythm game Magic Tiles series. Implement note generation algorithm và anti-cheat system."
                },
                {
                    "company": "Sparx* (Virtuos)",
                    "position": "Junior Game Programmer",
                    "startDate": "2015-07",
                    "endDate": "2017-08",
                    "isCurrent": false,
                    "location": "TP. Hồ Chí Minh",
                    "description": "Outsource AAA console game. C++ gameplay scripting và bug fixing cho client Nhật Bản."
                }
            ],
            "education": [
                {
                    "school": "Đại học RMIT Việt Nam",
                    "degree": "Cử nhân",
                    "major": "Digital Design",
                    "startDate": "2011-09",
                    "endDate": "2015-06",
                    "gpa": "3.2 / 4.0"
                }
            ],
            "skills": {
                "displayStyle": "tag",
                "items": [
                    {
                        "name": "Unity / C#",
                        "level": 95
                    },
                    {
                        "name": "Unreal Engine (Blueprint)",
                        "level": 70
                    },
                    {
                        "name": "Gameplay Programming",
                        "level": 92
                    },
                    {
                        "name": "Shader / VFX",
                        "level": 75
                    },
                    {
                        "name": "Mobile Optimization",
                        "level": 88
                    },
                    {
                        "name": "Git / Perforce",
                        "level": 85
                    },
                    {
                        "name": "Agile / Scrum",
                        "level": 80
                    },
                    {
                        "name": "Monetization / Analytics",
                        "level": 82
                    }
                ]
            },
            "projects": [
                {
                    "name": "ZingPlay Poker Tournament",
                    "description": "Realtime multiplayer poker với WebSocket, hỗ trợ 10,000 concurrent players. Anti-cheat và fair play algorithm.",
                    "techStack": [
                        "Unity",
                        "C#",
                        "Photon",
                        "Firebase"
                    ],
                    "url": "bao-gamedev.itch.io"
                }
            ],
            "contact": {
                "email": "bao.gamedev@gmail.com",
                "phone": "0903 667 889",
                "linkedIn": "linkedin.com/in/bao-gamedev",
                "github": "github.com/bao-gamedev",
                "portfolio": "bao-gamedev.itch.io"
            }
        }
    },
    // ── 26. DIGITAL MARKETING MANAGER ──────────────────────────────
    {
        "templateId": "premium_creative_05",
        "themeConfig": {
            "primaryColor": "#ec4899",
            "secondaryColor": "#4c1d95",
            "fontFamily": "Montserrat",
            "layoutMode": "top-header",
            "textColor": "#fce7f3",
            "bodyTextColor": "#1e293b"
        },
        "columnLayout": {
            "left": [
                "about",
                "skills"
            ],
            "right": [
                "experience",
                "education",
                "projects",
                "customSections"
            ]
        },
        "cvData": {
            "personal": {
                "fullName": "Võ Thị Mai Linh",
                "title": "Digital Marketing Manager",
                "jobTitle": "Digital Marketing Manager",
                "email": "mailinh.digital@gmail.com",
                "phoneNumber": "0909 112 445",
                "address": "Quận 1, TP. Hồ Chí Minh",
                "avatarUrl": "https://ui-avatars.com/api/?name=Vo+Thi+Mai+Linh&background=ec4899&color=ffffff&size=150&bold=true",
                "linkedIn": "linkedin.com/in/mailinh-digital"
            },
            "about": "Digital Marketing Manager 7 năm kinh nghiệm dẫn dắt chiến dịch performance marketing cho FMCG và E-commerce. Quản lý ngân sách quảng cáo 15 tỷ VNĐ/năm trên Google, Meta và TikTok. Tăng ROAS trung bình 320% và giảm CPA 28% cho 12 thương hiệu.",
            "experience": [
                {
                    "company": "Unilever Vietnam",
                    "position": "Digital Marketing Manager",
                    "startDate": "2020-01",
                    "endDate": null,
                    "isCurrent": true,
                    "location": "TP. Hồ Chí Minh",
                    "description": "Quản lý digital campaign cho 8 brand (Omo, Clear, Lifebuoy). Ngân sách 15 tỷ/năm, ROAS 4.2x. Triển khai marketing automation với HubSpot, tăng email open rate 35%."
                },
                {
                    "company": "GroupM (WPP)",
                    "position": "Senior Digital Planner",
                    "startDate": "2017-03",
                    "endDate": "2019-12",
                    "isCurrent": false,
                    "location": "TP. Hồ Chí Minh",
                    "description": "Lập kế hoạch media cho Vinamilk, Samsung. Programmatic buying qua DV360, đạt reach 8 triệu user/tháng."
                },
                {
                    "company": "Coccoc (Ads Platform)",
                    "position": "Performance Marketing Specialist",
                    "startDate": "2014-06",
                    "endDate": "2017-02",
                    "isCurrent": false,
                    "location": "Hà Nội",
                    "description": "Chạy quảng cáo search cho 50+ SME client. Tối ưu landing page A/B test, tăng conversion 22%."
                }
            ],
            "education": [
                {
                    "school": "Đại học Kinh tế TP. HCM (UEH)",
                    "degree": "Cử nhân",
                    "major": "Marketing",
                    "startDate": "2010-09",
                    "endDate": "2014-06",
                    "gpa": "3.5 / 4.0"
                }
            ],
            "skills": {
                "displayStyle": "progressbar",
                "items": [
                    {
                        "name": "Google Ads / GA4",
                        "level": 95
                    },
                    {
                        "name": "Meta Ads / TikTok Ads",
                        "level": 92
                    },
                    {
                        "name": "Marketing Automation",
                        "level": 85
                    },
                    {
                        "name": "SEO / Content Strategy",
                        "level": 80
                    },
                    {
                        "name": "HubSpot / Mailchimp",
                        "level": 82
                    },
                    {
                        "name": "Data Studio / Looker",
                        "level": 78
                    },
                    {
                        "name": "Budget Management",
                        "level": 90
                    },
                    {
                        "name": "Team Leadership (8 người)",
                        "level": 88
                    }
                ]
            },
            "projects": [
                {
                    "name": "Unilever Ramadan Campaign 2024",
                    "description": "Omni-channel campaign đạt 25 triệu impressions, engagement rate 8.5%, doanh số tăng 18% so với cùng kỳ.",
                    "techStack": [
                        "Google Ads",
                        "Meta",
                        "TikTok",
                        "HubSpot"
                    ],
                    "url": ""
                }
            ],
            "customSections": [
                {
                    "id": "cs-026",
                    "title": "Giải thưởng",
                    "icon": "star",
                    "items": [
                        {
                            "id": "ci-026a",
                            "name": "Google Ads Certified Professional",
                            "subtitle": "Google",
                            "startDate": "2022-04",
                            "endDate": "2022-04",
                            "description": ""
                        },
                        {
                            "id": "ci-026b",
                            "name": "Best Digital Campaign – MMA Vietnam 2023",
                            "subtitle": "Mobile Marketing Association",
                            "startDate": "2023-12",
                            "endDate": "2023-12",
                            "description": "Award winner"
                        }
                    ]
                }
            ],
            "contact": {
                "email": "mailinh.digital@gmail.com",
                "phone": "0909 112 445",
                "linkedIn": "linkedin.com/in/mailinh-digital"
            }
        }
    },
    // ── 27. SOCIAL MEDIA MANAGER ───────────────────────────────────
    {
        "templateId": "creative_marketing_01",
        "themeConfig": {
            "primaryColor": "#2563eb",
            "secondaryColor": "#1e3a8a",
            "fontFamily": "Roboto",
            "layoutMode": "sidebar-left",
            "textColor": "#dbeafe",
            "bodyTextColor": "#1e293b"
        },
        "columnLayout": {
            "left": [
                "profile",
                "contact",
                "skills",
                "education"
            ],
            "right": [
                "about",
                "experience",
                "projects"
            ]
        },
        "cvData": {
            "personal": {
                "fullName": "Đặng Hoàng Phúc",
                "title": "Social Media Manager",
                "jobTitle": "Social Media Manager",
                "email": "phuc.social@gmail.com",
                "phoneNumber": "0911 223 445",
                "address": "Quận Hoàn Kiếm, Hà Nội",
                "avatarUrl": "https://ui-avatars.com/api/?name=Dang+Hoang+Phuc&background=2563eb&color=ffffff&size=150&bold=true",
                "linkedIn": "linkedin.com/in/phuc-social"
            },
            "about": "Social Media Manager 4 năm kinh nghiệm xây dựng cộng đồng thương hiệu trên TikTok, Facebook và Instagram. Tăng trưởng follower 300% cho 6 brand FMCG và F&B. Viral content đạt 50 triệu views tổng cộng.",
            "experience": [
                {
                    "company": "Highland Coffee Vietnam",
                    "position": "Social Media Manager",
                    "startDate": "2021-05",
                    "endDate": null,
                    "isCurrent": true,
                    "location": "Hà Nội",
                    "description": "Quản lý 5 kênh social (500K followers). Content calendar 60 posts/tháng. TikTok campaign #HighlandMoment đạt 12M views, tăng foot traffic 15%."
                },
                {
                    "company": "Ogilvy Vietnam",
                    "position": "Social Media Executive",
                    "startDate": "2019-08",
                    "endDate": "2021-04",
                    "isCurrent": false,
                    "location": "TP. Hồ Chí Minh",
                    "description": "Community management cho P&G, Nestlé. Response time < 30 phút, sentiment score 85% positive."
                },
                {
                    "company": "Freelance",
                    "position": "Content Creator / SMM",
                    "startDate": "2018-01",
                    "endDate": "2019-07",
                    "isCurrent": false,
                    "location": "Hà Nội",
                    "description": "Quản lý social cho 10 SME local. Tăng engagement trung bình 45% trong 3 tháng."
                }
            ],
            "education": [
                {
                    "school": "Đại học Thương mại (TMU)",
                    "degree": "Cử nhân",
                    "major": "Quản trị Kinh doanh",
                    "startDate": "2014-09",
                    "endDate": "2018-06",
                    "gpa": "3.4 / 4.0"
                }
            ],
            "skills": {
                "displayStyle": "tag",
                "items": [
                    {
                        "name": "TikTok / Reels Content",
                        "level": 92
                    },
                    {
                        "name": "Facebook / Instagram Ads",
                        "level": 88
                    },
                    {
                        "name": "Community Management",
                        "level": 90
                    },
                    {
                        "name": "Canva / CapCut / Premiere",
                        "level": 85
                    },
                    {
                        "name": "Influencer Marketing",
                        "level": 82
                    },
                    {
                        "name": "Social Listening (Brand24)",
                        "level": 78
                    },
                    {
                        "name": "Copywriting tiếng Việt",
                        "level": 90
                    },
                    {
                        "name": "Analytics / Reporting",
                        "level": 80
                    }
                ]
            },
            "projects": [
                {
                    "name": "Highland TikTok Viral Series",
                    "description": "Series 20 video UGC-style, tổng 12M views, 800K engagement. Tăng brand awareness 25% theo survey.",
                    "techStack": [
                        "TikTok",
                        "CapCut",
                        "Canva"
                    ],
                    "url": ""
                }
            ],
            "contact": {
                "email": "phuc.social@gmail.com",
                "phone": "0911 223 445",
                "linkedIn": "linkedin.com/in/phuc-social"
            }
        }
    },
    // ── 28. BRAND MANAGER ──────────────────────────────────────────
    {
        "templateId": "premium_creative_05",
        "themeConfig": {
            "primaryColor": "#a855f7",
            "secondaryColor": "#3b0764",
            "fontFamily": "Montserrat",
            "layoutMode": "top-header",
            "textColor": "#f3e8ff",
            "bodyTextColor": "#1e293b"
        },
        "columnLayout": {
            "left": [
                "about",
                "skills"
            ],
            "right": [
                "experience",
                "education",
                "projects",
                "customSections"
            ]
        },
        "cvData": {
            "personal": {
                "fullName": "Nguyễn Thị Thu Hà",
                "title": "Brand Manager",
                "jobTitle": "Brand Manager",
                "email": "thuha.brand@gmail.com",
                "phoneNumber": "0922 334 556",
                "address": "Quận Phú Nhuận, TP. Hồ Chí Minh",
                "avatarUrl": "https://ui-avatars.com/api/?name=Nguyen+Thi+Thu+Ha&background=a855f7&color=ffffff&size=150&bold=true",
                "linkedIn": "linkedin.com/in/thuha-brand"
            },
            "about": "Brand Manager 6 năm kinh nghiệm xây dựng và reposition thương hiệu FMCG tại Việt Nam. Dẫn dắt brand strategy, packaging redesign và ATL/BTL campaign. Tăng brand equity index 18 điểm cho thương hiệu nước giải khát.",
            "experience": [
                {
                    "company": "Coca-Cola Vietnam",
                    "position": "Brand Manager",
                    "startDate": "2020-06",
                    "endDate": null,
                    "isCurrent": true,
                    "location": "TP. Hồ Chí Minh",
                    "description": "Quản lý brand Sprite và Fanta (doanh thu 800 tỷ/năm). Campaign Sprite Chill đạt 95% aided awareness. Packaging redesign tăng shelf visibility 20%."
                },
                {
                    "company": "Masan Consumer",
                    "position": "Assistant Brand Manager",
                    "startDate": "2017-09",
                    "endDate": "2020-05",
                    "isCurrent": false,
                    "location": "TP. Hồ Chí Minh",
                    "description": "Brand Omachi instant noodle. Launch 3 SKU mới, đạt 5% market share trong 6 tháng."
                },
                {
                    "company": "Saatchi & Saatchi Vietnam",
                    "position": "Brand Strategist",
                    "startDate": "2015-07",
                    "endDate": "2017-08",
                    "isCurrent": false,
                    "location": "TP. Hồ Chí Minh",
                    "description": "Brand positioning cho Vinamilk, Honda. Consumer insight research 500+ respondents/project."
                }
            ],
            "education": [
                {
                    "school": "Đại học Ngoại thương (FTU)",
                    "degree": "Cử nhân",
                    "major": "Marketing",
                    "startDate": "2011-09",
                    "endDate": "2015-06",
                    "gpa": "3.6 / 4.0"
                }
            ],
            "skills": {
                "displayStyle": "progressbar",
                "items": [
                    {
                        "name": "Brand Strategy",
                        "level": 92
                    },
                    {
                        "name": "Consumer Insight / Research",
                        "level": 88
                    },
                    {
                        "name": "ATL / BTL Campaign",
                        "level": 90
                    },
                    {
                        "name": "Packaging Design Brief",
                        "level": 85
                    },
                    {
                        "name": "P&L / Budget Management",
                        "level": 82
                    },
                    {
                        "name": "Agency Management",
                        "level": 88
                    },
                    {
                        "name": "Presentation (C-level)",
                        "level": 90
                    },
                    {
                        "name": "Tiếng Anh thành thạo",
                        "level": 92
                    }
                ]
            },
            "projects": [
                {
                    "name": "Sprite Chill Repositioning 2023",
                    "description": "Reposition brand cho Gen Z, campaign 360° đạt 95% awareness, market share tăng 2.5 điểm phần trăm.",
                    "techStack": [
                        "Brand Strategy",
                        "ATL",
                        "Digital",
                        "Trade Marketing"
                    ],
                    "url": ""
                }
            ],
            "customSections": [
                {
                    "id": "cs-028",
                    "title": "Giải thưởng & Chứng chỉ",
                    "icon": "award",
                    "items": [
                        {
                            "id": "ci-028a",
                            "name": "Effie Awards Vietnam – Silver",
                            "subtitle": "Effie Worldwide",
                            "startDate": "2023-06",
                            "endDate": "2023-06",
                            "description": "Best Brand Building Campaign"
                        },
                        {
                            "id": "ci-028b",
                            "name": "Brand Management Certificate",
                            "subtitle": "Kellogg School of Management",
                            "startDate": "2021-03",
                            "endDate": "2021-03",
                            "description": "Online program"
                        }
                    ]
                }
            ],
            "contact": {
                "email": "thuha.brand@gmail.com",
                "phone": "0922 334 556",
                "linkedIn": "linkedin.com/in/thuha-brand"
            }
        }
    },
    // ── 29. EVENT MANAGER / MC ─────────────────────────────────────
    {
        "templateId": "premium_sky_01",
        "themeConfig": {
            "primaryColor": "#0ea5e9",
            "secondaryColor": "#0f172a",
            "fontFamily": "Inter",
            "layoutMode": "top-header",
            "textColor": "#e0f2fe",
            "bodyTextColor": "#1e293b"
        },
        "columnLayout": {
            "left": [
                "about",
                "skills"
            ],
            "right": [
                "experience",
                "education",
                "projects"
            ]
        },
        "cvData": {
            "personal": {
                "fullName": "Lý Minh Quân",
                "title": "Event Manager / MC Professional",
                "jobTitle": "Event Manager / MC Professional",
                "email": "minhquan.event@gmail.com",
                "phoneNumber": "0905 778 990",
                "address": "Quận Bình Thạnh, TP. Hồ Chí Minh",
                "avatarUrl": "https://ui-avatars.com/api/?name=Ly+Minh+Quan&background=0ea5e9&color=ffffff&size=150&bold=true",
                "linkedIn": "linkedin.com/in/minhquan-event",
                "website": "minhquanevent.vn"
            },
            "about": "Event Manager & MC 8 năm kinh nghiệm tổ chức sự kiện corporate, gala và product launch cho 50+ thương hiệu lớn. Quản lý sự kiện quy mô 500–5,000 khách với ngân sách lên đến 3 tỷ VNĐ. 100% sự kiện hoàn thành đúng timeline và trong budget.",
            "experience": [
                {
                    "company": "Hoang Minh Group (Event Agency)",
                    "position": "Senior Event Manager",
                    "startDate": "2019-03",
                    "endDate": null,
                    "isCurrent": true,
                    "location": "TP. Hồ Chí Minh",
                    "description": "Lead 25 sự kiện/năm cho Samsung, Toyota, Vietcombank. Product launch Galaxy S series 2,000 khách. Quản lý team 15 và 20 vendor."
                },
                {
                    "company": "Vingroup Events",
                    "position": "Event Executive",
                    "startDate": "2016-01",
                    "endDate": "2019-02",
                    "isCurrent": false,
                    "location": "Hà Nội",
                    "description": "Tổ chức VinFast launch event, Vinhomes Grand Park groundbreaking. MC chính cho 10 gala dinner."
                },
                {
                    "company": "Freelance MC & Event",
                    "position": "MC / Event Coordinator",
                    "startDate": "2013-06",
                    "endDate": "2015-12",
                    "isCurrent": false,
                    "location": "TP. Hồ Chí Minh",
                    "description": "MC wedding, corporate year-end party. 80+ sự kiện, xây dựng network vendor và venue."
                }
            ],
            "education": [
                {
                    "school": "Đại học Văn hóa TP. HCM",
                    "degree": "Cử nhân",
                    "major": "Quản lý Văn hóa & Sự kiện",
                    "startDate": "2009-09",
                    "endDate": "2013-06",
                    "gpa": "3.5 / 4.0"
                }
            ],
            "skills": {
                "displayStyle": "tag",
                "items": [
                    {
                        "name": "Event Planning & Execution",
                        "level": 95
                    },
                    {
                        "name": "MC / Dẫn chương trình",
                        "level": 92
                    },
                    {
                        "name": "Vendor Management",
                        "level": 90
                    },
                    {
                        "name": "Budget Control",
                        "level": 88
                    },
                    {
                        "name": "Stage & AV Production",
                        "level": 85
                    },
                    {
                        "name": "Crisis Management",
                        "level": 82
                    },
                    {
                        "name": "Client Relationship",
                        "level": 90
                    },
                    {
                        "name": "Tiếng Anh / Tiếng Hàn cơ bản",
                        "level": 75
                    }
                ]
            },
            "projects": [
                {
                    "name": "Samsung Galaxy Unpacked VN 2024",
                    "description": "Product launch 2,000 khách tại GEM Center. Livestream 500K views. 15 media coverage, PR value 2 tỷ VNĐ.",
                    "techStack": [
                        "Event Production",
                        "Livestream",
                        "PR"
                    ],
                    "url": "minhquanevent.vn"
                }
            ],
            "contact": {
                "email": "minhquan.event@gmail.com",
                "phone": "0905 778 990",
                "linkedIn": "linkedin.com/in/minhquan-event",
                "website": "minhquanevent.vn"
            }
        }
    },
    // ── 30. CUSTOMER SUCCESS MANAGER ───────────────────────────────
    {
        "templateId": "premium_sky_01",
        "themeConfig": {
            "primaryColor": "#14b8a6",
            "secondaryColor": "#134e4a",
            "fontFamily": "Inter",
            "layoutMode": "top-header",
            "textColor": "#ccfbf1",
            "bodyTextColor": "#1e293b"
        },
        "columnLayout": {
            "left": [
                "about",
                "skills"
            ],
            "right": [
                "experience",
                "education",
                "projects",
                "customSections"
            ]
        },
        "cvData": {
            "personal": {
                "fullName": "Phan Thị Ngọc An",
                "title": "Customer Success Manager",
                "jobTitle": "Customer Success Manager",
                "email": "ngocan.cs@base.vn",
                "phoneNumber": "0933 889 001",
                "address": "Quận 4, TP. Hồ Chí Minh",
                "avatarUrl": "https://ui-avatars.com/api/?name=Phan+Thi+Ngoc+An&background=14b8a6&color=ffffff&size=150&bold=true",
                "linkedIn": "linkedin.com/in/ngocan-cs"
            },
            "about": "Customer Success Manager 5 năm kinh nghiệm tại SaaS B2B. Chuyên onboarding enterprise client, giảm churn và mở rộng upsell. Quản lý portfolio 80+ account với ARR 12 tỷ VNĐ, NPS 72 và retention rate 94%.",
            "experience": [
                {
                    "company": "Base.vn",
                    "position": "Senior Customer Success Manager",
                    "startDate": "2021-02",
                    "endDate": null,
                    "isCurrent": true,
                    "location": "TP. Hồ Chí Minh",
                    "description": "Quản lý 80 enterprise account (HRM, CRM). Giảm churn từ 8% xuống 3%. Upsell module mới đạt 2.5 tỷ VNĐ/năm. Xây dựng CS playbook và training 5 CSM mới."
                },
                {
                    "company": "Haravan",
                    "position": "Customer Success Specialist",
                    "startDate": "2018-08",
                    "endDate": "2021-01",
                    "isCurrent": false,
                    "location": "TP. Hồ Chí Minh",
                    "description": "Onboarding 200+ SME e-commerce merchant. Tăng GMV merchant trung bình 35% sau 3 tháng sử dụng platform."
                },
                {
                    "company": "KiotViet",
                    "position": "Account Manager",
                    "startDate": "2016-06",
                    "endDate": "2018-07",
                    "isCurrent": false,
                    "location": "Hà Nội",
                    "description": "Chăm sóc 150 retail client. Renewal rate 88%. Cross-sell phần mềm kế toán và inventory."
                }
            ],
            "education": [
                {
                    "school": "Đại học Kinh tế Quốc dân (NEU)",
                    "degree": "Cử nhân",
                    "major": "Quản trị Kinh doanh",
                    "startDate": "2012-09",
                    "endDate": "2016-06",
                    "gpa": "3.4 / 4.0"
                }
            ],
            "skills": {
                "displayStyle": "progressbar",
                "items": [
                    {
                        "name": "Customer Onboarding",
                        "level": 92
                    },
                    {
                        "name": "Churn Reduction",
                        "level": 90
                    },
                    {
                        "name": "Upsell / Cross-sell",
                        "level": 88
                    },
                    {
                        "name": "SaaS Metrics (NRR, NPS)",
                        "level": 85
                    },
                    {
                        "name": "HubSpot / Salesforce CRM",
                        "level": 82
                    },
                    {
                        "name": "QBR / Executive Presentation",
                        "level": 90
                    },
                    {
                        "name": "Product Training",
                        "level": 88
                    },
                    {
                        "name": "Tiếng Anh giao tiếp",
                        "level": 85
                    }
                ]
            },
            "projects": [
                {
                    "name": "Base.vn Enterprise CS Program",
                    "description": "Thiết kế onboarding 90-day program cho enterprise. Giảm time-to-value từ 60 ngày xuống 21 ngày, NPS tăng 15 điểm.",
                    "techStack": [
                        "HubSpot",
                        "Intercom",
                        "Notion"
                    ],
                    "url": ""
                }
            ],
            "customSections": [
                {
                    "id": "cs-030",
                    "title": "Chứng chỉ",
                    "icon": "book",
                    "items": [
                        {
                            "id": "ci-030a",
                            "name": "Gainsight Pulse Certified CSM",
                            "subtitle": "Gainsight",
                            "startDate": "2022-08",
                            "endDate": "2022-08",
                            "description": ""
                        },
                        {
                            "id": "ci-030b",
                            "name": "HubSpot Service Hub Certification",
                            "subtitle": "HubSpot Academy",
                            "startDate": "2021-05",
                            "endDate": "2021-05",
                            "description": ""
                        }
                    ]
                }
            ],
            "contact": {
                "email": "ngocan.cs@base.vn",
                "phone": "0933 889 001",
                "linkedIn": "linkedin.com/in/ngocan-cs"
            }
        }
    },
    // ── 31. OPERATIONS MANAGER ─────────────────────────────────────
    {
        "templateId": "premium_bold_10",
        "themeConfig": {
            "primaryColor": "#dc2626",
            "secondaryColor": "#111827",
            "fontFamily": "Inter",
            "layoutMode": "sidebar-left",
            "textColor": "#fecaca",
            "bodyTextColor": "#1e293b"
        },
        "columnLayout": {
            "left": [
                "profile",
                "contact",
                "skills",
                "education"
            ],
            "right": [
                "about",
                "experience",
                "projects"
            ]
        },
        "cvData": {
            "personal": {
                "fullName": "Bùi Văn Thắng",
                "title": "Operations Manager",
                "jobTitle": "Operations Manager",
                "email": "thang.ops@ghn.vn",
                "phoneNumber": "0915 667 778",
                "address": "Quận Tân Phú, TP. Hồ Chí Minh",
                "avatarUrl": "https://ui-avatars.com/api/?name=Bui+Van+Thang&background=dc2626&color=ffffff&size=150&bold=true",
                "linkedIn": "linkedin.com/in/thang-ops"
            },
            "about": "Operations Manager 8 năm kinh nghiệm tối ưu vận hành logistics và fulfillment tại GHN và Lazada. Quản lý 200+ nhân viên và 5 hub phân phối. Giảm chi phí vận hành 18% và tăng on-time delivery lên 97.5%.",
            "experience": [
                {
                    "company": "GHN (Giao Hàng Nhanh)",
                    "position": "Operations Manager – Miền Nam",
                    "startDate": "2020-05",
                    "endDate": null,
                    "isCurrent": true,
                    "location": "TP. Hồ Chí Minh",
                    "description": "Quản lý 5 sorting hub, 200 driver và 50 staff. Xử lý 80,000 đơn/ngày peak. Triển khai route optimization giảm km 22%, tiết kiệm 1.2 tỷ VNĐ/năm."
                },
                {
                    "company": "Lazada Vietnam",
                    "position": "Fulfillment Supervisor",
                    "startDate": "2016-08",
                    "endDate": "2020-04",
                    "isCurrent": false,
                    "location": "TP. Hồ Chí Minh",
                    "description": "Vận hành warehouse 15,000m². Pick-pack accuracy 99.8%. Lead team 80 trong peak 11.11."
                },
                {
                    "company": "DHL Supply Chain",
                    "position": "Operations Coordinator",
                    "startDate": "2013-01",
                    "endDate": "2016-07",
                    "isCurrent": false,
                    "location": "Bình Dương",
                    "description": "Coordinate inbound/outbound cho FMCG client. WMS implementation và SOP documentation."
                }
            ],
            "education": [
                {
                    "school": "Đại học Giao thông Vận tải TP. HCM",
                    "degree": "Cử nhân",
                    "major": "Quản lý Logistics",
                    "startDate": "2009-09",
                    "endDate": "2013-06",
                    "gpa": "3.3 / 4.0"
                }
            ],
            "skills": {
                "displayStyle": "progressbar",
                "items": [
                    {
                        "name": "Supply Chain Operations",
                        "level": 92
                    },
                    {
                        "name": "Warehouse Management",
                        "level": 90
                    },
                    {
                        "name": "KPI / SLA Management",
                        "level": 88
                    },
                    {
                        "name": "Lean / Six Sigma",
                        "level": 82
                    },
                    {
                        "name": "Team Leadership (200+)",
                        "level": 90
                    },
                    {
                        "name": "WMS / TMS Systems",
                        "level": 85
                    },
                    {
                        "name": "Budget & Cost Control",
                        "level": 86
                    },
                    {
                        "name": "Process Improvement",
                        "level": 92
                    }
                ]
            },
            "projects": [
                {
                    "name": "GHN Route Optimization Project",
                    "description": "Triển khai AI route planning cho 500 xe tải. Giảm 22% km, tăng delivery rate 97.5%, tiết kiệm 1.2 tỷ/năm.",
                    "techStack": [
                        "Route Optimization",
                        "WMS",
                        "Power BI"
                    ],
                    "url": ""
                }
            ],
            "contact": {
                "email": "thang.ops@ghn.vn",
                "phone": "0915 667 778",
                "linkedIn": "linkedin.com/in/thang-ops"
            }
        }
    },
    // ── 32. IT PROJECT MANAGER (PMO) ───────────────────────────────
    {
        "templateId": "premium_bold_10",
        "themeConfig": {
            "primaryColor": "#4f46e5",
            "secondaryColor": "#1e1b4b",
            "fontFamily": "Inter",
            "layoutMode": "sidebar-left",
            "textColor": "#e0e7ff",
            "bodyTextColor": "#1e293b"
        },
        "columnLayout": {
            "left": [
                "profile",
                "contact",
                "skills",
                "education"
            ],
            "right": [
                "about",
                "experience",
                "projects",
                "customSections"
            ]
        },
        "cvData": {
            "personal": {
                "fullName": "Đỗ Minh Khang",
                "title": "IT Project Manager (PMP)",
                "jobTitle": "IT Project Manager (PMP)",
                "email": "khang.pmp@fpt.com.vn",
                "phoneNumber": "0902 445 667",
                "address": "Quận Cầu Giấy, Hà Nội",
                "avatarUrl": "https://ui-avatars.com/api/?name=Do+Minh+Khang&background=4f46e5&color=ffffff&size=150&bold=true",
                "linkedIn": "linkedin.com/in/khang-pmp"
            },
            "about": "IT Project Manager 9 năm kinh nghiệm quản lý dự án chuyển đổi số cho ngân hàng và chính phủ. PMP certified, thành thạo Agile/Scrum và Waterfall. Delivered 25+ dự án đúng hạn, tổng giá trị 150 tỷ VNĐ.",
            "experience": [
                {
                    "company": "FPT IS",
                    "position": "Senior IT Project Manager",
                    "startDate": "2019-01",
                    "endDate": null,
                    "isCurrent": true,
                    "location": "Hà Nội",
                    "description": "Lead dự án core banking migration cho ngân hàng lớn (80 tỷ VNĐ). Team 45 người, 18 tháng, go-live zero critical bug. Quản lý 4 dự án song song."
                },
                {
                    "company": "CMC Corporation",
                    "position": "Project Manager",
                    "startDate": "2015-06",
                    "endDate": "2018-12",
                    "isCurrent": false,
                    "location": "Hà Nội",
                    "description": "Triển khai ERP SAP cho manufacturing client. Change management và UAT cho 500 end-users."
                },
                {
                    "company": "TMA Solutions",
                    "position": "Technical Lead / PM",
                    "startDate": "2012-03",
                    "endDate": "2015-05",
                    "isCurrent": false,
                    "location": "TP. Hồ Chí Minh",
                    "description": "Outsource project cho client US. Sprint planning, risk management, client communication."
                }
            ],
            "education": [
                {
                    "school": "Đại học Bách khoa Hà Nội",
                    "degree": "Kỹ sư",
                    "major": "Công nghệ Thông tin",
                    "startDate": "2008-09",
                    "endDate": "2012-06",
                    "gpa": "3.5 / 4.0"
                }
            ],
            "skills": {
                "displayStyle": "tag",
                "items": [
                    {
                        "name": "PMP / PRINCE2",
                        "level": 95
                    },
                    {
                        "name": "Agile / Scrum Master",
                        "level": 90
                    },
                    {
                        "name": "Risk Management",
                        "level": 88
                    },
                    {
                        "name": "Stakeholder Management",
                        "level": 92
                    },
                    {
                        "name": "MS Project / Jira",
                        "level": 85
                    },
                    {
                        "name": "Budget Control",
                        "level": 88
                    },
                    {
                        "name": "Vendor Management",
                        "level": 82
                    },
                    {
                        "name": "Tiếng Anh (TOEIC 920)",
                        "level": 90
                    }
                ]
            },
            "projects": [
                {
                    "name": "Core Banking Migration 2023",
                    "description": "Migration 2 triệu tài khoản sang hệ thống mới. 18 tháng, 45 FTE, go-live thành công với 99.99% uptime tuần đầu.",
                    "techStack": [
                        "Java",
                        "Oracle",
                        "Agile",
                        "PMO"
                    ],
                    "url": ""
                }
            ],
            "customSections": [
                {
                    "id": "cs-032",
                    "title": "Chứng chỉ PM",
                    "icon": "award",
                    "items": [
                        {
                            "id": "ci-032a",
                            "name": "PMP – Project Management Professional",
                            "subtitle": "PMI",
                            "startDate": "2018-06",
                            "endDate": "2018-06",
                            "description": ""
                        },
                        {
                            "id": "ci-032b",
                            "name": "Certified Scrum Master (CSM)",
                            "subtitle": "Scrum Alliance",
                            "startDate": "2019-03",
                            "endDate": "2019-03",
                            "description": ""
                        }
                    ]
                }
            ],
            "contact": {
                "email": "khang.pmp@fpt.com.vn",
                "phone": "0902 445 667",
                "linkedIn": "linkedin.com/in/khang-pmp"
            }
        }
    },
    // ── 33. Y TÁ / ĐIỀU DƯỠNG TRƯỞNG ───────────────────────────────
    {
        "templateId": "premium_rose_06",
        "themeConfig": {
            "primaryColor": "#e11d48",
            "secondaryColor": "#881337",
            "fontFamily": "Lato",
            "layoutMode": "sidebar-right",
            "textColor": "#ffe4e6",
            "bodyTextColor": "#1c1917"
        },
        "columnLayout": {
            "left": [
                "about",
                "experience",
                "projects"
            ],
            "right": [
                "profile",
                "contact",
                "skills",
                "education",
                "customSections"
            ]
        },
        "cvData": {
            "personal": {
                "fullName": "Trần Thị Lan Anh",
                "title": "Điều dưỡng trưởng Khoa Nội",
                "jobTitle": "Điều dưỡng trưởng Khoa Nội",
                "email": "lananh.nurse@vinmec.com",
                "phoneNumber": "0919 223 445",
                "address": "Quận Ba Đình, Hà Nội",
                "avatarUrl": "https://ui-avatars.com/api/?name=Tran+Thi+Lan+Anh&background=e11d48&color=ffffff&size=150&bold=true",
                "linkedIn": "linkedin.com/in/lananh-nurse"
            },
            "about": "Điều dưỡng trưởng 10 năm kinh nghiệm tại Vinmec và Bệnh viện Bạch Mai. Chuyên quản lý điều dưỡng, đào tạo nhân viên và cải tiến quy trình chăm sóc bệnh nhân. Quản lý 35 điều dưỡng, giảm tỷ lệ nhiễm khuẩn bệnh viện 40%.",
            "experience": [
                {
                    "company": "Vinmec Times City",
                    "position": "Điều dưỡng trưởng – Khoa Nội tổng hợp",
                    "startDate": "2019-04",
                    "endDate": null,
                    "isCurrent": true,
                    "location": "Hà Nội",
                    "description": "Quản lý 35 điều dưỡng, 60 giường bệnh. Triển khai quy trình chăm sóc chuẩn JCI. Giảm HAI (Healthcare Associated Infection) 40%. Patient satisfaction 4.8/5."
                },
                {
                    "company": "Bệnh viện Bạch Mai",
                    "position": "Điều dưỡng cao cấp",
                    "startDate": "2014-07",
                    "endDate": "2019-03",
                    "isCurrent": false,
                    "location": "Hà Nội",
                    "description": "Chăm sóc bệnh nhân ICU. Hướng dẫn thực hành cho 50 sinh viên điều dưỡng/năm."
                },
                {
                    "company": "Bệnh viện Đa khoa Xanh Pôn",
                    "position": "Điều dưỡng viên",
                    "startDate": "2011-08",
                    "endDate": "2014-06",
                    "isCurrent": false,
                    "location": "Hà Nội",
                    "description": "Chăm sóc khoa Ngoại. Tham gia cấp cứu và phẫu thuật hỗ trợ."
                }
            ],
            "education": [
                {
                    "school": "Trường ĐH Y Hà Nội",
                    "degree": "Cử nhân",
                    "major": "Điều dưỡng",
                    "startDate": "2007-09",
                    "endDate": "2011-06",
                    "gpa": "3.6 / 4.0"
                },
                {
                    "school": "Vinmec Academy",
                    "degree": "Chứng chỉ",
                    "major": "Quản lý Điều dưỡng",
                    "startDate": "2018-03",
                    "endDate": "2018-09",
                    "gpa": "Xuất sắc"
                }
            ],
            "skills": {
                "displayStyle": "progressbar",
                "items": [
                    {
                        "name": "Quản lý Điều dưỡng",
                        "level": 92
                    },
                    {
                        "name": "Chăm sóc ICU / Nội khoa",
                        "level": 90
                    },
                    {
                        "name": "JCI Standards",
                        "level": 85
                    },
                    {
                        "name": "Đào tạo & Mentoring",
                        "level": 88
                    },
                    {
                        "name": "Infection Control",
                        "level": 90
                    },
                    {
                        "name": "EMR / Hospital System",
                        "level": 78
                    },
                    {
                        "name": "Giao tiếp Bệnh nhân",
                        "level": 95
                    },
                    {
                        "name": "Tiếng Anh y khoa",
                        "level": 80
                    }
                ]
            },
            "projects": [
                {
                    "name": "JCI Infection Control Program",
                    "description": "Thiết kế và triển khai protocol phòng nhiễm khuẩn. Giảm HAI 40%, đạt chuẩn JCI accreditation.",
                    "techStack": [
                        "JCI",
                        "Quality Management",
                        "Training"
                    ],
                    "url": ""
                }
            ],
            "customSections": [
                {
                    "id": "cs-033",
                    "title": "Chứng chỉ Y khoa",
                    "icon": "heart",
                    "items": [
                        {
                            "id": "ci-033a",
                            "name": "BLS – Basic Life Support",
                            "subtitle": "American Heart Association",
                            "startDate": "2023-01",
                            "endDate": "2025-01",
                            "description": "Renewed annually"
                        },
                        {
                            "id": "ci-033b",
                            "name": "ACLS – Advanced Cardiovascular Life Support",
                            "subtitle": "AHA",
                            "startDate": "2022-06",
                            "endDate": "2024-06",
                            "description": ""
                        }
                    ]
                }
            ],
            "contact": {
                "email": "lananh.nurse@vinmec.com",
                "phone": "0919 223 445",
                "linkedIn": "linkedin.com/in/lananh-nurse"
            }
        }
    },
    // ── 34. BẾP TRƯỞNG / EXECUTIVE CHEF ────────────────────────────
    {
        "templateId": "premium_rose_06",
        "themeConfig": {
            "primaryColor": "#b45309",
            "secondaryColor": "#451a03",
            "fontFamily": "Lato",
            "layoutMode": "sidebar-right",
            "textColor": "#fef3c7",
            "bodyTextColor": "#1c1917"
        },
        "columnLayout": {
            "left": [
                "about",
                "experience",
                "projects"
            ],
            "right": [
                "profile",
                "contact",
                "skills",
                "education"
            ]
        },
        "cvData": {
            "personal": {
                "fullName": "Nguyễn Hoàng Sơn",
                "title": "Executive Chef / Bếp trưởng",
                "jobTitle": "Executive Chef / Bếp trưởng",
                "email": "chef.son@accor.com",
                "phoneNumber": "0907 889 112",
                "address": "Quận 1, TP. Hồ Chí Minh",
                "avatarUrl": "https://ui-avatars.com/api/?name=Nguyen+Hoang+Son&background=b45309&color=ffffff&size=150&bold=true",
                "linkedIn": "linkedin.com/in/chef-son"
            },
            "about": "Executive Chef 12 năm kinh nghiệm tại khách sạn 5 sao Accor và Marriott. Chuyên ẩm thực fusion Việt-Pháp và quản lý bếp quy mô 30+ nhân viên. 2 lần đạt giải Best Chef Vietnam. Doanh thu F&B tăng 25% dưới leadership.",
            "experience": [
                {
                    "company": "Sofitel Saigon Plaza (Accor)",
                    "position": "Executive Chef",
                    "startDate": "2019-06",
                    "endDate": null,
                    "isCurrent": true,
                    "location": "TP. Hồ Chí Minh",
                    "description": "Quản lý 3 outlet (180 covers), team 32 chef. Menu redesign tăng food cost margin 5%. Michelin Guide recommended 2023. Food safety audit 100% pass."
                },
                {
                    "company": "Park Hyatt Saigon",
                    "position": "Sous Chef",
                    "startDate": "2015-03",
                    "endDate": "2019-05",
                    "isCurrent": false,
                    "location": "TP. Hồ Chí Minh",
                    "description": "Second-in-command bếp chính. Banquet 500 pax event. HACCP implementation."
                },
                {
                    "company": "InterContinental Hanoi",
                    "position": "Chef de Partie",
                    "startDate": "2011-01",
                    "endDate": "2015-02",
                    "isCurrent": false,
                    "location": "Hà Nội",
                    "description": "Hot kitchen section lead. Fine dining service cho diplomatic events."
                }
            ],
            "education": [
                {
                    "school": "Học viện Ẩm thực TP. HCM (Netspace)",
                    "degree": "Chứng chỉ",
                    "major": "Quản lý Nhà hàng Khách sạn",
                    "startDate": "2008-09",
                    "endDate": "2010-06",
                    "gpa": "Distinction"
                }
            ],
            "skills": {
                "displayStyle": "tag",
                "items": [
                    {
                        "name": "French / Vietnamese Fusion",
                        "level": 95
                    },
                    {
                        "name": "Kitchen Management",
                        "level": 92
                    },
                    {
                        "name": "Menu Engineering / Costing",
                        "level": 90
                    },
                    {
                        "name": "HACCP / Food Safety",
                        "level": 95
                    },
                    {
                        "name": "Team Leadership (32+)",
                        "level": 88
                    },
                    {
                        "name": "Banquet & Event Catering",
                        "level": 90
                    },
                    {
                        "name": "Inventory Control",
                        "level": 85
                    },
                    {
                        "name": "Tiếng Pháp / Tiếng Anh",
                        "level": 82
                    }
                ]
            },
            "projects": [
                {
                    "name": "Sofitel Garden Menu Revamp 2023",
                    "description": "Thiết kế menu seasonal farm-to-table. Food cost 28%, guest satisfaction 4.9/5, doanh thu outlet tăng 25%.",
                    "techStack": [
                        "Menu Design",
                        "Cost Control",
                        "HACCP"
                    ],
                    "url": ""
                }
            ],
            "contact": {
                "email": "chef.son@accor.com",
                "phone": "0907 889 112",
                "linkedIn": "linkedin.com/in/chef-son"
            }
        }
    },
    // ── 35. QUẢN LÝ KHÁCH SẠN 5 SAO ────────────────────────────────
    {
        "templateId": "premium_luxury_02",
        "themeConfig": {
            "primaryColor": "#d4af37",
            "secondaryColor": "#111111",
            "fontFamily": "Playfair Display",
            "layoutMode": "sidebar-right",
            "textColor": "#fef9c3",
            "bodyTextColor": "#1c1917"
        },
        "columnLayout": {
            "left": [
                "about",
                "experience",
                "projects"
            ],
            "right": [
                "profile",
                "contact",
                "skills",
                "education"
            ]
        },
        "cvData": {
            "personal": {
                "fullName": "Lê Thanh Huyền",
                "title": "Hotel General Manager",
                "jobTitle": "Hotel General Manager",
                "email": "huyen.gm@marriott.com",
                "phoneNumber": "0912 990 334",
                "address": "Quận 3, TP. Hồ Chí Minh",
                "avatarUrl": "https://ui-avatars.com/api/?name=Le+Thanh+Huyen&background=d4af37&color=ffffff&size=150&bold=true",
                "linkedIn": "linkedin.com/in/huyen-gm"
            },
            "about": "General Manager 10 năm kinh nghiệm vận hành khách sạn 5 sao Marriott và Accor tại Việt Nam. Quản lý property 300 phòng, 200 nhân viên. RevPAR tăng 22%, GopPAR 18% và đạt TripAdvisor Certificate of Excellence 4 năm liên tiếp.",
            "experience": [
                {
                    "company": "Sheraton Saigon Hotel (Marriott)",
                    "position": "General Manager",
                    "startDate": "2020-01",
                    "endDate": null,
                    "isCurrent": true,
                    "location": "TP. Hồ Chí Minh",
                    "description": "P&L owner cho 300-room property. RevPAR 95 USD, occupancy 78%. Lead 200 staff, 4 department heads. Renovation 50 phòng, ROI 2.5 năm."
                },
                {
                    "company": "Pullman Hanoi",
                    "position": "Director of Operations",
                    "startDate": "2016-04",
                    "endDate": "2019-12",
                    "isCurrent": false,
                    "location": "Hà Nội",
                    "description": "Oversee F&B, Front Office, Housekeeping. Guest satisfaction 4.7/5. Cost control giảm 8%."
                },
                {
                    "company": "Novotel Danang",
                    "position": "Front Office Manager",
                    "startDate": "2012-06",
                    "endDate": "2016-03",
                    "isCurrent": false,
                    "location": "Đà Nẵng",
                    "description": "Quản lý 25 front desk staff. Upsell room upgrade tăng 15% revenue."
                }
            ],
            "education": [
                {
                    "school": "École hôtelière de Lausanne (EHL) – Online",
                    "degree": "Executive Certificate",
                    "major": "Hospitality Management",
                    "startDate": "2018-01",
                    "endDate": "2018-12",
                    "gpa": "Distinction"
                }
            ],
            "skills": {
                "displayStyle": "progressbar",
                "items": [
                    {
                        "name": "Hotel P&L Management",
                        "level": 95
                    },
                    {
                        "name": "Revenue Management",
                        "level": 90
                    },
                    {
                        "name": "Guest Experience",
                        "level": 92
                    },
                    {
                        "name": "Team Leadership (200+)",
                        "level": 90
                    },
                    {
                        "name": "Marriott / Accor Standards",
                        "level": 88
                    },
                    {
                        "name": "Crisis Management",
                        "level": 85
                    },
                    {
                        "name": "Marketing & Branding",
                        "level": 82
                    },
                    {
                        "name": "Tiếng Anh / Tiếng Pháp",
                        "level": 92
                    }
                ]
            },
            "projects": [
                {
                    "name": "Sheraton Room Renovation 2022",
                    "description": "Renovate 50 deluxe rooms, budget 15 tỷ VNĐ. ADR tăng 18%, ROI 2.5 năm, TripAdvisor rating 4.8.",
                    "techStack": [
                        "Renovation",
                        "Revenue Management",
                        "Project Management"
                    ],
                    "url": ""
                }
            ],
            "contact": {
                "email": "huyen.gm@marriott.com",
                "phone": "0912 990 334",
                "linkedIn": "linkedin.com/in/huyen-gm"
            }
        }
    },
    // ── 36. MÔI GIỚI BẤT ĐỘNG SẢN ──────────────────────────────────
    {
        "templateId": "premium_luxury_02",
        "themeConfig": {
            "primaryColor": "#92400e",
            "secondaryColor": "#1c1917",
            "fontFamily": "Playfair Display",
            "layoutMode": "sidebar-right",
            "textColor": "#fef3c7",
            "bodyTextColor": "#1c1917"
        },
        "columnLayout": {
            "left": [
                "about",
                "experience",
                "projects",
                "customSections"
            ],
            "right": [
                "profile",
                "contact",
                "skills",
                "education"
            ]
        },
        "cvData": {
            "personal": {
                "fullName": "Phạm Quốc Thịnh",
                "title": "Senior Real Estate Consultant",
                "jobTitle": "Senior Real Estate Consultant",
                "email": "thinh.realestate@gmail.com",
                "phoneNumber": "0908 556 778",
                "address": "Quận 2, TP. Hồ Chí Minh",
                "avatarUrl": "https://ui-avatars.com/api/?name=Pham+Quoc+Thinh&background=92400e&color=ffffff&size=150&bold=true",
                "linkedIn": "linkedin.com/in/thinh-realestate",
                "website": "thinhproperty.vn"
            },
            "about": "Môi giới BĐS cao cấp 7 năm kinh nghiệm chuyên biệt phân khúc hạng sang tại TP. HCM. Top 5 agent của DKRA Vietnam 3 năm liên tiếp. Tổng giá trị giao dịch 850 tỷ VNĐ, 120+ deal thành công.",
            "experience": [
                {
                    "company": "DKRA Vietnam",
                    "position": "Senior Property Consultant",
                    "startDate": "2019-02",
                    "endDate": null,
                    "isCurrent": true,
                    "location": "TP. Hồ Chí Minh",
                    "description": "Chuyên BĐS cao cấp Quận 1, 2, 7 (Vinhomes, Masteri, The Sun Avenue). 35 deal/năm, giá trị trung bình 8 tỷ/deal. Top 5 agent 2021-2023."
                },
                {
                    "company": "Cen Land",
                    "position": "Property Advisor",
                    "startDate": "2016-05",
                    "endDate": "2019-01",
                    "isCurrent": false,
                    "location": "TP. Hồ Chí Minh",
                    "description": "Phân phối dự án Vinhomes, Novaland. Đạt 120% KPI 2 năm liên tiếp."
                },
                {
                    "company": "Savills Vietnam",
                    "position": "Trainee Consultant",
                    "startDate": "2014-08",
                    "endDate": "2016-04",
                    "isCurrent": false,
                    "location": "TP. Hồ Chí Minh",
                    "description": "Hỗ trợ valuation và market research cho commercial property."
                }
            ],
            "education": [
                {
                    "school": "Đại học Kinh tế TP. HCM (UEH)",
                    "degree": "Cử nhân",
                    "major": "Tài chính – Ngân hàng",
                    "startDate": "2010-09",
                    "endDate": "2014-06",
                    "gpa": "3.4 / 4.0"
                }
            ],
            "skills": {
                "displayStyle": "tag",
                "items": [
                    {
                        "name": "BĐS Cao cấp / Hạng sang",
                        "level": 95
                    },
                    {
                        "name": "Negotiation & Closing",
                        "level": 92
                    },
                    {
                        "name": "Market Analysis",
                        "level": 88
                    },
                    {
                        "name": "Client Relationship",
                        "level": 90
                    },
                    {
                        "name": "Legal / Contract",
                        "level": 85
                    },
                    {
                        "name": "Digital Marketing Property",
                        "level": 80
                    },
                    {
                        "name": "Investment Advisory",
                        "level": 88
                    },
                    {
                        "name": "Tiếng Anh / Tiếng Hoa",
                        "level": 82
                    }
                ]
            },
            "projects": [
                {
                    "name": "Vinhomes Grand Park Penthouse Deal",
                    "description": "Giao dịch penthouse 45 tỷ VNĐ – deal lớn nhất Q3/2023. Thời gian closing 21 ngày.",
                    "techStack": [
                        "Luxury Sales",
                        "Negotiation"
                    ],
                    "url": "thinhproperty.vn"
                }
            ],
            "customSections": [
                {
                    "id": "cs-036",
                    "title": "Thành tích",
                    "icon": "star",
                    "items": [
                        {
                            "id": "ci-036a",
                            "name": "Top 5 Agent – DKRA Vietnam",
                            "subtitle": "DKRA Group",
                            "startDate": "2021-01",
                            "endDate": "2023-12",
                            "description": "3 năm liên tiếp"
                        },
                        {
                            "id": "ci-036b",
                            "name": "Chứng chỉ Môi giới BĐS",
                            "subtitle": "Bộ Xây dựng",
                            "startDate": "2016-06",
                            "endDate": "2016-06",
                            "description": ""
                        }
                    ]
                }
            ],
            "contact": {
                "email": "thinh.realestate@gmail.com",
                "phone": "0908 556 778",
                "linkedIn": "linkedin.com/in/thinh-realestate",
                "website": "thinhproperty.vn"
            }
        }
    },
    // ── 37. CHUYÊN VIÊN XUẤT NHẬP KHẨU ─────────────────────────────
    {
        "templateId": "elegant_business_01",
        "themeConfig": {
            "primaryColor": "#0369a1",
            "secondaryColor": "#0c4a6e",
            "fontFamily": "Merriweather",
            "layoutMode": "sidebar-left",
            "textColor": "#e0f2fe",
            "bodyTextColor": "#1e293b"
        },
        "columnLayout": {
            "left": [
                "profile",
                "contact",
                "skills",
                "education"
            ],
            "right": [
                "about",
                "experience",
                "projects"
            ]
        },
        "cvData": {
            "personal": {
                "fullName": "Võ Đình Phước",
                "title": "Chuyên viên Xuất nhập khẩu",
                "jobTitle": "Chuyên viên Xuất nhập khẩu",
                "email": "phuoc.import@logistics.vn",
                "phoneNumber": "0916 778 990",
                "address": "Quận 4, TP. Hồ Chí Minh",
                "avatarUrl": "https://ui-avatars.com/api/?name=Vo+Dinh+Phuoc&background=0369a1&color=ffffff&size=150&bold=true",
                "linkedIn": "linkedin.com/in/phuoc-import"
            },
            "about": "Chuyên viên XNK 6 năm kinh nghiệm thủ tục hải quan, logistics và chứng từ quốc tế. Xử lý 500+ lô hàng/năm trị giá 50 triệu USD cho doanh nghiệp sản xuất và thương mại. Giảm thời gian thông quan trung bình 30%.",
            "experience": [
                {
                    "company": "ITL Corporation",
                    "position": "Import-Export Specialist",
                    "startDate": "2020-03",
                    "endDate": null,
                    "isCurrent": true,
                    "location": "TP. Hồ Chí Minh",
                    "description": "Quản lý XNK cho 20 client (điện tử, dệt may). 500 lô/năm, 50 triệu USD. Tối ưu HS code classification, giảm thuế nhập khẩu 12% hợp pháp."
                },
                {
                    "company": "Gemadept Corporation",
                    "position": "Customs Declarant",
                    "startDate": "2017-06",
                    "endDate": "2020-02",
                    "isCurrent": false,
                    "location": "TP. Hồ Chí Minh",
                    "description": "Khai báo hải quan điện tử VNACCS. Xử lý container lạnh, hàng DG. Zero penalty 3 năm."
                },
                {
                    "company": "Saigon Newport (Cat Lai Port)",
                    "position": "Documentation Officer",
                    "startDate": "2015-01",
                    "endDate": "2017-05",
                    "isCurrent": false,
                    "location": "TP. Hồ Chí Minh",
                    "description": "Chứng từ vận tải B/L, Invoice, Packing List. Coordination với shipping line."
                }
            ],
            "education": [
                {
                    "school": "Đại học Ngoại thương (FTU) – Cơ sở II",
                    "degree": "Cử nhân",
                    "major": "Kinh tế Đối ngoại",
                    "startDate": "2011-09",
                    "endDate": "2015-06",
                    "gpa": "3.5 / 4.0"
                }
            ],
            "skills": {
                "displayStyle": "progressbar",
                "items": [
                    {
                        "name": "Thủ tục Hải quan VN",
                        "level": 95
                    },
                    {
                        "name": "Incoterms 2020",
                        "level": 92
                    },
                    {
                        "name": "Chứng từ XNK (B/L, C/O)",
                        "level": 90
                    },
                    {
                        "name": "VNACCS / ECUS",
                        "level": 88
                    },
                    {
                        "name": "Logistics / Freight",
                        "level": 85
                    },
                    {
                        "name": "Tiếng Anh chuyên ngành",
                        "level": 88
                    },
                    {
                        "name": "Excel / ERP",
                        "level": 82
                    },
                    {
                        "name": "HS Code Classification",
                        "level": 90
                    }
                ]
            },
            "projects": [
                {
                    "name": "ITL Client Tax Optimization",
                    "description": "Rà soát HS code cho 20 client, tiết kiệm thuế NK 12% (2.5 tỷ VNĐ/năm) trong khung pháp luật.",
                    "techStack": [
                        "Customs",
                        "HS Code",
                        "Compliance"
                    ],
                    "url": ""
                }
            ],
            "contact": {
                "email": "phuoc.import@logistics.vn",
                "phone": "0916 778 990",
                "linkedIn": "linkedin.com/in/phuoc-import"
            }
        }
    },
    // ── 38. INTERIOR DESIGNER (NỘI THẤT) ───────────────────────────
    {
        "templateId": "premium_minimal_03",
        "themeConfig": {
            "primaryColor": "#78716c",
            "secondaryColor": "#f8fafc",
            "fontFamily": "Montserrat",
            "layoutMode": "minimal-1-col",
            "textColor": "#1e293b",
            "bodyTextColor": "#374151"
        },
        "columnLayout": {
            "left": [
                "about",
                "skills",
                "experience"
            ],
            "right": [
                "education",
                "projects",
                "customSections"
            ]
        },
        "cvData": {
            "personal": {
                "fullName": "Nguyễn Thùy Dung",
                "title": "Senior Interior Designer",
                "jobTitle": "Senior Interior Designer",
                "email": "dung.interior@gmail.com",
                "phoneNumber": "0935 112 889",
                "address": "Quận 2, TP. Hồ Chí Minh",
                "avatarUrl": "https://ui-avatars.com/api/?name=Nguyen+Thuy+Dung&background=78716c&color=ffffff&size=150&bold=true",
                "linkedIn": "linkedin.com/in/dung-interior",
                "portfolio": "behance.net/dung-interior"
            },
            "about": "Interior Designer 7 năm kinh nghiệm thiết kế nội thất residential và commercial cao cấp. Portfolio 80+ công trình tại Vinhomes, Masteri và biệt thự đơn lẻ. Phong cách Modern Scandinavian và Tropical Contemporary.",
            "experience": [
                {
                    "company": "Mia Design Studio",
                    "position": "Senior Interior Designer",
                    "startDate": "2020-01",
                    "endDate": null,
                    "isCurrent": true,
                    "location": "TP. Hồ Chí Minh",
                    "description": "Lead design 25 project/năm (căn hộ 80–200m², biệt thự). Budget 500 triệu–3 tỷ VNĐ/project. 3D render với 3ds Max + V-Ray, client approval rate 95%."
                },
                {
                    "company": "Decox Design",
                    "position": "Interior Designer",
                    "startDate": "2017-04",
                    "endDate": "2019-12",
                    "isCurrent": false,
                    "location": "TP. Hồ Chí Minh",
                    "description": "Thiết kế nội thất chung cư cao cấp. Material board và site supervision."
                },
                {
                    "company": "Freelance",
                    "position": "Interior Designer",
                    "startDate": "2015-06",
                    "endDate": "2017-03",
                    "isCurrent": false,
                    "location": "TP. Hồ Chí Minh",
                    "description": "15 residential project. Xây dựng portfolio và client network."
                }
            ],
            "education": [
                {
                    "school": "Đại học Kiến trúc TP. HCM",
                    "degree": "Cử nhân",
                    "major": "Kiến trúc",
                    "startDate": "2011-09",
                    "endDate": "2015-06",
                    "gpa": "3.4 / 4.0"
                }
            ],
            "skills": {
                "displayStyle": "tag",
                "items": [
                    {
                        "name": "3ds Max / V-Ray / SketchUp",
                        "level": 92
                    },
                    {
                        "name": "AutoCAD / Revit",
                        "level": 88
                    },
                    {
                        "name": "Space Planning",
                        "level": 90
                    },
                    {
                        "name": "Material Selection",
                        "level": 92
                    },
                    {
                        "name": "Residential / Commercial",
                        "level": 90
                    },
                    {
                        "name": "Client Presentation",
                        "level": 88
                    },
                    {
                        "name": "Budget Estimation",
                        "level": 85
                    },
                    {
                        "name": "Site Supervision",
                        "level": 82
                    }
                ]
            },
            "projects": [
                {
                    "name": "Vinhomes Central Park Penthouse 180m²",
                    "description": "Thiết kế full nội thất penthouse 180m², budget 2.8 tỷ. Modern Tropical style, hoàn thiện 2023, published trên Kiến Việt.",
                    "techStack": [
                        "3ds Max",
                        "AutoCAD",
                        "Material Board"
                    ],
                    "url": "behance.net/dung-interior"
                }
            ],
            "customSections": [
                {
                    "id": "cs-038",
                    "title": "Giải thưởng",
                    "icon": "star",
                    "items": [
                        {
                            "id": "ci-038a",
                            "name": "Best Residential Design – Vietnam Interior Awards 2023",
                            "subtitle": "VIA",
                            "startDate": "2023-11",
                            "endDate": "2023-11",
                            "description": "Gold category"
                        }
                    ]
                }
            ],
            "contact": {
                "email": "dung.interior@gmail.com",
                "phone": "0935 112 889",
                "linkedIn": "linkedin.com/in/dung-interior",
                "portfolio": "behance.net/dung-interior"
            }
        }
    },
    // ── 39. PHOTOGRAPHER / VIDEOGRAPHER ────────────────────────────
    {
        "templateId": "premium_minimal_03",
        "themeConfig": {
            "primaryColor": "#171717",
            "secondaryColor": "#fafafa",
            "fontFamily": "Montserrat",
            "layoutMode": "minimal-1-col",
            "textColor": "#171717",
            "bodyTextColor": "#404040"
        },
        "columnLayout": {
            "left": [
                "about",
                "skills",
                "experience"
            ],
            "right": [
                "education",
                "projects"
            ]
        },
        "cvData": {
            "personal": {
                "fullName": "Trương Minh Đức",
                "title": "Photographer / Videographer",
                "jobTitle": "Photographer / Videographer",
                "email": "duc.photo@gmail.com",
                "phoneNumber": "0904 223 556",
                "address": "Quận Hoàn Kiếm, Hà Nội",
                "avatarUrl": "https://ui-avatars.com/api/?name=Truong+Minh+Duc&background=171717&color=ffffff&size=150&bold=true",
                "linkedIn": "linkedin.com/in/duc-photo",
                "portfolio": "ducphoto.vn",
                "website": "ducphoto.vn"
            },
            "about": "Photographer & Videographer 8 năm kinh nghiệm chụp commercial, wedding và brand campaign. Client bao gồm Samsung, VinFast và 100+ cặp đôi cao cấp. Portfolio 500+ project, studio riêng tại Hà Nội.",
            "experience": [
                {
                    "company": "Đức Photo Studio (Owner)",
                    "position": "Lead Photographer / Director",
                    "startDate": "2018-01",
                    "endDate": null,
                    "isCurrent": true,
                    "location": "Hà Nội",
                    "description": "Studio 150m², team 5. Commercial shoot cho Samsung, VinFast, Highland. 80 wedding/năm, giá trung bình 35 triệu/event. YouTube 50K subscribers."
                },
                {
                    "company": "Lotus Production",
                    "position": "Senior Photographer",
                    "startDate": "2015-03",
                    "endDate": "2017-12",
                    "isCurrent": false,
                    "location": "Hà Nội",
                    "description": "Fashion và beauty shoot cho magazine. Post-production với Capture One và Premiere Pro."
                },
                {
                    "company": "Freelance",
                    "position": "Photographer",
                    "startDate": "2012-06",
                    "endDate": "2015-02",
                    "isCurrent": false,
                    "location": "Hà Nội",
                    "description": "Event và portrait photography. Xây dựng portfolio và equipment."
                }
            ],
            "education": [
                {
                    "school": "Học viện Báo chí và Tuyên truyền",
                    "degree": "Cử nhân",
                    "major": "Nhiếp ảnh & Truyền thông",
                    "startDate": "2008-09",
                    "endDate": "2012-06",
                    "gpa": "3.5 / 4.0"
                }
            ],
            "skills": {
                "displayStyle": "progressbar",
                "items": [
                    {
                        "name": "Commercial Photography",
                        "level": 95
                    },
                    {
                        "name": "Wedding / Event",
                        "level": 92
                    },
                    {
                        "name": "Videography / Drone",
                        "level": 88
                    },
                    {
                        "name": "Lightroom / Capture One",
                        "level": 95
                    },
                    {
                        "name": "Premiere Pro / DaVinci",
                        "level": 85
                    },
                    {
                        "name": "Studio Lighting",
                        "level": 90
                    },
                    {
                        "name": "Brand Campaign",
                        "level": 88
                    },
                    {
                        "name": "Client Direction",
                        "level": 90
                    }
                ]
            },
            "projects": [
                {
                    "name": "VinFast VF8 Launch Campaign",
                    "description": "Official photographer cho sự kiện ra mắt VF8. 200+ ảnh editorial, sử dụng cho toàn bộ media kit quốc gia.",
                    "techStack": [
                        "Sony A7IV",
                        "Profoto",
                        "Premiere Pro"
                    ],
                    "url": "ducphoto.vn"
                }
            ],
            "contact": {
                "email": "duc.photo@gmail.com",
                "phone": "0935 112 889",
                "linkedIn": "linkedin.com/in/duc-photo",
                "portfolio": "ducphoto.vn",
                "website": "ducphoto.vn"
            }
        }
    },
    // ── 40. DATA ANALYST / BI SPECIALIST ───────────────────────────
    {
        "templateId": "modern_it_01",
        "themeConfig": {
            "primaryColor": "#0891b2",
            "secondaryColor": "#164e63",
            "fontFamily": "Inter",
            "layoutMode": "sidebar-left",
            "textColor": "#cffafe",
            "bodyTextColor": "#1e293b"
        },
        "columnLayout": {
            "left": [
                "profile",
                "contact",
                "skills",
                "education"
            ],
            "right": [
                "about",
                "experience",
                "projects",
                "customSections"
            ]
        },
        "cvData": {
            "personal": {
                "fullName": "Lê Ngọc Hân",
                "title": "Senior Data Analyst / BI Specialist",
                "jobTitle": "Senior Data Analyst / BI Specialist",
                "email": "han.bi@tiki.vn",
                "phoneNumber": "0928 334 667",
                "address": "Quận 7, TP. Hồ Chí Minh",
                "avatarUrl": "https://ui-avatars.com/api/?name=Le+Ngoc+Han&background=0891b2&color=ffffff&size=150&bold=true",
                "linkedIn": "linkedin.com/in/han-bi",
                "github": "github.com/han-bi"
            },
            "about": "Data Analyst 5 năm kinh nghiệm xây dựng dashboard và báo cáo BI cho E-commerce và Retail. Thành thạo SQL, Power BI, Tableau và Python. Dashboard phục vụ 200+ stakeholder, giảm thời gian báo cáo thủ công 80%.",
            "experience": [
                {
                    "company": "Tiki Corporation",
                    "position": "Senior Data Analyst",
                    "startDate": "2021-04",
                    "endDate": null,
                    "isCurrent": true,
                    "location": "TP. Hồ Chí Minh",
                    "description": "Xây dựng executive dashboard Power BI cho C-suite. 15 dashboard, 200 users. Tự động hóa báo cáo daily sales, giảm 40 giờ/tuần manual work."
                },
                {
                    "company": "Sendo.vn",
                    "position": "Business Intelligence Analyst",
                    "startDate": "2018-08",
                    "endDate": "2021-03",
                    "isCurrent": false,
                    "location": "TP. Hồ Chí Minh",
                    "description": "ETL pipeline với Airflow, data warehouse Redshift. Cohort analysis tăng retention insight 25%."
                },
                {
                    "company": "KPMG Vietnam",
                    "position": "Junior Analyst",
                    "startDate": "2016-07",
                    "endDate": "2018-07",
                    "isCurrent": false,
                    "location": "TP. Hồ Chí Minh",
                    "description": "Data analysis cho consulting project. Excel advanced, client presentation."
                }
            ],
            "education": [
                {
                    "school": "Đại học Kinh tế TP. HCM (UEH)",
                    "degree": "Cử nhân",
                    "major": "Thống kê – Kinh tế",
                    "startDate": "2012-09",
                    "endDate": "2016-06",
                    "gpa": "3.6 / 4.0"
                }
            ],
            "skills": {
                "displayStyle": "progressbar",
                "items": [
                    {
                        "name": "SQL (PostgreSQL / BigQuery)",
                        "level": 95
                    },
                    {
                        "name": "Power BI / Tableau",
                        "level": 92
                    },
                    {
                        "name": "Python (Pandas)",
                        "level": 85
                    },
                    {
                        "name": "Excel Advanced / VBA",
                        "level": 90
                    },
                    {
                        "name": "ETL / Airflow",
                        "level": 78
                    },
                    {
                        "name": "Data Visualization",
                        "level": 92
                    },
                    {
                        "name": "A/B Testing Analysis",
                        "level": 82
                    },
                    {
                        "name": "Tiếng Anh (IELTS 7.0)",
                        "level": 85
                    }
                ]
            },
            "projects": [
                {
                    "name": "Tiki Executive BI Platform",
                    "description": "Centralized BI platform 15 dashboard, real-time sales tracking. Adopted by CEO và 8 department heads.",
                    "techStack": [
                        "Power BI",
                        "SQL",
                        "Airflow",
                        "BigQuery"
                    ],
                    "url": ""
                }
            ],
            "customSections": [
                {
                    "id": "cs-040",
                    "title": "Chứng chỉ",
                    "icon": "award",
                    "items": [
                        {
                            "id": "ci-040a",
                            "name": "Microsoft Power BI Data Analyst",
                            "subtitle": "Microsoft",
                            "startDate": "2022-05",
                            "endDate": "2022-05",
                            "description": "PL-300 certified"
                        },
                        {
                            "id": "ci-040b",
                            "name": "Google Data Analytics Certificate",
                            "subtitle": "Google / Coursera",
                            "startDate": "2021-08",
                            "endDate": "2021-08",
                            "description": ""
                        }
                    ]
                }
            ],
            "contact": {
                "email": "han.bi@tiki.vn",
                "phone": "0928 334 667",
                "linkedIn": "linkedin.com/in/han-bi",
                "github": "github.com/han-bi"
            }
        }
    }
];

module.exports = SAMPLE_CV_DATA;
