import dotenv from 'dotenv'

dotenv.config()

export const JWT_SECRET = process.env.JWT_SECRET || 'secret'
export const PORT = process.env.PORT || 3000

// Email services
export const EMAIL_USER = process.env.EMAIL_USER
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD

export const VIEW_VERIFY = process.env.VIEW_VERIFY
export const VIEW_RECOVER = process.env.VIEW_RECOVER
