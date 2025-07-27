import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sizeParam = searchParams.get('size');
  const size = sizeParam ? parseInt(sizeParam, 10) : 192;
  
  // For very small icons, adjust the font size
  const fontSize = size < 64 ? size / 3 : size / 4;
  
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: fontSize,
          background: '#059669',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          borderRadius: size < 100 ? '20%' : '0%',
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