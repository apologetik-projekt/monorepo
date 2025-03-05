export async function consoleMail() {
  return () => ({
    defaultFromAddress: 'noreply@test.com',
    defaultFromName: 'System',
    name: 'nodemailer',
    sendEmail: async (message: unknown) => {
      console.log(message)
      return Promise.resolve()
    },
  })
}
