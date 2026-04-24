/**
 * Danh sách metadata của các Template mẫu CV
 * Sử dụng cho chức năng Filtering Logic (ví dụ: filter theo industry)
 */
const CV_TEMPLATES = [
    {
        templateId: "modern_it_01",
        name: "Template Coder",
        category: "IT",
        thumbnail: "https://pin.it/5Zr0gSKlE",
        defaultConfig: {
            primaryColor: "#111111",
            secondaryColor: "#2d3e50",
            fontFamily: "Inter",
            layoutMode: "sidebar-left"
        }
    },
    {
        templateId: "creative_marketing_01",
        name: "Creative Marketer",
        category: "Marketing",
        thumbnail: "https://res.cloudinary.com/djn694zux/image/upload/v1/recruitment/templates/creative_marketing_01.png",
        defaultConfig: {
            primaryColor: "#FF5722",
            secondaryColor: "#3e2723",
            fontFamily: "Roboto",
            layoutMode: "sidebar-left"
        }
    },
    {
        templateId: "elegant_business_01",
        name: "Business Strategy",
        category: "Business",
        thumbnail: "https://res.cloudinary.com/djn694zux/image/upload/v1/recruitment/templates/elegant_business_01.png",
        defaultConfig: {
            primaryColor: "#3F51B5",
            secondaryColor: "#1a237e",
            fontFamily: "Merriweather",
            layoutMode: "sidebar-left"
        }
    },
    {
        templateId: "minimal_it_02",
        name: "Minimalist Dev",
        category: "IT",
        thumbnail: "https://res.cloudinary.com/djn694zux/image/upload/v1/recruitment/templates/minimal_it_02.png",
        defaultConfig: {
            primaryColor: "#2196F3",
            secondaryColor: "#0d47a1",
            fontFamily: "Fira Code",
            layoutMode: "sidebar-left"
        }
    },
    {
        templateId: "premium_sky_01",
        name: "Modern Sky",
        category: "Professional",
        thumbnail: "https://res.cloudinary.com/djn694zux/image/upload/v1/recruitment/templates/premium_sky_01.png",
        defaultConfig: {
            primaryColor: "#0ea5e9",
            secondaryColor: "#0f172a",
            fontFamily: "Inter",
            layoutMode: "top-header"
        }
    },
    {
        templateId: "premium_luxury_02",
        name: "Luxury Gold",
        category: "Executive",
        thumbnail: "https://res.cloudinary.com/djn694zux/image/upload/v1/recruitment/templates/premium_luxury_02.png",
        defaultConfig: {
            primaryColor: "#d4af37",
            secondaryColor: "#111111",
            fontFamily: "Playfair Display",
            layoutMode: "sidebar-right"
        }
    },
    {
        templateId: "premium_minimal_03",
        name: "Minimalist Clean",
        category: "General",
        thumbnail: "https://res.cloudinary.com/djn694zux/image/upload/v1/recruitment/templates/premium_minimal_03.png",
        defaultConfig: {
            primaryColor: "#000000",
            secondaryColor: "#ffffff",
            fontFamily: "Montserrat",
            layoutMode: "minimal-1-col",
            textColor: "#333333"
        }
    },
    {
        templateId: "premium_tech_04",
        name: "Cyber Terminal",
        category: "IT",
        thumbnail: "https://res.cloudinary.com/djn694zux/image/upload/v1/recruitment/templates/premium_tech_04.png",
        defaultConfig: {
            primaryColor: "#10b981",
            secondaryColor: "#060606",
            fontFamily: "Fira Code",
            layoutMode: "sidebar-left"
        }
    },
    {
        templateId: "premium_creative_05",
        name: "Creative Pulse",
        category: "Marketing",
        thumbnail: "https://res.cloudinary.com/djn694zux/image/upload/v1/recruitment/templates/premium_creative_05.png",
        defaultConfig: {
            primaryColor: "#ec4899",
            secondaryColor: "#4c1d95",
            fontFamily: "Montserrat",
            layoutMode: "top-header"
        }
    },
    {
        templateId: "premium_rose_06",
        name: "Elegant Rose",
        category: "Design",
        thumbnail: "https://res.cloudinary.com/djn694zux/image/upload/v1/recruitment/templates/premium_rose_06.png",
        defaultConfig: {
            primaryColor: "#fb7185",
            secondaryColor: "#4c0519",
            fontFamily: "Lato",
            layoutMode: "sidebar-right"
        }
    },
    {
        templateId: "premium_compact_07",
        name: "Compact Grid",
        category: "General",
        thumbnail: "https://res.cloudinary.com/djn694zux/image/upload/v1/recruitment/templates/premium_compact_07.png",
        defaultConfig: {
            primaryColor: "#6366f1",
            secondaryColor: "#1e1b4b",
            fontFamily: "Inter",
            layoutMode: "sidebar-left"
        }
    },
    {
        templateId: "premium_academic_08",
        name: "Academic Classic",
        category: "Education",
        thumbnail: "https://res.cloudinary.com/djn694zux/image/upload/v1/recruitment/templates/premium_academic_08.png",
        defaultConfig: {
            primaryColor: "#475569",
            secondaryColor: "#f8fafc",
            fontFamily: "Merriweather",
            layoutMode: "minimal-1-col",
            textColor: "#1e293b"
        }
    },
    {
        templateId: "premium_startup_09",
        name: "Startup Neon",
        category: "Professional",
        thumbnail: "https://res.cloudinary.com/djn694zux/image/upload/v1/recruitment/templates/premium_startup_09.png",
        defaultConfig: {
            primaryColor: "#8b5cf6",
            secondaryColor: "#1e1b4b",
            fontFamily: "Montserrat",
            layoutMode: "top-header"
        }
    },
    {
        templateId: "premium_bold_10",
        name: "Executive Bold",
        category: "Management",
        thumbnail: "https://res.cloudinary.com/djn694zux/image/upload/v1/recruitment/templates/premium_bold_10.png",
        defaultConfig: {
            primaryColor: "#ef4444",
            secondaryColor: "#111827",
            fontFamily: "Inter",
            layoutMode: "sidebar-left"
        }
    }
];

module.exports = CV_TEMPLATES;

