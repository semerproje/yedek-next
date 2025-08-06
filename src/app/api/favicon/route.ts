export async function GET() {
  // Simple text response for favicon - just to prevent 500 error
  return new Response('', {
    status: 204,
    headers: {
      'Cache-Control': 'public, max-age=31536000',
    },
  });
}
