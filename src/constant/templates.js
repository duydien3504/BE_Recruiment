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
            fontFamily: "Inter"
        }
    },
    {
        templateId: "creative_marketing_01",
        name: "Creative Marketer",
        category: "Marketing",
        thumbnail: "https://res.cloudinary.com/djn694zux/image/upload/v1/recruitment/templates/creative_marketing_01.png",
        defaultConfig: {
            primaryColor: "#FF5722",
            fontFamily: "Roboto"
        }
    },
    {
        templateId: "elegant_business_01",
        name: "Business Strategy",
        category: "Business",
        thumbnail: "https://res.cloudinary.com/djn694zux/image/upload/v1/recruitment/templates/elegant_business_01.png",
        defaultConfig: {
            primaryColor: "#3F51B5",
            fontFamily: "Merriweather"
        }
    },
    {
        templateId: "minimal_it_02",
        name: "Minimalist Dev",
        category: "IT",
        thumbnail: "https://res.cloudinary.com/djn694zux/image/upload/v1/recruitment/templates/minimal_it_02.png",
        defaultConfig: {
            primaryColor: "#2196F3",
            fontFamily: "Fira Code"
        }
    }
];

module.exports = CV_TEMPLATES;
