import http from 'k6/http';
import { sleep, check } from 'k6';
import { parseHTML } from 'k6/html';
import { URL } from './modules/url.js';

export let options = {
  vus: 1,
  iterations: 1,
};

export default function () {

  const res = http.get(`${__ENV.K6_HOST}/auth/realms/${__ENV.K6_REALM}/protocol/openid-connect/auth?response_type=code&client_id=${__ENV.K6_CLIENT_ID}&redirect_uri=http%3A%2F%2Flocalhost%3A8080%3Fsso%3Dfalse&login=true&prompt=login&scope=openid`);
  const doc = parseHTML(res.body);
  const actionUrl = doc.find('#kc-form-login').attr('action');

  const loginData = {
    username: __ENV.K6_USERNAME,
    password: __ENV.K6_PASSWORD,
    credentialId: '',
  };
  const resLogin = http.post(actionUrl, loginData, { redirects: 0 });

  const codeRedirectUrl = new URL(resLogin.headers.Location);

  const data = {
    grant_type: 'authorization_code',
    client_id: __ENV.K6_CLIENT_ID,
    code: codeRedirectUrl.searchParams.get('code'),
    redirect_uri: 'http://localhost:8080?sso=false'
  };

  const resToken = http.post(`${__ENV.K6_HOST}/auth/realms/${__ENV.K6_REALM}/protocol/openid-connect/token`, data);

  check(resToken, {
    'is status 200': (r) => r.status === 200,
    'has JWT access token': (r) => r.json().access_token.length > 0,
    'has JWT refresh token': (r) => r.json().refresh_token.length > 0,
  });

  sleep(1);
}