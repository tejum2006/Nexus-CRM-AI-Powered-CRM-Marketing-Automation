import React, { useState, useEffect, useRef } from 'react';
import { X, Check, ChevronDown } from 'lucide-react';
import { getSegments } from '../../services/segmentService';
import SegmentBadge from './SegmentBadge';

const SegmentSelector = ({ value = [], onChange, className = '' }) => {
  const [segments, setSegments] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    const fetchSegments = async () => {
      try {
        const data = await getSegments();
        if (data.success) {
          setSegments(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch segments:', error);
      }
    };
    fetchSegments();
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSegment = (segmentName) => {
    const newValues = value.includes(segmentName)
      ? value.filter(v => v !== segmentName)
      : [...value, segmentName];
    onChange(newValues);
  };

  const filteredSegments = segments.filter(seg =>
    seg.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`relative ${className}`} ref={wrapperRef} style={{ zIndex: isOpen ? 100 : 'auto' }}>
      <div
        className="input"
        style={{
          minHeight: '40px',
          height: 'auto',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          alignItems: 'center',
          cursor: 'pointer',
          padding: '6px 10px',
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {value.length === 0 && (
          <span style={{ color: 'var(--text-tertiary)', fontSize: '14px', paddingLeft: '2px' }}>Select segments...</span>
        )}

        {value.map(val => {
          const segData = segments.find(s => s.name === val) || { name: val, color: '#9ca3af' };
          return (
            <div key={val} className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
              <SegmentBadge name={segData.name} color={segData.color} />
              <button
                type="button"
                onClick={() => toggleSegment(val)}
                style={{ color: 'var(--text-tertiary)' }}
                className="hover:text-red-400 focus:outline-none"
              >
                <X size={12} />
              </button>
            </div>
          );
        })}

        <div className="flex-1" style={{ minWidth: '20px' }} />
        <ChevronDown
          size={16}
          style={{ color: 'var(--text-tertiary)', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none', flexShrink: 0 }}
        />
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: '#1a2235',
            border: '1px solid var(--border-strong)',
            borderRadius: '8px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            zIndex: 9999,
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
            <input
              type="text"
              className="input"
              style={{ height: '32px', fontSize: '13px', width: '100%' }}
              placeholder="Search segments..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onClick={e => e.stopPropagation()}
            />
          </div>
          <div style={{ maxHeight: '200px', overflowY: 'auto', padding: '4px' }}>
            {filteredSegments.length > 0 ? (
              filteredSegments.map(seg => {
                const isSelected = value.includes(seg.name);
                return (
                  <div
                    key={seg._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      cursor: 'pointer',
                      borderRadius: '6px',
                      background: isSelected ? 'rgba(59,130,246,0.08)' : 'transparent',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = isSelected ? 'rgba(59,130,246,0.08)' : 'transparent'}
                    onClick={() => toggleSegment(seg.name)}
                  >
                    <SegmentBadge name={seg.name} color={seg.color} />
                    {isSelected && <Check size={14} style={{ color: 'var(--brand-primary)', flexShrink: 0 }} />}
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                No segments found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SegmentSelector;
