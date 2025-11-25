import nodemailer from 'nodemailer'
import { smtp_config } from '../config/config'

import CustomError from '../middlewares/error_handler.middleware';



const transporter = nodemailer.createTransport({
    host:smtp_config.host,
    port:parseInt(smtp_config.port),
    secure:parseInt(smtp_config.port) === 465 ? true :false,
    service:smtp_config.service,
    auth:{
        user:smtp_config.user,
        pass:smtp_config.pass
    }
})
interface IEmailOptions {
    to: string | string[]
    subject: string
    html: string
    attachments?: any;
    cc? :string | string[] | null
    bcc? :string | string[] | null
}

export const sendEmail = async(
    {
        html,
        to, 
        subject, cc, bcc,attachments

    }
    :IEmailOptions) =>{
    try {
        const mailOptions :any = {
            to,
            subject,
            html,
        }
        if (attachments){
            mailOptions["attachments"] =attachments
        }
        if(cc){
            mailOptions["cc"] = cc
        }
        if(bcc){
            mailOptions["bcc"] = bcc
        }

        await transporter.sendMail(mailOptions)
            

        
    } catch (error) {
        console.log(error)
        throw new CustomError('something went wrong',500)
        
    }
}