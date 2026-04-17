'use strict';

const FAQS = [
  // ── High-priority: complaint and frustration checked first ──────────────────

  {
    keywords: [
      'i have a complaint', 'lodge a complaint', 'file a complaint', 'formal complaint',
      'terrible experience', 'awful experience', 'bad experience at',
      'deeply disappointed', 'very disappointed', 'extremely disappointed',
      'poor service', 'terrible service', 'awful service', 'service was slow', 'slow service',
      'food was bad', 'food was terrible', 'food was awful', 'food was disappointing', 'bad food',
      'unacceptable', 'this is not okay', 'this is not right',
      'not happy with the room', 'not happy with the service',
      'not happy with the food', 'not happy with my stay',
      'not satisfied with',
      'no hot water', 'hot water not working',
      'broken in my room', 'not working in my room', 'doesn\'t work in my room',
      'staff was rude', 'rude staff',
    ],
    notificationType: 'complaint',
    response: `We are really sorry to hear this — it is not the experience we want for you at all. We are looking into this and will be in touch shortly.`,
  },

  {
    keywords: [
      'still waiting', 'been waiting',
      'no one is responding', 'nobody is responding',
      'why is no one', 'why hasn\'t anyone',
      'been trying to reach', 'not answering',
      'how long does it take', 'when will someone',
      'urgent help needed',
    ],
    notificationType: 'frustration',
    response: `We sincerely apologize — we are looking into this and will get back to you shortly.`,
  },

  // ── Bookings and payments ───────────────────────────────────────────────────

  {
    keywords: [
      'i\'ll take it', 'we\'ll take it', 'let\'s do it', 'lets do it',
      'confirm my booking', 'confirm our booking',
      'lock it in', 'i\'d like to book', 'we\'d like to book',
      'i\'m booking', 'we\'re booking',
      'please confirm our reservation',
      'go ahead with the booking', 'want to go ahead',
    ],
    response: `Thank you — we will share an invoice with you shortly. We look forward to having you over.`,
  },

  {
    keywords: [
      'deposit', 'invoice',
      'payment details', 'how do i pay', 'how do we pay',
      'where do i send', 'mpesa details', 'bank details',
      'till number', 'account number', 'paybill',
    ],
    response: `We are sharing an invoice with you with details of deposit payment.`,
  },

  // ── Existing FAQs ───────────────────────────────────────────────────────────

  {
    keywords: ['cake', 'birthday cake', 'surprise cake', 'order cake'],
    response: `We'd love to arrange a birthday cake surprise!

Notice required: 48 hours minimum
Cost: From KES 1,800 depending on size and flavour
We'll coordinate timing with our kitchen so it's ready at the perfect moment
Please let us know any dietary requirements (e.g. no nuts, gluten free)`,
  },

  {
    keywords: ['decor', 'rose petals', 'candles', 'romantic', 'anniversary', 'surprise setup', 'room decoration'],
    response: `We can set up a beautiful romantic surprise in your room.

Notice required: 24 hours minimum
Cost: KES 3,500
Includes: bed decor, balloons (feel free to request any personalised touch e.g. a bouquet or wine)
Let us know the occasion and we'll make it special`,
  },

  {
    keywords: ['early check in', 'arrive early', 'check in before', 'early arrival'],
    response: `Standard check-in is from 1pm. Early check-in is available subject to room availability on the day.`,
  },

  {
    keywords: ['late check out', 'stay longer', 'check out time', 'extend stay', 'checkout', 'check out'],
    response: `Checkout time at Idan Barn Suites & Cafe is typically at 11:00 AM. If you need a late checkout, let us know and we will check availability.`,
  },

  {
    keywords: ['directions', 'how to get there', 'location', 'where are you', 'find you', 'navigate', 'maps'],
    response: `Here's our Google Maps pin: https://maps.app.goo.gl/aBz2RvSirP1C87jL7

We're in Naromoru, 1km off the Nyeri-Nanyuki Highway.

From Nairobi: roughly 3 hours depending on traffic. From Nanyuki: about 20 minutes.

Any issues finding us, call or WhatsApp us directly: +254 762 004 417`,
  },

  {
    keywords: ['road', 'tarmac', 'dirt road', '4x4', 'saloon car', 'accessible', 'can my car make it', 'all cars', 'gravel', 'small car'],
    response: `We're 1km off the main highway — the last stretch is an all-weather murram road that all cars can navigate comfortably.`,
  },

  {
    keywords: ['parking', 'park my car', 'where to park', 'secure parking'],
    response: `We have free on-site parking — secure and within the property grounds.`,
  },

  {
    keywords: ['workation', 'work from', 'working from', 'remote work', 'work remotely', 'work and stay', 'workcation'],
    response: `Our Workation package is perfect for remote workers!

Fast Starlink WiFi, peaceful surroundings, great coffee, and Mt. Kenya views (when she's not hiding), out the window.

Full details here: https://rates.idanbarnsuites.com/workation

You may share your preferred dates and we'll get back to you`,
  },

  {
    keywords: ['wifi', 'internet', 'connectivity', 'starlink', 'speeds'],
    response: `We run on Starlink — fast, reliable internet throughout the property.

Perfect for remote work, video calls, and everything in between.`,
  },

  {
    keywords: ['pets', 'dog', 'cat', 'bring my pet', 'animal', 'puppy'],
    response: `We love animals! Here's our pet policy:

Pets are not allowed inside the rooms
Pets on a leash are welcome in the restaurant and outdoor areas
Please let us know in advance if you're bringing a pet`,
  },

  {
    keywords: ['cancel', 'cancellation', 'refund', 'change dates', 'cancel booking'],
    response: `Our cancellation policy:

72 hours or more before arrival: full refund
Within 48 hours of arrival: no refund
Date changes are subject to availability — message us and we'll do our best`,
  },

  {
    keywords: ['quiet hours', 'noise', 'music', 'loud', 'generator', 'curfew'],
    response: `Quiet hours are from 9pm to 7am.

We request guests to be mindful of noise during these hours`,
  },

  {
    keywords: ['activities', 'things to do', 'what to do', 'hike', 'horseback', 'excursions', 'birdwatching'],
    response: `There's plenty to keep you busy!

On the property:
- Nature walks and birdwatching
- Cosy fireplace evenings
- Cafe with freshly prepared meals and drinks

Nearby (within 10-30 mins):
- Mt. Kenya National Park — hiking trails, game drives — we're located 20km from the Naro Moru Mt Kenya gate
- Mau Mau caves nature walk starting from Bantu Africa
- Ebike rides
- Horseback riding
- Ol Pejeta Conservancy — rhinos, lions, chimpanzee sanctuary
- Nanyuki town — local market and shopping
- Walks to the nearby River Burguret

Full activities guide: https://rates.idanbarnsuites.com/explore

Let us know if you'd like help arranging any excursions!`,
  },

  {
    keywords: ['group', 'groups', 'team building', 'teambuilding', 'corporate', 'gathering', 'gatherings', 'conference', 'retreat', 'offsite', 'off-site'],
    response: `We'd love to host your group!

Please see below our packages tailored for groups — you can share your group size and dates and we'll put together something great for you.

https://rates.idanbarnsuites.com/gatherings`,
  },

  // ── Food order must come before menu and food entries ───────────────────────

  {
    keywords: [
      'room service', 'order food', 'order drinks', 'order a drink',
      'bring food to', 'bring drinks to', 'send food to', 'send to my room',
      'deliver to my room', 'i\'d like to order', 'we\'d like to order',
      'can we order food', 'can i order food',
    ],
    notificationType: 'food-order',
    response: `Thank you — your order has been sent to the kitchen. You are also welcome to call reception directly to speak with the restaurant team — this is faster for sharing your order.`,
  },

  {
    keywords: ['menu', 'share your menu', 'see the menu', 'view the menu', 'what\'s on the menu', 'food menu', 'what do you serve'],
    response: `Here's our menu: https://rates.idanbarnsuites.com/menu

We serve freshly prepared meals and drinks. Last food orders at 9pm.

Any dietary requirements? Just let us know`,
  },

  {
    keywords: ['food', 'meals', 'breakfast', 'lunch', 'dinner', 'restaurant', 'dining', 'eat', 'half board', 'full board'],
    response: `We have an on-site cafe serving freshly prepared meals and drinks. Last food orders at 9pm.

Meal packages:
- Bed & Breakfast (B&B) — included in Deluxe and Twin Garden room rates
- Half Board — breakfast + lunch or dinner (+KES 2,500/person/day)
- Full Board — all meals (+KES 3,300/person/day)
- Self Catering — kitchen access in Penthouse Loft and Cottage

View our menu: https://rates.idanbarnsuites.com/menu

Let us know your preference when booking`,
  },

  {
    keywords: ['children', 'kids', 'family', 'baby', 'toddler', 'child friendly'],
    response: `We're family-friendly!

Children of all ages are welcome
The Cottage (3-bed, sleeps up to 6) is perfect for families
We can arrange a cot for infants on request
The grounds are safe for kids to explore`,
  },

  {
    keywords: ['pool', 'swimming', 'gym', 'spa', 'facilities'],
    response: `We don't have a swimming pool just yet — but it's in progress and construction is halfway done.`,
  },

  // ── Irrelevant inbounds ─────────────────────────────────────────────────────

  {
    keywords: [
      'job application', 'apply for a job', 'looking for work',
      'open vacancy', 'any vacancies', 'send my cv', 'attach my cv', 'my cv',
      'employment opportunity', 'internship application', 'looking for employment',
    ],
    response: `Thank you for your interest in working with us at Idan Barn Suites & Cafe. Please send your CV and a brief introduction to info@idanbarnsuites.com and our team will be in touch if there is a suitable opening.`,
  },

  {
    keywords: [
      'business proposal', 'partnership proposal',
      'we are a supplier', 'we supply', 'our products', 'our services',
      'marketing services', 'digital marketing', 'seo services',
      'bulk supply', 'wholesale', 'distributor',
    ],
    response: `Thank you for reaching out. This number is dedicated to guest enquiries for Idan Barn Suites & Cafe. For supplier or business enquiries, please email us at info@idanbarnsuites.com and the relevant person will get back to you.`,
  },

  // ── Arrival confirmation ────────────────────────────────────────────────────

  {
    keywords: [
      'on our way', 'on my way to you', 'heading to you', 'heading your way',
      'arriving at', 'arriving around', 'arriving tonight', 'arriving late',
      'arriving tomorrow', 'be there by', 'will be there at',
      'leaving now', 'just left', 'en route', 'estimated arrival', 'my eta',
    ],
    response: `Thanks for the update — we look forward to welcoming you. If you happen to arrive after dark, please look out for our signpost when turning off the highway — it will guide you right to us.`,
  },

  // ── Availability and rates ──────────────────────────────────────────────────

  {
    keywords: [
      'available', 'availability', 'any rooms', 'is there space',
      'do you have rooms', 'free on', 'vacant',
      'book for', 'make a booking',
    ],
    isAvailability: true,
    response: `To check availability and book your dates, head to our booking page:

https://rates.idanbarnsuites.com/book

Or just share your preferred dates and room type here and we'll get back to you!`,
  },

  {
    keywords: ['rates', 'prices', 'how much', 'cost', 'pricing', 'nightly rate', 'weekend rate'],
    response: `Here's our full rate card with all room types and pricing:
https://rates.idanbarnsuites.com

Rates vary by room type and season (weekday / weekend / peak).

Ready to book? Pick your dates here:
https://rates.idanbarnsuites.com/book

Or share your preferred dates and room type and we'll get back to you!`,
  },

  // ── Positive feedback ───────────────────────────────────────────────────────

  {
    keywords: [
      'great service', 'good service', 'amazing service', 'excellent service', 'wonderful service',
      'great stay', 'amazing stay', 'wonderful stay', 'loved our stay', 'loved my stay',
      'loved it', 'we loved', 'highly recommend', 'fantastic', 'brilliant',
      'great experience', 'wonderful experience', 'best place',
      '5 star', 'five star', 'loved the food', 'loved the staff',
    ],
    response: `Thank you so much — that means a lot to us. We hope to welcome you back soon.`,
  },

  // ── Review request ──────────────────────────────────────────────────────────

  {
    keywords: [
      'leave a review', 'write a review', 'review link',
      'google review', 'booking.com review', 'where can i review',
      'how do i leave a review', 'where do i leave a review',
    ],
    response: `Thank you for staying with us at Idan Barn Suites & Cafe. We hope you had a wonderful time and we'd love to see you again.

If you enjoyed your stay, we'd really appreciate it if you could leave us a review — it goes a long way in helping other guests find us.

Google: [GOOGLE_REVIEW_LINK]
Booking.com: [BOOKINGCOM_REVIEW_LINK]

Safe travels and we hope to welcome you back soon.`,
  },
];

const SPECIFIC_DATE_PATTERN = /\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec|\d{1,2}(st|nd|rd|th)|\d{1,2}[\/\-]\d{1,2}|today|tomorrow|tonight|this weekend|next weekend|this week|next week|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i;

function matchFaq(message) {
  const lower = message.toLowerCase();
  const hasSpecificDate = SPECIFIC_DATE_PATTERN.test(lower);

  for (const faq of FAQS) {
    if (faq.keywords.some(kw => lower.includes(kw))) {
      if (faq.isAvailability && hasSpecificDate) return null;
      return {
        response: faq.response,
        notificationType: faq.notificationType || null,
      };
    }
  }
  return null;
}

module.exports = { matchFaq };
