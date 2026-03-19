const express = require('express');
const twilio = require('twilio');

const app = express();
app.use(express.urlencoded({ extended: false }));

const RATE_CARD_URL = 'https://idan-barn-suites-git-main-skambo-2710s-projects.vercel.app/';
const BOOK_URL = 'https://idan-barn-suites-git-main-skambo-2710s-projects.vercel.app/book';

// ─── Keyword groups ────────────────────────────────────────────────────────────

const KEYWORDS = {
  availability: [
    'available', 'availability', 'vacant', 'free',
    'do you have', 'any rooms', 'is there space',
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december',
    'weekend', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
    'tonight', 'tomorrow', 'next week', 'this week',
    // date patterns like "12th", "23rd", "1st", "2nd"
  ],
  rates: [
    'rate', 'rates', 'price', 'prices', 'cost', 'how much',
    'tariff', 'charges', 'fee', 'fees', 'pricing',
    'per night', 'how much is', 'what does it cost',
  ],
  location: [
    'where', 'location', 'directions', 'address', 'how to get',
    'how do i get', 'map', 'gps', 'naromoru', 'nanyuki',
    'from nairobi', 'how far', 'distance', 'route',
  ],
  food: [
    'food', 'meal', 'meals', 'menu', 'breakfast', 'lunch', 'dinner',
    'café', 'cafe', 'restaurant', 'eat', 'eating', 'dining',
    'vegetarian', 'vegan', 'drinks', 'coffee', 'snack',
  ],
  booking: [
    'book', 'booking', 'reserve', 'reservation', 'confirm',
    'make a booking', 'i want to stay', 'check in', 'check out',
    'checkout', 'checkin',
  ],
  greeting: [
    'hi', 'hello', 'hey', 'hallo', 'habari', 'sasa', 'mambo',
    'good morning', 'good afternoon', 'good evening',
  ],
};

// ─── Reply templates ────────────────────────────────────────────────────────────

const REPLIES = {
  availability: `Hi there! 👋 To check availability for your dates, use our booking page — it shows live availability in real time:

📅 *Check availability & book:*
${BOOK_URL}

You can also call or WhatsApp us directly:
📞 *+254 762 004 417*

We'll confirm within the hour! 🙌`,

  rates: `Hi! Here's everything you need on our rooms and rates:

🏡 *View rooms, rates & packages:*
${RATE_CARD_URL}

Our options include — three bedroom family cottage, deluxe room with balcony suite, twin garden room without balcony, and a penthouse loft — for weekend breaks, workations, and longer stays.

Any specific room type you'd like to know more about? Just reply here! 😊`,

  location: `We're in *Naromoru*, at the foot of Mt. Kenya — about 2.5 hours from Nairobi. 🏔️

📍 *Google Maps:* https://maps.google.com/?q=-0.1463814,37.0200946

*From Nairobi:* Take the A2 highway north through Karatina. Turn right at Naromoru town. We're signposted from the main road.

*GPS coordinates:* -0.1463814, 37.0200946

Questions? Call us: 📞 *+254 762 004 417*`,

  food: `Great news — we have an on-site café! ☕🍳

*Idan Barn Café* serves:
- Full breakfast (included for guests staying 2+ nights)
- Light lunches and snacks
- Coffee, teas, and fresh juices
- Dinner on request (please let us know a day ahead)

We can accommodate dietary requirements — just let us know when booking.

📅 *Book your stay:* ${BOOK_URL}`,

  booking: `Ready to book? Here's how:

📅 *Online booking form:* ${BOOK_URL}

Or just reply here with:
1. Your preferred dates (check-in & check-out)
2. Number of guests
3. Room preference (if any)

...and we'll confirm availability and send you a booking summary! 🏡

📞 You can also reach us at *+254 762 004 417*`,

  welcome: `Hi! 👋 Welcome to *Idan Barn Suites & Café* — boutique lodge at the foot of Mt. Kenya.

🏡 *View our rooms & rates:*
${RATE_CARD_URL}

📅 *Book your stay:*
${BOOK_URL}

Questions about availability, meals, directions, or special requests? Just reply here and we'll get back to you shortly!

_Idan Barn · Naromoru · +254 762 004 417_`,
};

// ─── Intent detection ───────────────────────────────────────────────────────────

function detectIntent(message) {
  const msg = message.toLowerCase();

  // Check for date patterns like "12th March", "23rd", "01/04", "1 april"
  const datePattern = /\b(\d{1,2})(st|nd|rd|th)?\b|\b\d{1,2}[\/\-]\d{1,2}\b/;
  if (datePattern.test(msg)) return 'availability';

  // Check keyword groups in priority order
  const priorityOrder = ['availability', 'booking', 'rates', 'food', 'location', 'greeting'];

  for (const intent of priorityOrder) {
    if (KEYWORDS[intent].some(kw => msg.includes(kw))) {
      return intent;
    }
  }

  return 'welcome'; // fallback
}

// ─── Webhook ────────────────────────────────────────────────────────────────────

app.post('/webhook', (req, res) => {
  const incomingMsg = (req.body.Body || '').trim();
  const from = req.body.From;

  const intent = detectIntent(incomingMsg);
  console.log(`[${new Date().toISOString()}] From: ${from} | Message: "${incomingMsg}" | Intent: ${intent}`);

  const twiml = new twilio.twiml.MessagingResponse();
  const reply = twiml.message();

  // Greetings get the full welcome message
  const replyText = intent === 'greeting' ? REPLIES.welcome : REPLIES[intent];
  reply.body(replyText);

  res.type('text/xml');
  res.send(twiml.toString());
});

// ─── Health check ───────────────────────────────────────────────────────────────

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'idan-barn-bot',
    version: '2.0.0',
    intents: Object.keys(KEYWORDS),
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bot server running on port ${PORT}`);
  console.log(`Keyword detection active for intents: ${Object.keys(KEYWORDS).join(', ')}`);
});
