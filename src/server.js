const app = require('./app');
const { connectDB } = require('./config/database');
require('dotenv').config();

const PORT = process.env.PORT || 8080;

const startServer = async () => {
    // Kết nối Database trước khi start server
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server đang chạy tại cổng http://localhost:${PORT}`);
        console.log(`Swagger UI tại http://localhost:${PORT}/api-docs`);
    });
};

startServer();
