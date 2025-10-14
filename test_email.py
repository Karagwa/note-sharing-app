"""
Test script to verify SMTP email configuration
"""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from backend.auth.email import send_password_reset_email, SMTP_USER, SMTP_PASSWORD, SMTP_HOST, SMTP_PORT

print("=" * 60)
print("EMAIL CONFIGURATION TEST")
print("=" * 60)
print(f"\n📧 SMTP Configuration:")
print(f"   Host: {SMTP_HOST}")
print(f"   Port: {SMTP_PORT}")
print(f"   User: {SMTP_USER}")
print(f"   Password: {'*' * len(SMTP_PASSWORD) if SMTP_PASSWORD else 'NOT SET'}")
print()

if not SMTP_USER or not SMTP_PASSWORD:
    print("❌ SMTP credentials not configured!")
    print("\n💡 To fix this:")
    print("   1. Make sure your .env file has SMTP_USER and SMTP_PASSWORD set")
    print("   2. For Gmail, you need an App Password (not your regular password)")
    print("   3. Generate one at: https://myaccount.google.com/apppasswords")
    print("   4. Restart the backend server after updating .env")
    sys.exit(1)

print("✅ SMTP credentials are configured")
print("\n🧪 Testing email send...")
print("   This will attempt to send a test password reset email")

# Test email
test_email = SMTP_USER  # Send to yourself
test_token = "test-token-12345"
test_username = "TestUser"

try:
    success = send_password_reset_email(test_email, test_token, test_username)
    
    if success:
        print("\n✅ SUCCESS! Email sent successfully!")
        print(f"   Check your inbox: {test_email}")
        print("   Also check spam/junk folder if you don't see it")
    else:
        print("\n⚠️  Email sending returned False")
        print("   Check the console output above for errors")
        
except Exception as e:
    print(f"\n❌ ERROR: {str(e)}")
    print("\n💡 Common issues:")
    print("   - Gmail: Make sure 2FA is enabled and you're using an App Password")
    print("   - Gmail: Go to https://myaccount.google.com/apppasswords")
    print("   - Check if 'Less secure app access' is needed (not recommended)")
    print("   - Verify SMTP credentials are correct")
    print("   - Make sure port 587 is not blocked by firewall")

print("\n" + "=" * 60)
