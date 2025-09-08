// Cloudflare Worker để xử lý đơn hàng và gửi đến Google Sheets
// Đơn giản, nhanh gọn, không phức tạp

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // CORS headers cho tất cả response
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  // Xử lý preflight request
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    })
  }

  // Xử lý GET request để test
  if (request.method === 'GET') {
    return new Response(JSON.stringify({
      status: 'Worker đang hoạt động',
      message: 'Gửi POST request với dữ liệu đơn hàng để xử lý',
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    })
  }

  // Chỉ xử lý POST request
  if (request.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405,
      headers: corsHeaders
    })
  }

  try {
    // Lấy dữ liệu từ request
    const orderData = await request.json()
    console.log('📦 Worker: Received order data:', orderData)

    // URL Google Apps Script thực
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby7kSQna029lyEI8HQPQ3wa5j_JMIJtfzmk_OeUQHC-MvCOaUrdaoasGhA2mtQx9yG5lQ/exec'

    // Gửi dữ liệu đến Google Apps Script
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    })

    console.log('📤 Worker: Google Script response status:', response.status)

    if (response.ok) {
      const result = await response.json()
      console.log('✅ Worker: Success response:', result)

      return new Response(JSON.stringify({
        success: true,
        message: 'Đơn hàng đã được gửi thành công',
        orderId: orderData.orderId
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      })
    } else {
      throw new Error(`Google Script error: ${response.status}`)
    }

  } catch (error) {
    console.error('❌ Worker error:', error)
    
    return new Response(JSON.stringify({
      success: false,
      message: 'Có lỗi xảy ra khi xử lý đơn hàng',
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    })
  }
}
