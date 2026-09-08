import React from 'react';

/**
 * SegmentBadge — renders a colored segment label using the segment's brand color.
 * Uses color-mix to generate transparent backgrounds from the hex color.
 */
const SegmentBadge = ({ name, color = '#9ca3af' }) => (
  <span
    className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap"
    style={{
      backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
      borderColor:      `color-mix(in srgb, ${color} 28%, transparent)`,
      borderWidth: '1px',
      borderStyle: 'solid',
      color: color,
      letterSpacing: '0.01em',
    }}
  >
    {name}
  </span>
);

export default SegmentBadge;
