import nodemailer from 'nodemailer'
import { UserEntity } from '../app/user/user.entity'
import { CustomError } from '../helpers/errors/custom-error'
import { EMAIL_PASSWORD, EMAIL_USER } from '../config/envs.config'

export class SendEmail {
  private transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    service: 'Gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  })

  async registerUser(registerUserDto: UserEntity) {
    try {
      await this.transporter.sendMail({
        from: '"Fred Foo 👻"<wcastroh07@gmail.com>"',
        to: registerUserDto.email,
        subject: 'Bienvenido a la plataforma',
        text: 'Bienvenido a la plataforma',
        html: `
          <h1>Bienvenido a la plataforma</h1>
          <p>Gracias por registrarte en nuestra plataforma</p>
          <p>Por favor completa los datos de tu cuenta haciendo click en el siguiente enlace</p>
          <a href="http://localhost:3000/verify/${registerUserDto.tokenVerif}">Verificar cuenta</a>
          `,
      })
    } catch (error) {
      throw CustomError.internalServer('Error sending email')
    }
  }

  async recoverUser(email: string, tokenVerif: string) {
    try {
      await this.transporter.sendMail({
        from: '"Fred Foo 👻"<wcastroh07@gmail.com>"',
        to: email,
        subject: 'Recuperar cuenta',
        text: 'Recuperar cuenta',
        html: `
          <h1>Recuperar cuenta</h1>
          <p>Por favor restablece tu clave haciendo click en el siguiente enlace</p>
          <a href="http://localhost:3000/recover/${tokenVerif}">Restablece la clave</a>
          `,
      })
    } catch (error) {
      throw CustomError.internalServer('Error sending email')
    }
  }
}
