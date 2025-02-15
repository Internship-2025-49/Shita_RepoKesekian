import { NextRequest, NextResponse } from 'next/server'

const token = '33c09648982ba1044f11365135a4a597c848f0bf28e4831578e24dc81cd1ad5b';

export async function GET(request : NextRequest,{ params }: { params: { id: number } }) {
    const getApiKey = await fetch('http://localhost:3000/api/person/shita', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const apiKeyData = await getApiKey.json();
    const apiKey = apiKeyData.key;
    
    const res = await fetch(`http://localhost:3000/api/person/data/${params.id}`, {
        next: { revalidate: 10 },
        headers: {
            'Authorization': `Bearer ${token}`,
            'api-key': apiKey
        }
    })

    const data = await res.json()
    return NextResponse.json(data)
}

export async function PUT(request: NextRequest,{ params }: { params: { id: number } }) {
    const body = await request.json()
    
    const getApiKey = await fetch('http://localhost:3000/api/person/shita', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const apiKeyData = await getApiKey.json();
    const apiKey = apiKeyData.key;
    
    const res = await fetch(`http://localhost:3000/api/person/data/${params.id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'api-key': apiKey
        },
        body: JSON.stringify(body),
    })

    const data = await res.json();
    return NextResponse.json(data)
}

export async function DELETE(request: NextRequest,{ params }: { params: { id: number } }) {
    const getApiKey = await fetch('http://localhost:3000/api/person/shita', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const apiKeyData = await getApiKey.json();
    const apiKey = apiKeyData.key;
    
    const res = await fetch(`http://localhost:3000/api/person/data/${params.id}`, {
        next: { revalidate: 10 },
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'api-key': apiKey
        }
    })

    const data = await res.json();
    return NextResponse.json(data)
}

