import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 587, // Mantendo a porta que estava funcionando
  secure: false,
  auth: {
    user: 'contato@onossoprasempre.com.br',
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false,
  },
  logger: true,
  debug: true,
});

// Testar a conexão
transporter.verify(function (error, success) {
  if (error) {
    console.log('Erro na configuração do email:', error);
  } else {
    console.log('Servidor de email pronto!');
  }
});

export async function sendSuccessEmail(pageData: {
  nome1: string;
  nome2: string;
  slug: string;
  email: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_URL;
  const pageUrl = `${baseUrl}/${pageData.slug}`;

  const mailOptions = {
    from: {
      name: 'O Nosso Pra Sempre',
      address: 'contato@onossoprasempre.com.br',
    },
    to: pageData.email,
    subject: `Sua página foi criada com sucesso! - ${pageData.nome1} e ${pageData.nome2}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Sua página está pronta! 🎉</h1>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h2 style="color: #666; text-align: center;">${pageData.nome1} e ${pageData.nome2}</h2>
          
          <p style="text-align: center; color: #666; margin: 20px 0;">
            Sua página especial foi criada com sucesso! Agora você pode compartilhar esse momento único com quem você ama.
          </p>
          
          <p style="text-align: center; margin: 20px 0;">
            <a href="${pageUrl}" style="background-color: #ff4b91; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Ver Minha Página
            </a>
          </p>

          <div style="text-align: center; margin: 20px 0;">
            <p style="color: #666; margin-bottom: 10px;">Link direto para sua página:</p>
            <p style="background-color: #eee; padding: 10px; border-radius: 5px; word-break: break-all;">
              ${pageUrl}
            </p>
          </div>

          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #666;">
              Compartilhe esse link com seus amigos e familiares para que eles possam acompanhar sua história de amor!
            </p>
          </div>
        </div>

        <p style="color: #999; text-align: center; font-size: 14px;">
          Com carinho,<br>
          Equipe O Nosso Pra Sempre
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email de sucesso enviado para:', pageData.email);
  } catch (error) {
    console.error('Erro ao enviar email:', error);
  }
}
