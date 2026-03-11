-- Update all existing profiles to use the new branding in their status
UPDATE profiles 
SET status = 'Hey there! I am using ForReal.' 
WHERE status = 'Hey there! I am using WhatsApp.';
