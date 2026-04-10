"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    port: process.env.PORT || '5000',
    mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/project-management-tool',
    jwtSecret: process.env.JWT_SECRET || 'supersecretjwtkey',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173'
};
