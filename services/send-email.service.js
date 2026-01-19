const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const { FailedMessageService } = require("../services/failed_message.service");
const { MessageConfigService } = require("../services/message-config.service");

class SendEmailService {
  constructor() {
    this.messageConfigService = new MessageConfigService();
    this.failedService = new FailedMessageService();
    this.currentDate = new Date();
    this.next_retry_at = new Date(this.currentDate);
    this.next_retry_at.setHours(this.next_retry_at.getHours() + 1);
    this.transporter = nodemailer.createTransport({
      port: process.env.NODEMAILER_PORT,
      host: process.env.NODEMAILER_HOST,
      secure: true,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });
  }
  async sendEmail(message) {
    const { recipient, message_content } = message;

    try {
      await this.transporter.verify();
      const templatePath = path.join(
        __dirname,
        "..",
        "/templates/",
        "mail_template.html",
      );
      let emailTemplate = fs.readFileSync(templatePath, "utf8");

      emailTemplate = emailTemplate.replace(
        "{{MENSAJE_PROGRAMADO}}",
        message_content,
      );
      console.log("Conexión exitosa con el servidor SMTP");
      // Enviar el correo de forma asincrónica
      const info = await this.transporter.sendMail({
        from: process.env.NODEMAILER_FROM, // Dirección del remitente
        to: recipient, // Dirección de destino
        subject: "PMMS - Pocho`s Messages Managment System", // Asunto del correo
        text: message_content.toString(), // Mensaje en texto plano
        html: emailTemplate,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = { SendEmailService };
