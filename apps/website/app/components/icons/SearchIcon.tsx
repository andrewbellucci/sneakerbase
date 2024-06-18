interface SearchIconProps {
  width?: string;
  height?: string;
  color?: string;
}

export default function SearchIcon({
  width = "14px",
  height = "14px",
  color = "#26292B",
}: SearchIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 14 14"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g
        id="Page-1"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
        strokeLinecap="round"
      >
        <g
          id="Medium"
          transform="translate(-467.000000, -22.000000)"
          stroke={color}
          strokeWidth="1.5"
        >
          <g id="NAV" transform="translate(-12.000000, -11.000000)">
            <g id="Group" transform="translate(468.000000, 20.000000)">
              <path
                d="M24,26 L21.7035789,23.7035789 M21.7035789,23.7035789 C22.7321684,22.6749263 23.3684211,21.2538737 23.3684211,19.6842105 C23.3684211,16.5449095 20.8235368,14 17.6842105,14 C14.5449095,14 12,16.5449095 12,19.6842105 C12,22.8235368 14.5449095,25.3684211 17.6842105,25.3684211 C19.2538737,25.3684211 20.6749263,24.7321684 21.7035789,23.7035789 Z"
                id="Shape"
              ></path>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
