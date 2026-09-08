import React, { useState, useEffect, useRef } from 'react';
import { getAllTags } from '../../services/customerService';
import TagChip from './TagChip';

const TagInput = ({ value = [], onChange, className = '' }) => {
  const [existingTags, setExistingTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await getAllTags();
        if (data.success) {
          setExistingTags(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      }
    };
    fetchTags();
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

  const handleAddTag = (tagName) => {
    const cleanName = tagName.trim();
    if (cleanName && !value.includes(cleanName)) {
      onChange([...value, cleanName]);
    }
    setInputValue('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleRemoveTag = (tagName) => {
    onChange(value.filter(v => v !== tagName));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(inputValue);
    } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      // Remove last tag on backspace if input is empty
      onChange(value.slice(0, -1));
    }
  };

  const filteredTags = existingTags
    .filter(t => !value.includes(t)) // Don't show already selected tags
    .filter(t => t.toLowerCase().includes(inputValue.toLowerCase()));

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      <div 
        className="input min-h-[40px] h-auto flex flex-wrap gap-2 items-center p-2 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {value.map(val => (
          <TagChip key={val} name={val} onRemove={() => handleRemoveTag(val)} />
        ))}
        
        <input
          ref={inputRef}
          type="text"
          className="flex-1 bg-transparent border-none text-[14px] text-[var(--text-primary)] focus:outline-none focus:ring-0 min-w-[80px]"
          placeholder={value.length === 0 ? "Add tags..." : ""}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {isOpen && (inputValue.trim() !== '' || filteredTags.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-md shadow-lg z-50 overflow-hidden">
          <div className="max-h-48 overflow-y-auto p-1 py-2">
            {/* Option to create new tag if it doesn't match exactly */}
            {inputValue.trim() !== '' && !existingTags.includes(inputValue.trim()) && !value.includes(inputValue.trim()) && (
              <div 
                className="px-3 py-2 cursor-pointer hover:bg-[rgba(255,255,255,0.05)] transition-colors text-[13px] text-[var(--gold-light)] font-medium flex items-center gap-2"
                onClick={() => handleAddTag(inputValue)}
              >
                + Create "{inputValue.trim()}"
              </div>
            )}
            
            {filteredTags.map(tag => (
              <div 
                key={tag}
                className="px-3 py-2 cursor-pointer hover:bg-[rgba(255,255,255,0.05)] transition-colors text-[13px] text-[var(--text-secondary)]"
                onClick={() => handleAddTag(tag)}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagInput;
