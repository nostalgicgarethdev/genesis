export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production' || process.env.RENDER === 'true'
}

export function sessionCookieOptions(maxAge = 60 * 60 * 24 * 30) {
  const prod = isProduction()
  return {
    httpOnly: true,
    secure: prod,
    sameSite: prod ? ('None' as const) : ('Lax' as const),
    maxAge,
    path: '/',
  }
}

export function oauthCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: isProduction(),
    sameSite: 'Lax' as const,
    maxAge,
    path: '/',
  }
}

export function clearSessionCookieOptions() {
  const prod = isProduction()
  return {
    path: '/',
    secure: prod,
    sameSite: prod ? ('None' as const) : ('Lax' as const),
  }
}