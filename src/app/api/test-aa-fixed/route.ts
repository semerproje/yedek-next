import { NextRequest, NextResponse } from 'next/server'
import { aaNewsService, fetchAANews, saveAANewsToFirebase } from '@/lib/aa-news-service'

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Endpoint sadece development modda kullanılabilir' }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'test'
    const limit = parseInt(searchParams.get('limit') || '5')
    const category = searchParams.get('category')

    console.log('🔍 AA API Test Endpoint - Action:', action)

    switch (action) {
      case 'connection':
        // Sadece bağlantı testi
        const connectionResult = await aaNewsService.testConnection()
        return NextResponse.json({
          success: true,
          action: 'connection_test',
          result: connectionResult
        })

      case 'firebase':
        // Firebase bağlantı testi
        const firebaseResult = await aaNewsService.testFirebaseConnection()
        return NextResponse.json({
          success: true,
          action: 'firebase_test',
          result: firebaseResult
        })

      case 'fetch':
        // Haber çekme testi
        const fetchParams = {
          limit,
          language: 'tr',
          ...(category && { category: [category] })
        }
        
        const newsResult = await fetchAANews(fetchParams)
        return NextResponse.json({
          success: true,
          action: 'fetch_news',
          params: fetchParams,
          result: {
            found: newsResult.data?.result.length || 0,
            total: newsResult.response.total,
            message: newsResult.response.message,
            news: newsResult.data?.result.slice(0, 3).map(item => ({
              id: item.id,
              title: item.title,
              category: item.category,
              date: item.date,
              type: item.type
            }))
          }
        })

      case 'save':
        // Firebase'e kaydetme testi
        const saveParams = {
          limit: Math.min(limit, 3), // Max 3 haber
          language: 'tr'
        }
        
        const saveNewsResult = await fetchAANews(saveParams)
        
        if (saveNewsResult.data?.result.length) {
          const savedIds = await saveAANewsToFirebase(saveNewsResult.data.result, false)
          return NextResponse.json({
            success: true,
            action: 'save_to_firebase',
            result: {
              fetched: saveNewsResult.data.result.length,
              saved: savedIds.length,
              savedIds: savedIds,
              news: saveNewsResult.data.result.map(item => ({
                id: item.id,
                title: item.title,
                category: item.category
              }))
            }
          })
        } else {
          return NextResponse.json({
            success: false,
            action: 'save_to_firebase',
            error: 'Kaydedilecek haber bulunamadı'
          })
        }

      case 'full':
        // Tam test: bağlantı + fetch + save
        const steps = []
        
        // 1. Bağlantı testi
        const fullConnectionResult = await aaNewsService.testConnection()
        steps.push({
          step: 1,
          name: 'connection_test',
          success: fullConnectionResult.success,
          result: fullConnectionResult
        })

        // 2. Haber çekme
        const fullFetchResult = await fetchAANews({ limit: 3, language: 'tr' })
        steps.push({
          step: 2,
          name: 'fetch_news',
          success: !!fullFetchResult.data?.result.length,
          result: {
            found: fullFetchResult.data?.result.length || 0,
            message: fullFetchResult.response.message
          }
        })

        // 3. Firebase kaydetme (eğer haber varsa)
        if (fullFetchResult.data?.result.length) {
          const fullSavedIds = await saveAANewsToFirebase(fullFetchResult.data.result.slice(0, 2), false)
          steps.push({
            step: 3,
            name: 'save_firebase',
            success: fullSavedIds.length > 0,
            result: {
              saved: fullSavedIds.length,
              savedIds: fullSavedIds
            }
          })
        }

        const allSuccess = steps.every(step => step.success)
        
        return NextResponse.json({
          success: allSuccess,
          action: 'full_test',
          result: {
            allStepsSuccess: allSuccess,
            steps: steps,
            summary: {
              connectionOk: steps[0]?.success || false,
              newsFound: (steps[1]?.result as any)?.found || 0,
              newsSaved: (steps[2]?.result as any)?.saved || 0
            }
          }
        })

      default:
        // Varsayılan: connection test
        const defaultConnectionResult = await aaNewsService.testConnection()
        return NextResponse.json({
          success: true,
          action: 'default_test',
          result: defaultConnectionResult,
          availableActions: [
            'connection - Sadece bağlantı testi',
            'fetch - Haber çekme testi',
            'save - Firebase kaydetme testi',
            'full - Tam sistem testi'
          ]
        })
    }

  } catch (error) {
    console.error('AA API test endpoint error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Endpoint sadece development modda kullanılabilir' }, { status: 403 })
  }

  try {
    // JSON parsing with error handling
    let body;
    try {
      const requestText = await request.text()
      if (!requestText || requestText.trim() === '') {
        throw new Error('Empty request body')
      }
      body = JSON.parse(requestText)
    } catch (parseError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid JSON in request body',
        detail: parseError instanceof Error ? parseError.message : 'JSON parse error'
      }, { status: 400 })
    }

    const { action, params } = body

    console.log('🔍 AA API Test POST - Action:', action, 'Params:', params)

    switch (action) {
      case 'custom_fetch':
        const customResult = await fetchAANews(params || {})
        return NextResponse.json({
          success: true,
          action: 'custom_fetch',
          params: params,
          result: customResult
        })

      case 'custom_save':
        const customFetchResult = await fetchAANews(params || {})
        if (customFetchResult.data?.result.length) {
          const customSavedIds = await saveAANewsToFirebase(customFetchResult.data.result, params?.processWithAI || false)
          return NextResponse.json({
            success: true,
            action: 'custom_save',
            result: {
              fetched: customFetchResult.data.result.length,
              saved: customSavedIds.length,
              savedIds: customSavedIds
            }
          })
        } else {
          return NextResponse.json({
            success: false,
            action: 'custom_save',
            error: 'Kaydedilecek haber bulunamadı'
          })
        }

      default:
        return NextResponse.json({
          success: false,
          error: 'Geçersiz action',
          availableActions: ['custom_fetch', 'custom_save']
        }, { status: 400 })
    }

  } catch (error) {
    console.error('AA API test POST endpoint error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 })
  }
}
