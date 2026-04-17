'use strict';

const twilio = require('twilio');

const ALERT_TEMPLATES = {
  complaint: (from, msg) =>
    `COMPLAINT — Guest ${from} has raised an issue.\n\nMessage: "${msg}"\n\nPlease respond immediately.`,
  frustration: (from, msg) =>
    `FRUSTRATED GUEST — ${from} is waiting or not receiving help.\n\nMessage: "${msg}"\n\nPlease respond immediately.`,
  'food-order': (from, msg) =>
    `FOOD/DRINK ORDER via WhatsApp — from ${from}.\n\nOrder: "${msg}"\n\nPlease notify kitchen or reception.`,
  escalation: (from, msg) =>
    `UNHANDLED QUERY — ${from} sent a message outside the FAQ.\n\nMessage: "${msg}"\n\nPlease follow up with the guest.`,
};

async function notifyOwner(type, from, message) {
  const buildAlert = ALERT_TEMPLATES[type] || ALERT_TEMPLATES.escalation;
  const alertText = buildAlert(from, message);

  console.log(`[NOTIFY:${type.toUpperCase()}] ${alertText}`);

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_FROM;
  const ownerPhone = process.env.OWNER_PHONE;

  if (!accountSid || !authToken || !fromNumber || !ownerPhone) {
    console.warn('[NOTIFY] Twilio credentials or OWNER_PHONE not configured — alert logged to console only');
    return;
  }

  try {
    const client = twilio(accountSid, authToken);
    await client.messages.create({
      from: `whatsapp:${fromNumber}`,
      to: `whatsapp:${ownerPhone}`,
      body: alertText,
    });
  } catch (err) {
    console.error('[NOTIFY] Failed to send WhatsApp alert:', err.message);
  }
}

module.exports = { notifyOwner };
