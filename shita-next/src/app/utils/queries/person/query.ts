import { NextRequest, NextResponse } from 'next/server'

const token = '33c09648982ba1044f11365135a4a597c848f0bf28e4831578e24dc81cd1ad5b';

export async function GET() {
    const getApiKey = await fetch('http://localhost:3000/api/person/shita', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const apiKeyData = await getApiKey.json();

    const apiKey = apiKeyData.key;

    const res = await fetch('http://localhost:3000/api/person/data', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'api-key': apiKey
        }
    });

    const result = await res.json();

    return NextResponse.json({ result });
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    const getApiKey = await fetch('http://localhost:3000/api/person/shita', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const apiKeyData = await getApiKey.json();

    const apiKey = apiKeyData.key;

    const res = await fetch('http://localhost:3000/api/person/data', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'api-key': apiKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });

    const data = await res.json();

    return NextResponse.json(data);
}

