const Brevo = require('@getbrevo/brevo')

const { env } = require('~/config/environment')

let apiInstance = new Brevo.TransactionalEmailsApi()
let apiKey = apiInstance.authentications['apiKey']


apiKey.apiKey = env.BREVO_API_KEY

const sendEmail = async (recipientEmail, customSubject, htmlContent) => {
    let sendSmtpEmail = new Brevo.SendSmtpEmail()

    sendSmtpEmail.sender = { 'email': env.ADMIN_EMAIL_ADDRESS, 'name': env.ADMIN_EMAIL_NAME }
    sendSmtpEmail.to = [
        { 'email': recipientEmail }
    ]
    sendSmtpEmail.subject = customSubject // Tiêu đề email
    sendSmtpEmail.htmlContent = htmlContent

    // Gửi email

    return apiInstance.sendTransacEmail(sendSmtpEmail)
}

export const BrevoProvider = {
    sendEmail
}