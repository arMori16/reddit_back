import { Injectable } from "@nestjs/common";
import * as nodemailer from 'nodemailer';
import fs from 'fs';
import * as path from'path';
import Handlebars from "handlebars";
import mjml2html from "mjml";

@Injectable()
export class MailService{
    private transporter;
    constructor(){
        this.transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:'barasekson67@gmail.com',
                pass:'bodazopa2020'
            }
        })
    }
    async generateEmail(code:string){
        const mjmlTemplate = fs.readFileSync(path.join(__dirname,'..','..','templates','emailTemplate.mjml'));
        const template = Handlebars.compile(mjmlTemplate);
        const mjmlWithCode = template({code})
        const {html} = mjml2html(mjmlWithCode);
        return html;
    }
    async sendVerificationCode(to:string,code:string){
        const htmlContent = this.generateEmail(code);
        const mailOptions = ({
            from:'"Mori🍃" <barasekson67@gmail.com>',
            to:`${to}`,
            subject:"Verify ✔",
            html:htmlContent
        })
        await this.transporter.sendMail(mailOptions);
    }
}