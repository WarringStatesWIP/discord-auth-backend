const express = require('express');
const session = require('express-session');
const axios = require('axios');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 5000;

const CLIENT_ID = "1379639768509583411";
const CLIENT_SECRET = "fdOGqaitO7XZFrxx0n65l-Zx_PfIbIdM";
const REDIRECT_URI = "https://warringstateswip.github.io/Warring-States-RP-Portal/";

const DISCORD_API = "https://discord.com/api";
const GUILD_ID = "1339110153420800071"; // your server
const ROLE_ID = "1339859593320468511"; // ID of the 'Role Player' role

app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));

app.get("/auth/discord", (req, res) => {
  const url = `${DISCORD_API}/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify%20guilds%20guilds.members.read`;
});

app.get("/", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.redirect(REDIRECT_URI + "?access=denied");

  // Exchange code for token
  const tokenRes = await fetch(${DISCORD_API}/oauth2/token, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI
    }),
  });

  const tokenData = await tokenRes.json();
  const userRes = await fetch(${DISCORD_API}/users/@me, {
    headers: { Authorization: Bearer ${tokenData.access_token} },
  });
  const user = await userRes.json();

  const memberRes = await fetch(${DISCORD_API}/users/@me/guilds/${GUILD_ID}/member, {
    headers: { Authorization: Bearer ${tokenData.access_token} },
  });

  if (memberRes.status !== 200) return res.redirect(REDIRECT_URI + "?access=denied");

  const member = await memberRes.json();
  if (member.roles.includes(ROLE_ID)) {
    res.redirect(REDIRECT_URI + "?access=granted");
  } else {
    res.redirect(REDIRECT_URI + "?access=denied");
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(Server running on http://0.0.0.0:${PORT});
});
