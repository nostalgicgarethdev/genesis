export function isMockAuth(): boolean {
  if (process.env.DEV_MOCK_AUTH === 'true') return true
  const id = process.env.X_CLIENT_ID
  return !id || id === 'your_client_id'
}