import { motion } from "framer-motion";

export default function Heart({
  fraction,
  small = false,
}: {
  fraction: number; // 0 → empty, 1 → full, 0.25/0.5/0.75 → partial
  small?: boolean;  // shrunk state
}) {
  const size = small ? 18 : 24;

  return (
    <motion.svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      initial={{ scale: small ? 0.75 : 1 }}
      animate={{ scale: small ? 0.75 : 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {/* Empty container */}
      <path
        d="M23.6,2.6c-2.6,0-5,1.2-6.6,3.2C15.4,3.8,13,2.6,10.4,2.6C6.2,2.6,3,5.8,3,10c0,8.2,14,19.4,14,19.4S31,18.2,31,10 C31,5.8,27.8,2.6,23.6,2.6z"
        fill="black"
        opacity="0.3"
      />
      {/* Filled red clipped */}
      <clipPath id="heartClip">
        <rect x="0" y="0" width={32 * fraction} height="32" />
      </clipPath>
      <path
        d="M23.6,2.6c-2.6,0-5,1.2-6.6,3.2C15.4,3.8,13,2.6,10.4,2.6C6.2,2.6,3,5.8,3,10c0,8.2,14,19.4,14,19.4S31,18.2,31,10 C31,5.8,27.8,2.6,23.6,2.6z"
        fill="red"
        clipPath="url(#heartClip)"
      />
    </motion.svg>
  );
}
