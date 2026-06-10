const express = require('express');
const cors    = require('cors');
const crypto  = require('crypto');
const { Resend } = require('resend');

const app    = express();
const resend = new Resend('re_HWgG51B9_M7LGpU3m9QXSE3xaTP1jDJRf');
const FROM   = 'IronCrew <noreply@ironcrew.fit>';

const sha256 = (str) => crypto.createHash('sha256').update(str).digest('hex');

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ status: 'IronCrew Email Server running' });
});

// ── Email de bienvenue ────────────────────────────────────────────────────────
app.post('/send-welcome', async (req, res) => {
  const { email, userName } = req.body;
  if (!email || !userName) return res.status(400).json({ error: 'Missing fields' });

  const recipient = process.env.NODE_ENV === 'production' ? email : 'martinbouillot15@gmail.com';

  try {
    await resend.emails.send({
      from: FROM,
      to: recipient,
      subject: '💪 Bienvenue sur IronCrew !',
      html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#000000;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:40px 20px">
<table width="480" cellpadding="0" cellspacing="0"
  style="background:#0d0d0d;border-radius:16px;overflow:hidden">

<tr>
  <td style="background:linear-gradient(135deg,#7c4dff,#4a00e0);padding:40px;text-align:center">
    <h1 style="color:#fff;font-size:36px;font-weight:900;margin:0;letter-spacing:-1px">
      IRON<span style="opacity:0.7">CREW</span>
    </h1>
    <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:8px 0 0">ironcrew.fit</p>
  </td>
</tr>

<tr>
  <td style="padding:40px">
    <h2 style="color:#fff;font-size:26px;font-weight:700;margin:0 0 12px">
      Bienvenue ${userName} 💪
    </h2>
    <p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;margin:0 0 28px">
      Ton compte IronCrew est créé. Tu rejoins maintenant
      une communauté de sportifs qui ne font pas semblant.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0"
      style="background:#111;border-radius:12px;padding:20px;margin-bottom:28px">
      <tr><td style="padding:10px 0;border-bottom:1px solid #1a1a1a">
        <span style="font-size:20px">🏋️</span>
        <span style="color:#fff;font-size:14px;margin-left:12px">8 programmes de musculation complets</span>
      </td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #1a1a1a">
        <span style="font-size:20px">⚔️</span>
        <span style="color:#fff;font-size:14px;margin-left:12px">Iron Ladder — le classement compétitif</span>
      </td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #1a1a1a">
        <span style="font-size:20px">🍽️</span>
        <span style="color:#fff;font-size:14px;margin-left:12px">100 recettes sportives avec photos</span>
      </td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #1a1a1a">
        <span style="font-size:20px">🎯</span>
        <span style="color:#fff;font-size:14px;margin-left:12px">Défis journaliers + badges exclusifs</span>
      </td></tr>
      <tr><td style="padding:10px 0">
        <span style="font-size:20px">💎</span>
        <span style="color:#fff;font-size:14px;margin-left:12px">Wall of Iron — prouve que tu es le meilleur</span>
      </td></tr>
    </table>

    <table width="100%"><tr><td align="center">
      <a href="https://ironcrew.fit"
        style="display:inline-block;background:linear-gradient(135deg,#7c4dff,#4a00e0);
               color:#fff;font-size:16px;font-weight:700;text-decoration:none;
               padding:16px 48px;border-radius:12px;letter-spacing:0.5px">
        Ouvrir IronCrew →
      </a>
    </td></tr></table>

    <p style="color:rgba(255,255,255,0.2);font-size:12px;text-align:center;margin:24px 0 0;line-height:1.6">
      Des questions ?
      <a href="mailto:support@ironcrew.fit" style="color:#7c4dff">support@ironcrew.fit</a>
    </p>
  </td>
</tr>

<tr>
  <td style="background:#080808;padding:20px;text-align:center;border-top:1px solid #1a1a1a">
    <p style="color:rgba(255,255,255,0.2);font-size:11px;margin:0">
      © 2025 IronCrew · ironcrew.fit
    </p>
  </td>
</tr>

</table>
</td></tr>
</table>
</body>
</html>`,
    });
    res.json({ success: true });
  } catch (error) {
    console.error('send-welcome error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ── Email de vérification ────────────────────────────────────────────────────
app.post('/send-verification', async (req, res) => {
  const { email, userName, verificationLink } = req.body;
  if (!email) return res.status(400).json({ error: 'Missing email' });

  const recipient = process.env.NODE_ENV === 'production' ? email : 'martinbouillot15@gmail.com';

  try {
    await resend.emails.send({
      from: FROM,
      to: recipient,
      subject: '✅ Confirme ton compte IronCrew',
      html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#000;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:40px 20px">
<table width="480" cellpadding="0" cellspacing="0"
  style="background:#0d0d0d;border-radius:16px;overflow:hidden">

<tr>
  <td style="background:linear-gradient(135deg,#7c4dff,#4a00e0);padding:40px;text-align:center">
    <h1 style="color:#fff;font-size:36px;font-weight:900;margin:0;letter-spacing:-1px">
      IRON<span style="opacity:0.7">CREW</span>
    </h1>
  </td>
</tr>

<tr>
  <td style="padding:40px">
    <h2 style="color:#fff;font-size:24px;font-weight:700;margin:0 0 12px">
      Confirme ton email ${userName || ''} 🔐
    </h2>
    <p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;margin:0 0 28px">
      Clique sur le bouton ci-dessous pour confirmer ton adresse email
      et accéder à toutes les fonctionnalités IronCrew. Le lien expire dans 24h.
    </p>
    <table width="100%"><tr><td align="center">
      <a href="${verificationLink}"
        style="display:inline-block;background:linear-gradient(135deg,#7c4dff,#4a00e0);
               color:#fff;font-size:16px;font-weight:700;text-decoration:none;
               padding:16px 48px;border-radius:12px">
        Confirmer mon compte →
      </a>
    </td></tr></table>
    <p style="color:rgba(255,255,255,0.2);font-size:12px;text-align:center;margin:24px 0 0;line-height:1.6">
      Si tu n'as pas créé de compte IronCrew, ignore cet email.
    </p>
  </td>
</tr>

<tr>
  <td style="background:#080808;padding:20px;text-align:center;border-top:1px solid #1a1a1a">
    <p style="color:rgba(255,255,255,0.2);font-size:11px;margin:0">© 2025 IronCrew · ironcrew.fit</p>
  </td>
</tr>

</table>
</td></tr>
</table>
</body>
</html>`,
    });
    res.json({ success: true });
  } catch (error) {
    console.error('send-verification error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ── Email reset mot de passe ──────────────────────────────────────────────────
app.post('/send-reset', async (req, res) => {
  const { email, resetLink } = req.body;
  if (!email) return res.status(400).json({ error: 'Missing email' });

  const recipient = process.env.NODE_ENV === 'production' ? email : 'martinbouillot15@gmail.com';
  const link = resetLink || 'https://ironcrew.fit';

  try {
    await resend.emails.send({
      from: FROM,
      to: recipient,
      subject: '🔐 Réinitialise ton mot de passe IronCrew',
      html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#000;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:40px 20px">
<table width="480" cellpadding="0" cellspacing="0"
  style="background:#0d0d0d;border-radius:16px;overflow:hidden">

<tr>
  <td style="background:linear-gradient(135deg,#ff4444,#cc0000);padding:40px;text-align:center">
    <h1 style="color:#fff;font-size:36px;font-weight:900;margin:0;letter-spacing:-1px">
      IRON<span style="opacity:0.7">CREW</span>
    </h1>
  </td>
</tr>

<tr>
  <td style="padding:40px">
    <h2 style="color:#fff;font-size:22px;font-weight:700;margin:0 0 12px">
      Réinitialise ton mot de passe 🔐
    </h2>
    <p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;margin:0 0 28px">
      Tu as demandé à réinitialiser ton mot de passe IronCrew.
      Clique sur le bouton ci-dessous. Le lien expire dans 1 heure.
    </p>
    <table width="100%"><tr><td align="center">
      <a href="${link}"
        style="display:inline-block;background:#ff4444;
               color:#fff;font-size:15px;font-weight:700;
               text-decoration:none;padding:14px 40px;border-radius:12px">
        Réinitialiser mon mot de passe →
      </a>
    </td></tr></table>
    <p style="color:rgba(255,255,255,0.2);font-size:12px;text-align:center;margin:24px 0 0">
      Si tu n'as pas demandé ça, ignore cet email.
    </p>
  </td>
</tr>

<tr>
  <td style="background:#080808;padding:20px;text-align:center;border-top:1px solid #1a1a1a">
    <p style="color:rgba(255,255,255,0.2);font-size:11px;margin:0">© 2025 IronCrew · ironcrew.fit</p>
  </td>
</tr>

</table>
</td></tr>
</table>
</body>
</html>`,
    });
    res.json({ success: true });
  } catch (error) {
    console.error('send-reset error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ── OTP : génère, hashe, envoie par email ─────────────────────────────────────
app.post('/send-otp', async (req, res) => {
  const { email, userName } = req.body;
  if (!email) return res.status(400).json({ error: 'Missing email' });

  const code     = Math.floor(100000 + Math.random() * 900000).toString();
  const codeHash = sha256(code);

  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: '🔐 Ton code de vérification IronCrew',
      html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#000;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:40px 20px">
<table width="480" cellpadding="0" cellspacing="0"
  style="background:#0d0d0d;border-radius:16px;overflow:hidden">
<tr>
  <td style="background:linear-gradient(135deg,#7c4dff,#4a00e0);padding:40px;text-align:center">
    <h1 style="color:#fff;font-size:36px;font-weight:900;margin:0;letter-spacing:-1px">
      IRON<span style="opacity:0.7">CREW</span>
    </h1>
  </td>
</tr>
<tr>
  <td style="padding:40px;text-align:center">
    <h2 style="color:#fff;font-size:22px;font-weight:700;margin:0 0 8px">
      Bonjour ${userName || ''} 👋
    </h2>
    <p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;margin:0 0 32px">
      Voici ton code de vérification IronCrew.
      Il expire dans <strong style="color:#fff">10 minutes</strong>.
    </p>
    <div style="background:#111;border-radius:16px;padding:32px 0;margin-bottom:32px">
      <p style="color:rgba(255,255,255,0.4);font-size:13px;margin:0 0 12px;letter-spacing:2px;text-transform:uppercase">
        Code de vérification
      </p>
      <p style="color:#7c4dff;font-size:48px;font-weight:900;margin:0;letter-spacing:12px">
        ${code}
      </p>
    </div>
    <p style="color:rgba(255,255,255,0.2);font-size:12px;line-height:1.6">
      Si tu n'as pas demandé ce code, ignore cet email.
    </p>
  </td>
</tr>
<tr>
  <td style="background:#080808;padding:20px;text-align:center;border-top:1px solid #1a1a1a">
    <p style="color:rgba(255,255,255,0.2);font-size:11px;margin:0">© 2025 IronCrew · ironcrew.fit</p>
  </td>
</tr>
</table>
</td></tr>
</table>
</body>
</html>`,
    });

    // Retourne UNIQUEMENT le hash — le code en clair n'est jamais envoyé au client
    res.json({ success: true, codeHash });
  } catch (error) {
    console.error('send-otp error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ── Proxy ExerciseDB GIF ──────────────────────────────────────────────────────
app.get('/exercise-gif/:name', async (req, res) => {
  const exerciseName = req.params.name;
  try {
    const response = await fetch(
      `https://exercisedb.p.rapidapi.com/exercises/name/${encodeURIComponent(exerciseName)}?limit=1`,
      {
        headers: {
          'x-rapidapi-key':  '8a1113c1dfmsh95a13099d391aa3p1e758djsnfaeb135e18fc',
          'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
        },
      },
    );
    const data = await response.json();
    if (data && data.length > 0 && data[0].gifUrl) {
      res.json({ gifUrl: data[0].gifUrl, success: true });
    } else {
      res.json({ gifUrl: null, success: false });
    }
  } catch (e) {
    res.json({ gifUrl: null, success: false, error: e.message });
  }
});

// ── OTP : vérifie le code entré par l'utilisateur ────────────────────────────
app.post('/verify-otp', (req, res) => {
  const { enteredCode, codeHash } = req.body;
  if (!enteredCode || !codeHash) return res.status(400).json({ error: 'Missing fields' });
  res.json({ valid: sha256(enteredCode.trim()) === codeHash });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`IronCrew Email Server running on port ${PORT}`);
});
