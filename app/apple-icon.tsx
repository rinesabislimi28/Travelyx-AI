import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#09090b',
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="120" height="120">
          {/* AI Network Line */}
          <path d="M6 6L18 18" stroke="#35c6b3" strokeWidth="3.5" strokeLinecap="round" />
          {/* AI Nodes */}
          <circle cx="6" cy="6" r="2.5" fill="#09090b" stroke="#35c6b3" strokeWidth="1.5" />
          <circle cx="18" cy="18" r="2.5" fill="#09090b" stroke="#35c6b3" strokeWidth="1.5" />
          
          {/* Flight Path */}
          <path d="M6 18L13 11" stroke="#ffb938" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 4" />
          
          {/* Paper Plane */}
          <path d="M22 2L12 6.5L16 9L18 13L22 2Z" fill="#ffb938" stroke="#09090b" strokeWidth="0.5" strokeLinejoin="round" />
          <path d="M16 9L14 14L18 13L16 9Z" fill="#ff7a59" opacity="0.9" />
          
          {/* Center node */}
          <circle cx="12" cy="12" r="3" fill="#09090b" />
          <circle cx="12" cy="12" r="1.5" fill="#ffb938" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
