"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const zod_1 = require("zod");
const User_1 = require("../models/User");
const jwt_1 = require("../utils/jwt");
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6)
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6)
});
const register = async (req, res) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: 'Validation failed', errors: parsed.error.flatten() });
        return;
    }
    const { name, email, password } = parsed.data;
    const existingUser = await User_1.User.findOne({ email });
    if (existingUser) {
        res.status(409).json({ message: 'Email already registered' });
        return;
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const user = await User_1.User.create({ name, email, password: hashedPassword });
    const token = (0, jwt_1.signToken)(user.id);
    res.status(201).json({
        message: 'User registered successfully',
        token,
        user: { id: user.id, name: user.name, email: user.email }
    });
};
exports.register = register;
const login = async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: 'Validation failed', errors: parsed.error.flatten() });
        return;
    }
    const { email, password } = parsed.data;
    const user = await User_1.User.findOne({ email });
    if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
    }
    const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
    }
    const token = (0, jwt_1.signToken)(user.id);
    res.status(200).json({
        message: 'Login successful',
        token,
        user: { id: user.id, name: user.name, email: user.email }
    });
};
exports.login = login;
