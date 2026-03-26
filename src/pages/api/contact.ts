import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, phone, email, service, date } = body;

    if (!name || !phone) {
      return new Response(JSON.stringify({ error: 'Nom et téléphone requis.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const gmailUser = import.meta.env.GMAIL_USER || process.env.GMAIL_USER || 'Cabinetdentairechorfi@gmail.com';
    const gmailAppPassword = import.meta.env.GMAIL_APP_PASSWORD || process.env.GMAIL_APP_PASSWORD || '';

    if (!gmailAppPassword) {
      console.error('GMAIL_APP_PASSWORD is not set');
      return new Response(JSON.stringify({ error: 'Configuration email manquante.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });

    await transporter.sendMail({
      from: `Cabinet Dentaire Chorfi <${gmailUser}>`,
      to: 'Cabinetdentairechorfi@gmail.com',
      subject: `Nouveau RDV — ${name}`,
      html: `
        <h2>Nouvelle demande de rendez-vous</h2>
        <table style="border-collapse:collapse;font-family:sans-serif;">
          <tr><td style="padding:8px;font-weight:bold;">Nom</td><td style="padding:8px;">${name}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Téléphone</td><td style="padding:8px;">${phone}</td></tr>
          ${email ? `<tr><td style="padding:8px;font-weight:bold;">Email</td><td style="padding:8px;">${email}</td></tr>` : ''}
          ${service ? `<tr><td style="padding:8px;font-weight:bold;">Service</td><td style="padding:8px;">${service}</td></tr>` : ''}
          ${date ? `<tr><td style="padding:8px;font-weight:bold;">Date souhaitée</td><td style="padding:8px;">${date}</td></tr>` : ''}
        </table>
      `,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Contact form error:', error?.message || error);
    return new Response(JSON.stringify({ error: "Erreur lors de l'envoi." }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
