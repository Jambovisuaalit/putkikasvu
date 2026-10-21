import Link from "next/link";

/** Official Canva Brand Master v1.1, cropped and optimized from original artwork. */
export default function BrandLogo() {
  return (
    <Link href="/" className="brand" aria-label="Putkikasvu – etusivu">
      <img
        className="brand-wordmark"
        src="/brand/putkikasvu-wordmark-white-v1.1.png"
        alt="Putkikasvu"
        width="500"
        height="142"
        loading="eager"
        decoding="async"
      />
    </Link>
  );
}
