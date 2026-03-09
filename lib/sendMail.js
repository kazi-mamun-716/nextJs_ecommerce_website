import nodemailer from "nodemailer";
export const sendMail = async (receiver, subject, body) => {
    const transporter = nodemailer.createTransport({
        host: process.env.NODEMAILER_HOST,
        port: process.env.NODEMAILER_PORT,
        secure: false,
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASSWORD
        }
    });
    const mailOptions = {
        from: `Ecommerce App <${process.env.NODEMAILER_USER}>`,
        to: receiver,
        subject,
        html: body
    };
    try {
        await transporter.sendMail(mailOptions);
        return { success: true, message: "Email sent successfully" };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, message: "Failed to send email" };
    }
};