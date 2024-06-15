import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); 
const sequelize = new Sequelize(
    process.env.DATABASE_NAME, // Tên cơ sở dữ liệu
    process.env.DATABASE_USER, // Tên người dùng
    process.env.DATABASE_PASSWORD, // Mật khẩu
    {
        host: process.env.DATABASE_HOST, // Địa chỉ máy chủ
        port: process.env.DATABASE_PORT, // Cổng cơ sở dữ liệu (nếu không có, MySQL sử dụng cổng mặc định là 3306)
        dialect: 'mysql', // Loại cơ sở dữ liệu bạn đang sử dụng (MySQL)
        logging: false, // Có thể đặt thành true để xem thông tin truy vấn (debugging)
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
    },
);  
export default sequelize; 
