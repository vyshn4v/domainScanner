const REFRESH_TOKEN_KEY = "SSO_REFRESH_TOKEN";
const ACCESS_TOKEN_KEY = "SSO_ACCESS_TOKEN";
let memoryRefreshToken: string | null = null;
let memoryAccessToken: string | null = null;

export function setRefreshToken(token: string) {
  memoryRefreshToken = token;
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function getAccessToken() {
  if (memoryAccessToken) {
    return memoryAccessToken;
  }

  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  memoryAccessToken = token;
  return token;
}

export function clearAuth() {
  memoryAccessToken = null;
  memoryRefreshToken = null;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string) {
  memoryRefreshToken = token;
}

export function getRefreshToken() {
  return memoryRefreshToken ?? localStorage.getItem(REFRESH_TOKEN_KEY);
}
