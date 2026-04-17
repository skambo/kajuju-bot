'use strict';

require('dotenv').config();

const express = require('express');
const twilio = require('twilio');
const OpenAI = require('openai');
const { matchFaq } = require('./faqs');
const { notifyOwner } = require('./notify');

const app = express();
app.use(express.urlencoded({ extended: false }));

let openai;
function getOpenAI() {
  if (!openai) openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return openai;
}

const SYSTEM_PROMPT = `You are a friendly and professional assistant for Idan Barn Suites & Café, a boutique lodge at the base of Mt. Kenya in Naromoru, Kenya.
Answer guest questions helpfully and warmly. Keep responses concise — this is WhatsApp.
If you don't know the answer, say "Thanks for reaching out. We will follow up with you shortly — we appreciate your patience."
Do not make up prices, policies, or availability.
When a guest asks about availability for specific dates, acknowledge the dates they mentioned, let them know you will check and get back to them shortly, and ask how many guests will be staying. Always include the booking link: https://rates.idanbarnsuites.com/book`;

const WELCOME_MESSAGE = `Hi! Welcome to Idan Barn Suites & Cafe — boutique lodge at the foot of Mt. Kenya.

View our rooms & rates:
https://rates.idanbarnsuites.com

Book your stay:
https://rates.idanbarnsuites.com/book

Questions about availability, meals, or special requests? Just reply here and we'll get back to you shortly!

Idan Barn · Naromoru · +254 762 004 417`;

const GROUP_MESSAGE = `Hi there. This number is dedicated to Idan Barn Suites & Cafe guest enquiries and cannot participate in group chats. For reservations or information, please message us directly. Thank you.`;

app.post('/webhook', async (req, res) => {
  const incomingMsg = (req.body.Body || '').trim();
  const from = req.body.From || '';

  console.log(`Incoming from ${from}: ${incomingMsg}`);

  const twiml = new twilio.twiml.MessagingResponse();
  const reply = twiml.message();

  // Group chat detection — reply and log (API does not support programmatic group exit)
  if (from.includes('@g.us') || (req.body.To || '').includes('@g.us')) {
    reply.body(GROUP_MESSAGE);
    console.log(`[GROUP] Replied to group message from ${from}. Manual exit required.`);
    res.type('text/xml');
    return res.send(twiml.toString());
  }

  // Greeting — send welcome
  const isGreeting = /^(hi|hello|hey|hujambo|habari|sasa|good morning|good afternoon|good evening|howdy|greetings)[\s!?.]*$/i.test(incomingMsg);

  if (!incomingMsg || isGreeting) {
    reply.body(WELCOME_MESSAGE);
    res.type('text/xml');
    return res.send(twiml.toString());
  }

  // Scripted FAQ — includes notification trigger for complaint, frustration, food-order
  const faqResult = matchFaq(incomingMsg);
  if (faqResult) {
    reply.body(faqResult.response);
    if (faqResult.notificationType) {
      notifyOwner(faqResult.notificationType, from, incomingMsg).catch(err =>
        console.error('Notify error:', err.message)
      );
    }
    res.type('text/xml');
    return res.send(twiml.toString());
  }

  // GPT-4o fallback — fires for anything outside the FAQ, owner notified
  try {
    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: incomingMsg },
      ],
      max_tokens: 300,
    });

    const aiReply = completion.choices[0]?.message?.content?.trim()
      || "Thanks for reaching out. We will follow up with you shortly — we appreciate your patience.";

    reply.body(aiReply);
    notifyOwner('escalation', from, incomingMsg).catch(err =>
      console.error('Notify error:', err.message)
    );
  } catch (err) {
    console.error('OpenAI error:', err.message);
    reply.body("Thanks for reaching out. We will follow up with you shortly — we appreciate your patience.");
    notifyOwner('escalation', from, incomingMsg).catch(e =>
      console.error('Notify error:', e.message)
    );
  }

  res.type('text/xml');
  res.send(twiml.toString());
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'idan-barn-bot' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bot server running on port ${PORT}`);
});
