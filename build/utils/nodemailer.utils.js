"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../config/config");
const error_handler_middleware_1 = __importDefault(require("../middlewares/error_handler.middleware"));
const transporter = nodemailer_1.default.createTransport({
    host: config_1.smtp_config.host,
    port: parseInt(config_1.smtp_config.port),
    secure: parseInt(config_1.smtp_config.port) === 465 ? true : false,
    service: config_1.smtp_config.service,
    auth: {
        user: config_1.smtp_config.user,
        pass: config_1.smtp_config.pass
    }
});
const sendEmail = async ({ html, to, subject, cc, bcc, attachments }) => {
    try {
        const mailOptions = {
            to,
            subject,
            html,
        };
        if (attachments) {
            mailOptions["attachments"] = attachments;
        }
        if (cc) {
            mailOptions["cc"] = cc;
        }
        if (bcc) {
            mailOptions["bcc"] = bcc;
        }
        await transporter.sendMail(mailOptions);
    }
    catch (error) {
        console.log(error);
        throw new error_handler_middleware_1.default('something went wrong', 500);
    }
};
exports.sendEmail = sendEmail;
