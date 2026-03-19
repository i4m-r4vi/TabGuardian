import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'TabGuardian Logo';
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse style object for the pill
      <div
        style={{
          fontSize: 24,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '20%',
        }}
      >
        <div
          style={{
            width: '24px',
            height: '12px',
            borderRadius: '999px',
            display: 'flex',
            overflow: 'hidden',
            transform: 'rotate(45deg)',
            border: '2px solid #f3f4f6',
          }}
        >
          <div style={{ width: '50%', height: '100%', background: '#3b82f6' }} />
          <div style={{ width: '50%', height: '100%', background: 'white' }} />
        </div>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}
