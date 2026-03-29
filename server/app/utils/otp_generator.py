"""
OTP generation utility - matches the Node.js generateOtp function exactly
"""
import random
from datetime import datetime, timedelta

def generate_otp(length: int = 6) -> str:
    """
    Generate a random OTP of specified length
    Matches the Node.js generateOtp function exactly
    """
    digits = '0123456789'
    otp = ''
    for i in range(length):
        otp += digits[random.randint(0, 9)]
    
    return otp

def get_otp_expiry(minutes: int = 5) -> datetime:
    """
    Get OTP expiry time (default 5 minutes from now)
    Matches the Node.js OTP expiry logic
    """
    return datetime.utcnow() + timedelta(minutes=minutes)

def is_otp_expired(created_at: datetime, expiry_minutes: int = 5) -> bool:
    """
    Check if OTP is expired
    """
    expiry_time = created_at + timedelta(minutes=expiry_minutes)
    return datetime.utcnow() > expiry_time
