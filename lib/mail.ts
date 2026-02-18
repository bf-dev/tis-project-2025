import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // Use STARTTLS instead of direct TLS
    requireTLS: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
    }
});

export async function sendMail(to: string, subject: string, text: string) {
    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to,
            subject,
            text,
        });

        console.log('Message sent: %s', info.messageId);
        return {
            success: true,
            message: 'Mail sent successfully',
            messageId: info.messageId,
        };
    } catch (error) {
        console.error('Error sending mail:', error);
        return {
            success: false,
            message: 'Failed to send mail',
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
