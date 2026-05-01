'use strict';
module.exports = function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  var body = req.body || {};
  var u = (body.username || '').toString().trim();
  var p = (body.password || '').toString().trim();
  if (!u || !p) return res.status(400).json({ ok: false });
  if (u === process.env.ADMIN_USERNAME && p === process.env.ADMIN_PASSWORD) {
    return res.status(200).json({ ok: true });
  }
  return res.status(401).json({ ok: false });
};
