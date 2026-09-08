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
    <div className={`relative ${className}`} ref={wrapperRef}>
      <div 
        className="input min-h-[40px] h-auto flex flex-wrap gap-2 items-center cursor-pointer p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value.length === 0 && (
          <span className="text-[var(--text-muted)] text-[14px] px-1">Select segments...</span>
        )}
        
        {value.map(val => {
          const segData = segments.find(s => s.name === val) || { name: val, color: '#9ca3af' };
          return (
            <div key={val} className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
              <SegmentBadge name={segData.name} color={segData.color} />
              <button 
                type="button"
                onClick={() => toggleSegment(val)}
                className="text-[var(--text-muted)] hover:text-red-400 focus:outline-none"
              >
                <X size={12} />
              </button>
            </div>
          );
        })}
        
        <div className="flex-1 min-w-[20px]" />
        <ChevronDown size={16} className={`text-[var(--text-muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-md shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 border-b border-[var(--border)]">
            <input 
              type="text" 
              className="input w-full h-8 text-[13px]" 
              placeholder="Search segments..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onClick={e => e.stopPropagation()}
            />
          </div>
          <div className="max-h-48 overflow-y-auto p-1">
            {filteredSegments.length > 0 ? (
              filteredSegments.map(seg => {
                const isSelected = value.includes(seg.name);
                return (
                  <div 
                    key={seg._id}
                    className="flex items-center justify-between px-3 py-2 cursor-pointer rounded-sm hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                    onClick={() => toggleSegment(seg.name)}
                  >
                    <SegmentBadge name={seg.name} color={seg.color} />
                    {isSelected && <Check size={14} className="text-[var(--gold)]" />}
                  </div>
                );
              })
            ) : (
              <div className="p-3 text-center text-[12px] text-[var(--text-muted)]">
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
