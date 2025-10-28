import type { SVGProps } from 'react'

export function BeehiveIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 3L14.6 4.5V7.5L12 9L9.4 7.5V4.5L12 3Z" />
      <path d="M8.4 9L11 10.5V13.5L8.4 15L5.8 13.5V10.5L8.4 9Z" />
      <path d="M15.6 9L18.2 10.5V13.5L15.6 15L13 13.5V10.5L15.6 9Z" />
      <path d="M12 15L14.6 16.5V19.5L12 21L9.4 19.5V16.5L12 15Z" />
    </svg>
  )
}
