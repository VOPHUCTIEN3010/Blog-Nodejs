// import sequelize from '../config/connectDB.js';
// import { DataTypes } from 'sequelize';

// const User = sequelize.define(
//     'User',
//     {
//         fullname: {
//             type: 'string',
//             required: [true, 'Please provide fullname'],
//         },
//         email: {
//             type: String,
//             required: [true, 'Please provide email'],
//             validate: {
//                 validator: validator.isEmail,
//                 message: 'Please provide a valid email',
//             },
//             unique: true,
//         },
//         password: {
//             type: String,
//             required: [true, 'Please provide password'],
//             minlength: 6,
//             select: false,
//         },
//         phone: {
//             type: String,
//             required: [true, 'Please provide phone'],
//             trim: true,
//             minlength: 10,
//             maxlength: 11,
//         },
//         birthday: {
//             type: Date,
//         },
//         sex: {
//             type: Number,
//             maxlength: 1,
//         },
//         avatar: {
//             type: String,
//         },
//         type: {
//             type: Number,
//             default: 1,
//             maxlength: 1,
//         },
//         status: {
//             type: Number,
//             default: 1,
//             maxlength: 1,
//         },
//     }, { timestamps: true }
// );

// export default User;