"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const env_1 = require("./config/env");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: env_1.env.clientUrl, credentials: true }));
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.get('/api/health', (_req, res) => {
    res.status(200).json({ message: 'API is running' });
});
app.use('/api/auth', authRoutes_1.default);
app.use('/api/projects', projectRoutes_1.default);
app.use('/api/tasks', taskRoutes_1.default);
app.use(errorMiddleware_1.notFound);
app.use(errorMiddleware_1.errorHandler);
exports.default = app;
