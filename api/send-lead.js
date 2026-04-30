// Vercel serverless function — POST /api/send-lead
// Sends a WhatsApp notification to the owner for every new lead.
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  var body = req.body || {};
  var n   = (body.name      || '').toString().trim().slice(0, 200);
  var p   = (body.phone     || '').toString().trim().slice(0, 30);
  var ca  = (body.child_age || '').toString().trim().slice(0, 100);
  var loc = (body.location  || '').toString().trim().slice(0, 200);
  var hp  = (body._hp       || '').toString().trim();

  // Honeypot — silently drop bot submissions
  if (hp) return res.status(200).json({ ok: true });

  // Validate
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

  var token    = process.env.WHATSAPP_TOKEN;
  var phoneId  = process.env.PHONE_NUMBER_ID;
  var ownerNum = process.env.OWNER_NUMBER;

  try {
    var apiRes = await fetch(
      'https://graph.facebook.com/v19.0/' + phoneId + '/messages',
      {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: ownerNum,
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
};
