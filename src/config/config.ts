

export const db_config = {
    db_name: process.env.DB_NAME || '', 
    db_uri:process.env.DB_URI || ''
}

export const cloudinary_config ={
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    secret_key: process.env.CLOUDINARY_SECRET_KEY
}

export const jwt_config ={
    secret:process.env.JWT_SECRET as string,
    expires_in:process.env.JWT_EXPIRES_IN as string
}

export const smtp_config ={
    host: process.env.SMTP_HOST as string,
    port: process.env.SMTP_PORT as string,
    service: process.env.SMTP_SERVICE as string,
    user: process.env.SMTP_USER as string,
    pass: process.env.SMTP_PASS as string
}
