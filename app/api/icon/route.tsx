import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const size = request.url.includes('512') ? 512 : 192;
  
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: size / 4,
          background: '#059669',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
        }}
      >
        LA
      </div>
    ),
    {
      width: size,
      height: size,
    },
  );
}