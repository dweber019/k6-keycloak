import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 1,
  iterations: 1,
};

export default function () {
  http.get(`${__ENV.K6_HOST}/auth/realms/${__ENV.K6_REALM}/.well-known/openid-configuration`);
  sleep(1);
}