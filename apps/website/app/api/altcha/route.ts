import { NextRequest, NextResponse } from 'next/server'
import { createChallenge, verifySolution } from 'altcha-lib'

const hmacKey = process.env.ALTCHA_HMAC_KEY ?? ''
export async function GET() {
  const challenge = await createChallenge({ hmacKey })
  return NextResponse.json(challenge)
}

export async function POST(request: NextRequest) {
  const { payload } = await request.json()
  const verified = await verifySolution(payload, hmacKey)
  return NextResponse.json({ verified }, { status: verified ? 200 : 400 })
}
