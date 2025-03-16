import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

export const consoleMailer = {
	defaultFromAddress: 'noreply@test.com',
	defaultFromName: 'System',
	name: 'nodemailer',
	sendEmail: async (message: unknown) => {
		console.log(message)
		return Promise.resolve()
	},
}

export const nodeMailer = nodemailerAdapter({
	defaultFromAddress: 'DoNotReply@apologetik-projekt.de',
	defaultFromName: 'Apologetik Projekt',
	transportOptions: {
		host: process.env.SMTP_HOST,
		port: 587,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS,
		},
	},
})
