'use client';

/**
 * Subtle full-site grain overlay (SKILL aesthetic). Fixed, non-interactive.
 */
export default function GrainTexture() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[45] opacity-[0.045] mix-blend-multiply motion-reduce:opacity-0"
      aria-hidden
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '180px 180px',
      }}
    />
  );
}
