import { request } from "https";

const makeReq = (function() {
  const format = {
    hostname: 'perspectiveapi.com',
    path: '/plugin/check',
    "headers": {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
      "accept": "*/*",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "max-age=0",
      "content-type": "application/json",
      "sec-ch-ua": "\"Not A(Brand\";v=\"99\", \"Google Chrome\";v=\"121\", \"Chromium\";v=\"121\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin"
    },
    "method": "POST"
  };
  const body = {
    "action": "check",
    "modelName": "TOXICITY",
    "sessionId": "1544459670500",
    "recaptchaToken": "03AFcWeA4cdOlelexo5u1lQr-GOYKtGuxEt2oSaRKUWLLZF99uqcq9ouxQAwq_vcHSMtuNP29DF37cvKnBYiO_YBMH2h-rlim5BXCfolEHQX6_NimsRtAhRYhp5DCeLh5IE-J9c9Zn0FE6CCSDW9DgPghw0nNAtXZJkziSPwmH9OYPZUzTLe1bCTAjqWXAPtuDEpJSHksluGagJkNqvceeSlmH2nVFYjNO2u3EaBvt8yWg_uBgEiu9G6mS7JBSUqjxKpNf1Q5I-i24ezxJTCNMAvUaKPcOm0OF0V5xItGFmhvlyMc5lHnu3wQ_VzAwJb48zEzpPclpN-2sb6OzA0xfSED7ohDCdAHJalnRcqmFJPjD6PnFFvb4H8rz_KiFDkQhjbIMi7QhSiCazJ23Xq-1f1Xe-r8d9hOJJdBAbO08bBy92qbEtWsEiCcxtFzCKezNqOWeysTJC_33HcmK2RYMwq9jvoCdnlw4gLewJnZHn8LjPR4y7EqlzgSClSl0VAfEHTiuTfKv4DXxBSYQcFzJ-gro81RiSE0jAkNUAjxEOXMo2kPgejeIDFoQaxcvx2tGxYTBkqR2lvrA-CJ3S_jokOIt8Y26972lzA"
  };
  return function(txt) {
    return new Promise((res, rej) => {
      const req = request(format, r => {
        if (r.statusCode !== 200) return rej(`found ${r.statusCode} not 200`);
        const chunks = [];
        r.on('data', c => chunks.push(c));
        r.once('close', () => res(JSON.parse(Buffer.concat(chunks)).attributeScores.TOXICITY.summaryScore.value));
      });
      req.once('error', rej);
      req.end(JSON.stringify(Object.assign({ comment: txt }, body)));
    });
  };
}());

const pause = function(ms) {
  return new Promise(res => setTimeout(() => res(), ms));
};
const time2Str = function(t) {
  if (t < 60) return t.toFixed(1) + ' secs';
  t /= 60;
  if (t < 60) return t.toFixed(1) + ' mins';
  t /= 60;
  if (t < 24) return t.toFixed(1) + ' hours';
  t /= 24;
  if (t < 365) return t.toFixed(1) + ' days';
  t /= 365;
  return toCommaNumber(t.toFixed(1)) + ' years';
};

(async function() {
  const msgs = [
    'yo mama',
    'cake is a lie',
    'i am a racist',
    'die potato die, i baked you a pie',
    'oh boy what flavor',
    'pie pie pie pie',
    'die die die die',
    'i have a gun',
    'i have guns'
  ];
  const start = Date.now();
  while (true) {
    try {
      const msg = msgs[~~(Math.random() * msgs.length)];
      const score = await makeReq(msg);
      console.log(new Date().toISOString(), msg, score);
    } catch (e) {
      console.log('broken in', time2Str((Date.now() - start) / 1000));
      console.log(e);
      break;
    }
    await pause(30_000);
  }
}());