import nodemailer from 'nodemailer'
export const sendEmail = async (from: string, to: string, subject:string, html:string)=>{
   const transporter= nodemailer.createTransport({
      host: "live.smtp.mailtrap.io",
      port: 587,
      auth: {
        user: process.env.NODEMAILER_USERNAME,
        pass: process.env.NODEMAILER_PASSWORD
      }
    });
   const mailOptions ={
      from,
      to,
      subject,
      html,
   }
   transporter.sendMail(mailOptions, (err, info)=>{
      if(err){
         console.log(err);
      } else {
         console.log('Email sent' + info.response);
      }
   })
}
