"""
Email service for sending password reset emails and notifications
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
import os
from dotenv import load_dotenv


load_dotenv()


SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SMTP_FROM_EMAIL = os.getenv("SMTP_FROM_EMAIL", SMTP_USER)
SMTP_FROM_NAME = os.getenv("SMTP_FROM_NAME", "Note Sharing App")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")


def send_email(
    to_email: str,
    subject: str,
    html_content: str,
    text_content: Optional[str] = None
) -> bool:
    """
    Send email using SMTP
    
    Args:
        to_email: Recipient email address
        subject: Email subject
        html_content: HTML content of email
        text_content: Plain text content (optional)
    
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    
    
    if not SMTP_USER or not SMTP_PASSWORD:
        print("SMTP not configured. Email would be sent to:", to_email)
        print("Subject:", subject)
        print("Content:", text_content or "HTML content")
        return False
    
    try:
        
        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = f"{SMTP_FROM_NAME} <{SMTP_FROM_EMAIL}>"
        message["To"] = to_email
        
        
        if text_content:
            text_part = MIMEText(text_content, "plain")
            message.attach(text_part)
        
        
        html_part = MIMEText(html_content, "html")
        message.attach(html_part)
        
        
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()  
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(message)
        
        print(f"✅ Email sent successfully to {to_email}")
        return True
        
    except Exception as e:
        print(f"❌ Failed to send email: {str(e)}")
        return False


def send_password_reset_email(email: str, reset_token: str, username: str) -> bool:
    """
    Send password reset email with reset link
    
    Args:
        email: User's email address
        reset_token: Password reset token
        username: User's username
    
    Returns:
        bool: True if email sent successfully
    """
    
    reset_link = f"{FRONTEND_URL}/reset-password?token={reset_token}"
    
    # HTML email template
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .container {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 10px;
                padding: 40px;
                text-align: center;
            }}
            .content {{
                background: white;
                border-radius: 8px;
                padding: 30px;
                margin-top: 20px;
            }}
            .button {{
                display: inline-block;
                padding: 12px 30px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin: 20px 0;
            }}
            .footer {{
                color: #666;
                font-size: 12px;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
            }}
            h1 {{
                color: white;
                margin: 0;
            }}
            .logo {{
                font-size: 48px;
                margin-bottom: 10px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">📝</div>
            <h1>Password Reset Request</h1>
        </div>
        <div class="content">
            <h2>Hello, {username}!</h2>
            <p>We received a request to reset your password for your Note Sharing App account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="{reset_link}" class="button">Reset Password</a>
            <p style="color: #666; font-size: 14px;">
                Or copy and paste this link into your browser:<br>
                <code style="background: #f5f5f5; padding: 8px; display: inline-block; margin-top: 10px; word-break: break-all;">
                    {reset_link}
                </code>
            </p>
            <div class="footer">
                <p><strong>This link will expire in 1 hour.</strong></p>
                <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
                <p style="margin-top: 20px;">
                    Best regards,<br>
                    <strong>Note Sharing App Team</strong>
                </p>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Plain text version (fallback)
    text_content = f"""
    Password Reset Request
    
    Hello, {username}!
    
    We received a request to reset your password for your Note Sharing App account.
    
    Click the link below to reset your password:
    {reset_link}
    
    This link will expire in 1 hour.
    
    If you didn't request a password reset, you can safely ignore this email.
    
    Best regards,
    Note Sharing App Team
    """
    
    subject = "Reset Your Password - Note Sharing App"
    
    return send_email(email, subject, html_content, text_content)


def send_welcome_email(email: str, username: str) -> bool:
    """
    Send welcome email to new users
    
    Args:
        email: User's email address
        username: User's username
    
    Returns:
        bool: True if email sent successfully
    """
    
    # HTML email template
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .container {{
                background: linear-gradient(135deg, #ec4899 0%, #3b82f6 100%);
                border-radius: 10px;
                padding: 40px;
                text-align: center;
            }}
            .content {{
                background: white;
                border-radius: 8px;
                padding: 30px;
                margin-top: 20px;
            }}
            .button {{
                display: inline-block;
                padding: 12px 30px;
                background: linear-gradient(135deg, #ec4899 0%, #3b82f6 100%);
                color: white;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin: 20px 0;
            }}
            h1 {{
                color: white;
                margin: 0;
            }}
            .logo {{
                font-size: 48px;
                margin-bottom: 10px;
            }}
            .feature {{
                margin: 15px 0;
                padding: 10px;
                background: #f9f9f9;
                border-radius: 5px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">🎉</div>
            <h1>Welcome to NoteShare!</h1>
        </div>
        <div class="content">
            <h2>Hello, {username}!</h2>
            <p>Welcome to <strong>NoteShare</strong>! We're excited to have you on board.</p>

            <div class="feature">
                <strong>✨ Create Beautiful Notes</strong><br>
                Write and organize your thoughts with our elegant interface.
            </div>
            
            <div class="feature">
                <strong>🔗 Share Easily</strong><br>
                Generate unique links to share your notes with anyone.
            </div>
            
            <div class="feature">
                <strong>🔒 Secure & Private</strong><br>
                Your notes are protected with industry-standard encryption.
            </div>
            
            <a href="{FRONTEND_URL}" class="button">Get Started</a>
            
            <p style="margin-top: 30px; color: #666;">
                If you have any questions, feel free to reach out to our support team.
            </p>
            
            <p style="margin-top: 20px;">
                Happy note-taking!<br>
                <strong>NoteShare App Team</strong>
            </p>
        </div>
    </body>
    </html>
    """
    
    text_content = f"""
    Welcome to Note Sharing App!
    
    Hello, {username}!
    
    Welcome to Note Sharing App! We're excited to have you on board.
    
    Features:
    - Create Beautiful Notes: Write and organize your thoughts
    - Share Easily: Generate unique links to share your notes
    - Secure & Private: Your notes are protected
    
    Get started: {FRONTEND_URL}
    
    Happy note-taking!
    NoteShare App Team
    """
    
    subject = "Welcome to NoteShare App! 🎉"
    
    return send_email(email, subject, html_content, text_content)
