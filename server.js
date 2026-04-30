'use strict';
// Local dev server — mirrors the Vercel /api/send-lead function
// Run: node server.js   (requires Node 18+ for built-in fetch)
var express = require('express');
var path    = require('path');
require('dotenv').config();

var app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Rate limiter: max 5 requests per IP per minute
var _rateMap = new Map();
function isRateLimited(ip) {
  var now = Date.now();
  var e   = _rateMap.get(ip) || { n: 0, reset: now + 60000 };
  if (now > e.reset) { e.n = 0; e.reset = now + 60000; }
  e.n++;
  _rateMap.set(ip, e);
  return e.n > 5;
}

app.post('/api/send-lead', async function (req, res) {
  var ip = ((req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0]).trim();
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests, please try again later' });
  }

  var body = req.body || {};
  var n   = (body.name      || '').toString().trim().slice(0, 200);
  var p   = (body.phone     || '').toString().trim().slice(0, 30);
  var ca  = (body.child_age || '').toString().trim().slice(0, 100);
  var loc = (body.location  || '').toString().trim().slice(0, 200);
  var hp  = (body._hp       || '').toString().trim();

  if (hp) return res.status(200).json({ ok: true });

  if (!n) return res.status(400).json({ error: 'Name is required' });
  if (!p || p.replace(/\D/g, '').length < 7) {
    return res.status(400).json({ error: 'Valid phone required' });
  }

  var lines = [
    '🌟 *New Lead — Urjaa Mindz*',
    '',
    '👤 *Name:* '  + n,
    '📱 *Phone:* ' + p,
  ];
  if (ca)  lines.push('👶 *Child Age:* ' + ca);
  if (loc) lines.push('📍 *Location:* '  + loc);
  lines.push('', '_Submitted via website_');

  try {
    var apiRes = await fetch(
      'https://graph.facebook.com/v19.0/' + process.env.PHONE_NUMBER_ID + '/messages',
      {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + process.env.WHATSAPP_TOKEN,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: process.env.OWNER_NUMBER,
          type: 'text',
          text: { body: lines.join('\n') }
        })
      }
    );

    if (!apiRes.ok) {
      var errBody = await apiRes.text();
      console.error('[send-lead] WhatsApp API ' + apiRes.status + ':', errBody);
      return res.status(502).json({ error: 'WhatsApp delivery failed' });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('[send-lead] Exception:', e.message);
    return res.status(500).json({ error: 'Server error' });
  }
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log('Server running on http://localhost:' + PORT);
});
