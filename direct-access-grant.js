import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  vus: 1,
  iterations: 1,
};

export default function () {

  const data = {
    grant_type: 'password',
    client_id: __ENV.K6_CLIENT_ID,
    username: __ENV.K6_USERNAME,
    password: __ENV.K6_PASSWORD,
  };

  const res = http.post(`${__ENV.K6_HOST}/auth/realms/${__ENV.K6_REALM}/protocol/openid-connect/token`, data);

  check(res, {
    'is status 200': (r) => r.status === 200,
    'has JWT access token': (r) => r.json().access_token.length > 0,
    'has JWT refresh token': (r) => r.json().refresh_token.length > 0,
  });

  sleep(1);
}