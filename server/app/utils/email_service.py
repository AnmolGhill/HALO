"""
Email service utility for sending OTP emails
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        self.smtp_server = settings.SMTP_SERVER
        self.smtp_port = settings.SMTP_PORT
        self.smtp_email = settings.SMTP_EMAIL
        self.smtp_password = settings.SMTP_PASSWORD

    async def send_otp_email(self, to_email: str, otp: str) -> bool:
        """
        Send OTP email - matches the Node.js email functionality
        """
        try:
            # Create message
            message = MIMEMultipart()
            message["From"] = self.smtp_email
            message["To"] = to_email
            message["Subject"] = "Your OTP Code - HALO Healthcare"

            # Email body
            body = f"""
            <html>
                <body>
                    <h2>HALO Healthcare - OTP Verification</h2>
                    <p>Your OTP code is: <strong>{otp}</strong></p>
                    <p>This code will expire in 5 minutes.</p>
                    <p>If you didn't request this code, please ignore this email.</p>
                    <br>
                    <p>Best regards,<br>HALO Healthcare Team</p>
                </body>
            </html>
            """
            
            message.attach(MIMEText(body, "html"))

            # Create SMTP session
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()  # Enable security
            server.login(self.smtp_email, self.smtp_password)
            
            # Send email
            text = message.as_string()
            server.sendmail(self.smtp_email, to_email, text)
            server.quit()
            
            logger.info(f"✅ OTP email sent successfully to {to_email}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to send OTP email to {to_email}: {e}")
            return False

# Global email service instance
email_service = EmailService()
