import 'server-only';

import crypto from 'node:crypto';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'bennet_kamar_admin';
const SESSION_HOURS = 8;

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || 'dev-only-bennet-kamar-session-secret';
}

function sign(payload: string) {
  return crypto.createHmac('sha256', getSecret()).update(payload).digest('hex');
}

export function getAdminCredentials() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    email: process.env.ADMIN_EMAIL || (isProd ? '' : 'bennetkamar71@gmail.com'),
    password: process.env.ADMIN_PASSWORD || (isProd ? '' : 'Omar2026'),
  };
}

export function createAdminSession(email: string) {
  const expiresAt = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ email, expiresAt })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminSession(token?: string | null) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payload, signature] = parts;
  if (!signature || sign(payload) !== signature) return null;

  let parsed: { email?: string; expiresAt?: number };
  try {
    parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
  const email = parsed.email;
  const expiresAt = Number(parsed.expiresAt);
  if (!email || !Number.isFinite(expiresAt) || expiresAt < Date.now()) return null;

  return { email };
}

export function getAdminFromRequest(request: NextRequest) {
  return verifyAdminSession(request.cookies.get(COOKIE_NAME)?.value);
}

export function adminCookie(token: string) {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_HOURS * 60 * 60}`;
}

export function clearAdminCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
