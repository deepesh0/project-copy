"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const db_config_1 = require("./config/db.config");
const error_handler_middleware_1 = __importStar(require("./middlewares/error_handler.middleware"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
//? importing routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const brand_routes_1 = __importDefault(require("./routes/brand.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const wishlist_routes_1 = __importDefault(require("./routes/wishlist.routes"));
const PORT = process.env.PORT || 5000;
// express app instance
const app = (0, express_1.default)();
//* connect database
(0, db_config_1.connect_DB)();
//* using miidleware
app.use((0, cors_1.default)({
    origin: '*'
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: '5mb' }));
app.use('/api/uploads', express_1.default.static('uploads/'));
//* ping route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Server is up & running",
        status: "success",
        success: true,
    });
});
//* using routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/categories', category_routes_1.default);
app.use('/api/brands', brand_routes_1.default);
app.use('/api/products', product_routes_1.default);
app.use('/api/wishlist', wishlist_routes_1.default);
//! handling path not found error
app.use((req, res, next) => {
    const message = `Can not ${req.method} on ${req.originalUrl}`;
    // const error:any = new CustomError(message,400)
    // const error:any = new Error(message)
    // error.status = 'fail'
    // error.statusCode = 400
    // console.log(error)
    next(new error_handler_middleware_1.default(message, 400));
});
app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
});
app.use(error_handler_middleware_1.errorHandler);
