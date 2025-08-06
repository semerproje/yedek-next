import { NextRequest, NextResponse } from 'next/server'

// AA API Credentials - Updated for Ultra Premium System
const AA_CREDENTIALS = {
  username: process.env.AA_API_USERNAME || process.env.AA_USERNAME || '3010263',
  password: process.env.AA_API_PASSWORD || process.env.AA_PASSWORD || '4WUbxVw9',
  baseUrl: 'https://api.aa.com.tr/abone'
}

// Rate limiting
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 500

async function waitForRateLimit(): Promise<void> {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest
    await new Promise(resolve => setTimeout(resolve, waitTime))
  }
  
  lastRequestTime = Date.now()
}

function createAuthHeader(): string {
  const auth = Buffer.from(`${AA_CREDENTIALS.username}:${AA_CREDENTIALS.password}`).toString('base64')
  return `Basic ${auth}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, params } = body

    await waitForRateLimit()

    let url: string
    let method: string = 'GET'
    let requestBody: any = null

    switch (action) {
      case 'discover':
        url = `${AA_CREDENTIALS.baseUrl}/discover/${params?.language || 'tr_TR'}`
        break
        
      case 'subscription':
        url = `${AA_CREDENTIALS.baseUrl}/subscription/`
        break
        
      case 'search':
        url = `${AA_CREDENTIALS.baseUrl}/search/`
        method = 'POST'
        requestBody = params
        break
        
      case 'document':
        url = `${AA_CREDENTIALS.baseUrl}/document/${params.typeId}/${params.format}`
        break
        
      case 'token':
        url = `${AA_CREDENTIALS.baseUrl}/token/${params.typeId}/${params.format}`
        break
        
      case 'multitoken':
        url = `${AA_CREDENTIALS.baseUrl}/multitoken/${params.groupId}/${params.format}`
        break
        
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }

    const headers: Record<string, string> = {
      'Authorization': createAuthHeader(),
      'Content-Type': 'application/json'
    }

    const fetchOptions: RequestInit = {
      method,
      headers
    }

    if (requestBody) {
      fetchOptions.body = JSON.stringify(requestBody)
    }

    console.log(`🔄 AA API Proxy: ${action} -> ${url}`)
    if (requestBody) {
      console.log('📤 Request body:', JSON.stringify(requestBody, null, 2))
    }

    const response = await fetch(url, fetchOptions)

    console.log(`📡 AA API Response Status: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ AA API Error (${response.status}):`, errorText)
      
      return NextResponse.json(
        { 
          success: false, 
          error: `AA API Error: ${response.status} ${response.statusText}`,
          details: errorText
        },
        { status: response.status }
      )
    }

    // Handle different response types
    let data: any
    const contentType = response.headers.get('content-type')
    
    if (contentType?.includes('application/json')) {
      data = await response.json()
      console.log('📥 Response data:', {
        isArray: Array.isArray(data),
        hasDocuments: !!data.documents,
        documentsCount: data.documents?.length || 0,
        total: data.total || 0,
        keys: Object.keys(data || {})
      })
    } else {
      data = await response.text()
      console.log('📥 Response text length:', data.length)
    }

    console.log(`✅ AA API Success: ${action}`)

    return NextResponse.json({
      success: true,
      data,
      action,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('❌ AA API Proxy Error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const endpoint = searchParams.get('endpoint')
  const action = searchParams.get('action')

  // Handle both old format (action) and new format (endpoint)
  if (!endpoint && !action) {
    return NextResponse.json(
      { success: false, error: 'Endpoint or action parameter required' },
      { status: 400 }
    )
  }

  try {
    await waitForRateLimit()

    let url: string

    if (endpoint) {
      // New format: direct endpoint
      url = `${AA_CREDENTIALS.baseUrl}${endpoint}`
    } else {
      // Old format: action-based
      switch (action) {
        case 'discover':
          const language = searchParams.get('language') || 'tr_TR'
          url = `${AA_CREDENTIALS.baseUrl}/discover/${language}`
          break
          
        case 'subscription':
          url = `${AA_CREDENTIALS.baseUrl}/subscription/`
          break
          
        default:
          return NextResponse.json(
            { success: false, error: 'Invalid action for GET request' },
            { status: 400 }
          )
      }
    }

    console.log(`🔄 AA API Proxy GET: ${url}`)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': createAuthHeader(),
        'Content-Type': 'application/json'
      }
    })

    console.log(`📡 AA API Response Status: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ AA API Error (${response.status}):`, errorText)
      
      return NextResponse.json(
        { 
          success: false, 
          error: `AA API Error: ${response.status} ${response.statusText}`,
          details: errorText
        },
        { status: response.status }
      )
    }

    const data = await response.json()

    console.log(`✅ AA API Success: ${endpoint || action}`)

    return NextResponse.json({
      success: true,
      data,
      endpoint: endpoint || action,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('❌ AA API Proxy Error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}
