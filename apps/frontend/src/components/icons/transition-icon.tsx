import React from "react"

interface TransitionIconProps {
  width?: number
  height?: number
  className?: string
}

export function TransitionIcon({ width = 446, height = 201, className }: TransitionIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 446 201"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="154.48" y="82.4358" width="139.531" height="29.8994" fill="white" />
      <rect
        x="155.103"
        y="83.0587"
        width="138.285"
        height="28.6536"
        stroke="black"
        strokeOpacity="0.06"
        strokeWidth="1.24581"
      />
      <rect x="154.48" y="91.1564" width="139.531" height="12.4581" fill="url(#paint0_linear_12_3293)" />
      <rect y="0.21228" width="173.168" height="200.575" rx="14.9497" fill="white" />
      <rect
        x="0.622905"
        y="0.835185"
        width="171.922"
        height="199.33"
        rx="14.3268"
        stroke="black"
        strokeOpacity="0.08"
        strokeWidth="1.24581"
      />
      <path
        d="M65.2065 98.5139L69.0677 100.795L65.2065 98.5139ZM94.95 92.6705L98.4848 95.4309L94.95 92.6705ZM151.938 95.6143C154 96.9866 156.784 96.4274 158.157 94.3654C159.529 92.3033 158.97 89.5192 156.908 88.1469L151.938 95.6143ZM13.2682 141.118L13.999 145.543C20.137 144.529 28.2318 143.546 37.6603 137.467C47.0041 131.443 57.3231 120.671 69.0677 100.795L65.2065 98.5139L61.3453 96.2323C50.0057 115.423 40.5546 124.929 32.7999 129.928C25.1299 134.873 18.7977 135.659 12.5374 136.693L13.2682 141.118ZM65.2065 98.5139L69.0677 100.795C78.7816 84.3564 90.9448 81.6427 99.7056 84.5637C108.93 87.6395 115.846 97.2592 114.659 108.63L119.12 109.095L123.581 109.56C125.209 93.9533 115.708 80.444 102.543 76.0544C88.9136 71.5101 72.7129 76.9946 61.3453 96.2323L65.2065 98.5139ZM119.12 109.095L114.659 108.63C114.093 114.057 111.729 116.512 109.406 117.553C106.841 118.701 103.389 118.547 100.213 116.953C97.0807 115.381 94.6995 112.645 93.9601 109.276C93.2402 105.995 93.9052 101.295 98.4848 95.4309L94.95 92.6705L91.4151 89.9102C85.6227 97.3278 83.7713 104.694 85.1988 111.199C86.6069 117.615 91.037 122.383 96.1889 124.969C101.296 127.533 107.6 128.19 113.073 125.739C118.787 123.179 122.74 117.622 123.581 109.56L119.12 109.095ZM94.95 92.6705L98.4848 95.4309C105.508 86.4377 115.339 84.2746 125.517 85.5355C135.827 86.8127 145.892 91.5903 151.938 95.6143L154.423 91.8806L156.908 88.1469C150.045 83.5796 138.671 78.1266 126.62 76.6337C114.438 75.1246 100.987 77.6522 91.4151 89.9102L94.95 92.6705Z"
        fill="url(#paint1_linear_12_3293)"
      />
      <rect x="275.324" y="0.21228" width="170.676" height="200.575" rx="14.9497" fill="white" />
      <rect
        x="275.947"
        y="0.835185"
        width="169.43"
        height="199.33"
        rx="14.3268"
        stroke="black"
        strokeOpacity="0.08"
        strokeWidth="1.24581"
      />
      <path
        d="M338.216 34.481C338.598 34.4502 338.982 34.4962 339.347 34.6148C339.709 34.7328 340.045 34.9207 340.335 35.1685C340.623 35.4227 340.858 35.7308 341.026 36.0757C341.195 36.4213 341.294 36.7973 341.317 37.1812C341.341 37.5652 341.289 37.9503 341.163 38.314C341.038 38.6777 340.842 39.0134 340.587 39.3013L340.581 39.3072L337.151 43.2808L336.858 43.6206L337.088 44.0064C339.306 47.7336 340.058 52.1528 339.198 56.4038C338.339 60.6548 335.929 64.4346 332.438 67.0074C328.946 69.5801 324.622 70.762 320.307 70.3238C315.992 69.8854 311.995 67.8575 309.092 64.6353C306.189 61.413 304.588 57.2262 304.601 52.8892C304.613 48.5524 306.239 44.3754 309.16 41.1704C312.082 37.9654 316.092 35.9613 320.409 35.5484C324.726 35.1355 329.043 36.3429 332.52 38.9361L332.986 39.2847L333.365 38.8423L336.227 35.5074L336.23 35.5034C336.477 35.2104 336.78 34.9689 337.121 34.7935C337.462 34.6181 337.834 34.5118 338.216 34.481ZM328.597 43.3316C326.432 41.9196 323.857 41.2699 321.281 41.4849C318.706 41.6999 316.275 42.7679 314.374 44.5191C312.473 46.2704 311.209 48.6062 310.784 51.1558C310.359 53.7053 310.796 56.3239 312.026 58.5972C313.256 60.8706 315.209 62.6694 317.576 63.7085C319.943 64.7475 322.589 64.9675 325.095 64.3345C327.601 63.7014 329.824 62.2508 331.413 60.2124C332.999 58.1782 333.864 55.6744 333.87 53.0952C333.903 51.8467 333.725 50.6012 333.344 49.4117L333.003 48.3462L332.276 49.1968L324.568 58.23C324.256 58.5906 323.861 58.87 323.417 59.0445C322.973 59.2189 322.493 59.2828 322.019 59.231C321.544 59.1791 321.089 59.0129 320.693 58.7466C320.347 58.5136 320.054 58.2105 319.834 57.857L319.745 57.7027L315.015 48.9273C314.651 48.2426 314.574 47.4421 314.801 46.7007C315.028 45.9582 315.54 45.3359 316.226 44.9712C316.911 44.6067 317.713 44.5297 318.455 44.7564C319.197 44.9831 319.82 45.4949 320.185 46.1802V46.1812L322.408 50.3443L322.838 51.149L323.431 50.4556L328.729 44.2583L329.19 43.7193L328.597 43.3316Z"
        fill="#D2D1D6"
        stroke="white"
        strokeWidth="1.24581"
      />
      <path
        d="M349.687 39.415H397.16C397.936 39.415 398.68 39.7231 399.228 40.2715C399.777 40.82 400.086 41.5641 400.086 42.3398C400.086 43.1156 399.777 43.8596 399.228 44.4082C398.68 44.9567 397.936 45.2656 397.16 45.2656H349.687C348.912 45.2656 348.167 44.9567 347.619 44.4082C347.07 43.8597 346.762 43.1156 346.762 42.3398C346.763 41.5641 347.07 40.82 347.619 40.2715C348.167 39.723 348.912 39.4151 349.687 39.415Z"
        fill="#D2D1D6"
        stroke="white"
        strokeWidth="1.24581"
      />
      <path
        d="M349.687 52.2116H414.167C414.942 52.2116 415.687 52.5197 416.235 53.0681C416.784 53.6166 417.092 54.3607 417.093 55.1364C417.093 55.9122 416.784 56.6562 416.235 57.2048C415.687 57.7533 414.942 58.0622 414.167 58.0622H349.687C348.912 58.0622 348.167 57.7533 347.619 57.2048C347.07 56.6563 346.762 55.9122 346.762 55.1364C346.763 54.3607 347.07 53.6166 347.619 53.0681C348.167 52.5196 348.912 52.2117 349.687 52.2116Z"
        fill="#D2D1D6"
        stroke="white"
        strokeWidth="1.24581"
      />
      <path
        d="M322.049 83.458C326.681 83.4643 331.121 85.3068 334.396 88.5821C337.666 91.8513 339.508 96.2816 339.521 100.904C338.561 124.084 305.584 124.093 304.601 100.93C304.601 96.2999 306.438 91.859 309.71 88.583C312.981 85.3074 317.419 83.4643 322.049 83.458ZM326.496 90.1924C324.373 89.3129 322.036 89.0829 319.781 89.5313C317.527 89.9797 315.456 91.0867 313.831 92.7119C312.206 94.3373 311.099 96.4087 310.65 98.6631C310.202 100.917 310.432 103.254 311.312 105.378C312.191 107.501 313.681 109.316 315.592 110.593C317.33 111.754 319.346 112.422 321.426 112.533V112.67H322.049C323.586 112.67 325.107 112.365 326.525 111.773C327.944 111.182 329.231 110.314 330.312 109.222C331.392 108.129 332.246 106.834 332.822 105.409C333.327 104.163 333.611 102.84 333.663 101.499L333.671 100.923C333.669 98.6269 332.988 96.3828 331.712 94.4737C330.435 92.5625 328.62 91.072 326.496 90.1924Z"
        fill="#D2D1D6"
        stroke="white"
        strokeWidth="1.24581"
      />
      <path
        d="M349.488 104.794H413.968C414.743 104.794 415.487 105.102 416.036 105.65C416.584 106.199 416.893 106.943 416.893 107.718C416.893 108.494 416.584 109.238 416.036 109.787C415.487 110.335 414.743 110.644 413.968 110.644H349.488C348.712 110.644 347.968 110.335 347.42 109.787C346.871 109.238 346.563 108.494 346.563 107.718C346.563 106.943 346.871 106.199 347.42 105.65C347.968 105.102 348.712 104.794 349.488 104.794Z"
        fill="#D2D1D6"
        stroke="white"
        strokeWidth="1.24581"
      />
      <path
        d="M349.488 90.5541H396.961C397.736 90.5541 398.481 90.8621 399.029 91.4105C399.578 91.9591 399.886 92.7032 399.886 93.4789C399.886 94.2547 399.578 94.9987 399.029 95.5472C398.48 96.0958 397.736 96.4047 396.961 96.4047H349.488C348.712 96.4046 347.968 96.0958 347.42 95.5472C346.871 94.9987 346.563 94.2546 346.563 93.4789C346.563 92.7032 346.871 91.959 347.42 91.4105C347.968 90.862 348.712 90.5541 349.488 90.5541Z"
        fill="#D2D1D6"
        stroke="white"
        strokeWidth="1.24581"
      />
      <path
        d="M322.049 130.765C326.681 130.771 331.121 132.614 334.396 135.889C337.666 139.158 339.508 143.589 339.521 148.211C338.561 171.391 305.584 171.4 304.601 148.237C304.601 143.607 306.438 139.166 309.71 135.89C312.981 132.615 317.419 130.771 322.049 130.765ZM326.496 137.5C324.373 136.62 322.036 136.39 319.781 136.838C317.527 137.287 315.456 138.394 313.831 140.019C312.206 141.644 311.099 143.716 310.65 145.97C310.202 148.225 310.432 150.562 311.312 152.685C312.191 154.808 313.681 156.623 315.592 157.9C317.33 159.061 319.346 159.729 321.426 159.84V159.977H322.049C323.586 159.977 325.107 159.672 326.525 159.081C327.944 158.489 329.231 157.621 330.312 156.529C331.392 155.436 332.246 154.141 332.822 152.716C333.327 151.47 333.611 150.147 333.663 148.806L333.671 148.23C333.669 145.934 332.988 143.69 331.712 141.781C330.435 139.87 328.62 138.379 326.496 137.5Z"
        fill="#D2D1D6"
        stroke="white"
        strokeWidth="1.24581"
      />
      <path
        d="M349.488 152.101H413.968C414.743 152.101 415.487 152.409 416.036 152.957C416.584 153.506 416.893 154.25 416.893 155.026C416.893 155.802 416.584 156.546 416.036 157.094C415.487 157.643 414.743 157.952 413.968 157.952H349.488C348.712 157.951 347.968 157.643 347.42 157.094C346.871 156.546 346.563 155.801 346.563 155.026C346.563 154.25 346.871 153.506 347.42 152.957C347.968 152.409 348.712 152.101 349.488 152.101Z"
        fill="#D2D1D6"
        stroke="white"
        strokeWidth="1.24581"
      />
      <path
        d="M349.488 137.861H396.961C397.736 137.861 398.481 138.169 399.029 138.718C399.578 139.266 399.886 140.011 399.886 140.786C399.886 141.562 399.578 142.306 399.029 142.855C398.48 143.403 397.736 143.712 396.961 143.712H349.488C348.712 143.712 347.968 143.403 347.42 142.855C346.871 142.306 346.563 141.562 346.563 140.786C346.563 140.01 346.871 139.266 347.42 138.718C347.968 138.169 348.712 137.861 349.488 137.861Z"
        fill="#D2D1D6"
        stroke="white"
        strokeWidth="1.24581"
      />
      <defs>
        <linearGradient
          id="paint0_linear_12_3293"
          x1="154.48"
          y1="97.3855"
          x2="294.011"
          y2="97.3855"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6D56FA" />
          <stop offset="1" stopColor="#6D56FA" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_12_3293"
          x1="24.1627"
          y1="137.319"
          x2="140.657"
          y2="107.08"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6D56FA" stopOpacity="0" />
          <stop offset="1" stopColor="#6D56FA" />
        </linearGradient>
      </defs>
    </svg>
  )
}
