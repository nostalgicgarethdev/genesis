const X_TWEETS_URL = 'https://api.twitter.com/2/users'

export async function findVerificationTweet(
  userId: string,
  accessToken: string,
  code: string,
): Promise<boolean> {
  const url = `${X_TWEETS_URL}/${userId}/tweets?max_results=10&tweet.fields=text,created_at`

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!res.ok) {
    console.error('Tweet fetch failed:', await res.text())
    return false
  }

  const body = (await res.json()) as {
    data?: Array<{ text: string }>
  }

  if (!body.data?.length) return false

  return body.data.some((tweet) => tweet.text.includes(code))
}