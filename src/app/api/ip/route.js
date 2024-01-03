export async function GET(req) {
	const headersList = headers()
	const ip = headersList.get('x-forwarded-for')

	const data = {
		ok: true,
		ip_address: ip,
	}

	return NextResponse.json(data, { status: 200 })
}
