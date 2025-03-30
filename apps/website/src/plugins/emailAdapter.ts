import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

export const nodeMailer = nodemailerAdapter({
	skipVerify: true, //process.env.SMTP_SKIP_VERIFY == 'true',
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
