import bcrypt

password = "test123456"
salt = bcrypt.gensalt()
hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
print(f"Original hash length: {len(hashed)}")
print(f"Original hash: {hashed}")

# Truncate to 72 bytes
truncated = hashed[:72]
print(f"Truncated hash length: {len(truncated)}")
print(f"Truncated hash: {truncated}")

# Test verification
try:
    result = bcrypt.checkpw(password.encode('utf-8'), truncated)
    print(f"Verification with truncated: {result}")
except Exception as e:
    print(f"Error with truncated: {e}")

try:
    result = bcrypt.checkpw(password.encode('utf-8'), hashed)
    print(f"Verification with original: {result}")
except Exception as e:
    print(f"Error with original: {e}")
