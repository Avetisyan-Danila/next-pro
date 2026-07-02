import { NextResponse } from 'next/server'

export async function POST() {
	console.log('hello from the server')

	return NextResponse.json({ success: true })
}
