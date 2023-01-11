/*
  Provide okapi token, if it exist, as request header
  until refresh token rotation (RTR) flow finally completed.
*/
export const getLegacyTokenHeader = (okapi = {}) => {
  return okapi.token ? { 'X-Okapi-Token': okapi.token } : {};
};
