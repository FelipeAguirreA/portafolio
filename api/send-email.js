// Vercel Serverless Function (ESM: el package.json declara "type": "module").
// El SDK de Resend se importa arriba; la instancia se crea dentro del handler.
import { Resend } from 'resend';

export default async function handler(req, res) {
  // Solo acepta POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validar que la API key esté presente
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY no está configurada');
    return res.status(500).json({ error: 'Configuración del servidor incompleta' });
  }

  const { name, email, subject, message } = req.body || {};

  // Validación básica
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'Portafolio <onboarding@resend.dev>',
      to: 'felipeaguirreee@gmail.com',
      subject: subject || `Nuevo mensaje de ${name}`,
      replyTo: email,
      html: `
        <h2>Nuevo mensaje desde tu portafolio</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Asunto:</strong> ${subject || 'Sin asunto'}</p>
        <hr />
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error enviando email:', error);
    return res.status(500).json({ error: 'Error al enviar el correo', details: error.message });
  }
}
