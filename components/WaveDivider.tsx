'use client';

export default function WaveDivider() {
  return (
    <div className="relative w-full h-24 overflow-hidden">
      {/* 波浪 SVG */}
      <svg
        className="absolute bottom-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        shapeRendering="auto"
      >
        <defs>
          <path
            id="gentle-wave"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>
        <g className="wave-group">
          {/* 第一层波浪 */}
          <use
            xlinkHref="#gentle-wave"
            x="48"
            y="0"
            fill="rgba(255, 107, 157, 0.1)"
          >
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="translate"
              dur="10s"
              repeatCount="indefinite"
              values="0 0; -48 0; 0 0"
            />
          </use>
          
          {/* 第二层波浪 */}
          <use
            xlinkHref="#gentle-wave"
            x="48"
            y="3"
            fill="rgba(192, 108, 132, 0.15)"
          >
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="translate"
              dur="8s"
              repeatCount="indefinite"
              values="0 0; 48 0; 0 0"
            />
          </use>
          
          {/* 第三层波浪 */}
          <use
            xlinkHref="#gentle-wave"
            x="48"
            y="5"
            fill="rgba(108, 92, 231, 0.1)"
          >
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="translate"
              dur="6s"
              repeatCount="indefinite"
              values="0 0; -48 0; 0 0"
            />
          </use>
          
          {/* 第四层波浪（最前面）*/}
          <use
            xlinkHref="#gentle-wave"
            x="48"
            y="7"
            fill="rgba(255, 255, 255, 0.3)"
          >
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="translate"
              dur="12s"
              repeatCount="indefinite"
              values="0 0; 48 0; 0 0"
            />
          </use>
        </g>
      </svg>
    </div>
  );
}
