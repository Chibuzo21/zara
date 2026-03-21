import React from "react";

export default function ZarasDelightLogo() {
  return (
    <div
      className='flex flex-col p-8 bg-[#fffdf9] items-center'
      style={{
        fontFamily: "'Georgia', serif",
      }}>
      {/* Logo Mark */}
      <div style={{ position: "relative", marginBottom: "1rem" }}>
        {/* Outer decorative ring */}
        <svg width='120' height='120' viewBox='0 0 120 120' fill='none'>
          <defs>
            <linearGradient
              id='logoGradient'
              x1='0%'
              y1='0%'
              x2='100%'
              y2='100%'>
              <stop offset='0%' stopColor='#f9a8c9' />
              <stop offset='100%' stopColor='#e8994a' />
            </linearGradient>
            <linearGradient id='zGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
              <stop offset='0%' stopColor='#fff5f0' />
              <stop offset='100%' stopColor='#fff' />
            </linearGradient>
          </defs>

          {/* Warm cream background circle */}
          <circle cx='60' cy='60' r='56' fill='#fdf4ec' />

          {/* Gradient filled circle */}
          <circle cx='60' cy='60' r='52' fill='url(#logoGradient)' />

          {/* Subtle inner shadow ring */}
          <circle
            cx='60'
            cy='60'
            r='52'
            fill='none'
            stroke='rgba(255,255,255,0.3)'
            strokeWidth='2'
          />

          {/* Decorative outer dashed ring */}
          <circle
            cx='60'
            cy='60'
            r='56'
            fill='none'
            stroke='url(#logoGradient)'
            strokeWidth='1.5'
            strokeDasharray='4 3'
          />

          {/* Stylized Z letterform */}
          <text
            x='60'
            y='76'
            textAnchor='middle'
            fill='white'
            fontSize='54'
            fontFamily="'Palatino Linotype', 'Book Antiqua', Palatino, serif"
            fontStyle='italic'
            fontWeight='700'
            style={{ letterSpacing: "-1px" }}>
            Z
          </text>

          {/* Small wheat/star accents */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const cx = 60 + 56 * Math.cos(rad);
            const cy = 60 + 56 * Math.sin(rad);
            return <circle key={i} cx={cx} cy={cy} r='2.5' fill='#e8994a' />;
          })}
        </svg>
      </div>

      {/* Wordmark */}
      <div style={{ textAlign: "center", lineHeight: 1 }}>
        <div
          className='text-[2rem] font-semibold italic '
          style={{
            fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
            background: "linear-gradient(135deg, #f472a8 0%, #e8994a 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "0.02em",
          }}>
          Zara's Delight
        </div>

        {/* Decorative divider */}
        <div
          className='gap-8 flex justify-center items-center'
          style={{
            margin: "6px 0 4px",
          }}>
          <div
            style={{
              height: "1px",
              width: "40px",
              background: "linear-gradient(to right, transparent, #e8994a)",
            }}
          />
          <svg width='12' height='12' viewBox='0 0 12 12'>
            <path
              d='M6 1 L7 4.5 L11 4.5 L8 7 L9 10.5 L6 8.5 L3 10.5 L4 7 L1 4.5 L5 4.5 Z'
              fill='#f4a261'
            />
          </svg>
          <div
            style={{
              height: "1px",
              width: "40px",
              background: "linear-gradient(to left, transparent, #e8994a)",
            }}
          />
        </div>

        <p
          className='m-0 text-[#b0856a] uppercase text-[0.65rem]'
          style={{
            letterSpacing: "0.18em",
            fontFamily: "'Georgia', serif",
          }}>
          Artisan Bakery
        </p>
      </div>
    </div>
  );
}
