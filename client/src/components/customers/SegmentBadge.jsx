import React from 'react';

/**
 * SegmentBadge — renders a colored segment label using the segment's brand color.
 * Uses color-mix to generate transparent backgrounds from the hex color.
 */
const SegmentBadge = ({ name, color, segment }) => {
  const badgeName = name || segment?.name || 'Segment';
  const badgeColor = color || segment?.color || '#3b82f6';
  
  return (
    <span
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{
        backgroundColor: `color-mix(in srgb, ${badgeColor} 15%, transparent)`,
        borderColor: `color-mix(in srgb, ${badgeColor} 35%, transparent)`,
        borderWidth: '1px',
        borderStyle: 'solid',
        color: badgeColor,
      }}
    >
      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: badgeColor }} />
      {badgeName}
    </span>
  );
};

export default SegmentBadge;
