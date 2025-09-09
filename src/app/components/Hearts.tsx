import { motion } from "framer-motion";

let heartIdCounter = 0; // unique id for clipPaths

export default function Heart({
  fraction,
  small = false,
  className,
  damaged,
}: {
  fraction: number; // 0 → empty, 1 → full, 0.25/0.5/0.75 → partial
  small?: boolean;
  className?: string;
  damaged?: boolean;
}) {
  const size = small ? 20 : 22;
  const uniqueId = `heartClip-${heartIdCounter++}`;
  const width = 31 * (fraction / 4); // fraction: 0-4 → scale to 0-31 width

  return (
    <motion.svg
      viewBox="0 0 31 30"
      width={size}
      height={size}
      className={className}
      initial={{ scale: small ? 0.75 : 1 }}
      animate={damaged ? { opacity: [1, 0, 1, 0, 1] } : { opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Empty heart background */}
      <path
        d="M23.6,2.6c-2.6,0-5,1.2-6.6,3.2C15.4,3.8,13,2.6,10.4,2.6C6.2,2.6,3,5.8,3,10c0,8.2,14,19.4,14,19.4S31,18.2,31,10 C31,5.8,27.8,2.6,23.6,2.6z"
        fill="black"
        opacity="0.3"
      />
      {/* Filled heart */}
      <clipPath id={uniqueId}>
        <rect x="0" y="0" width={width} height="30" />
      </clipPath>
      <path
        d="M23.6,2.6c-2.6,0-5,1.2-6.6,3.2C15.4,3.8,13,2.6,10.4,2.6C6.2,2.6,3,5.8,3,10c0,8.2,14,19.4,14,19.4S31,18.2,31,10 C31,5.8,27.8,2.6,23.6,2.6z"
        fill="red"
        clipPath={`url(#${uniqueId})`}
      />
    </motion.svg>
  );
}
