import React, { useState, useRef, useEffect } from 'react';
import { Check, X, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

const MultiSelect = ({
  options = [],
  value = [],
  onChange,
  placeholder = 'Select options...',
  className,
  disabled = false,
  icon: Icon,
  label,
  error,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOptions = options.filter((opt) => value.includes(opt.value));
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleToggleOption = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];

    onChange(newValue);
  };

  const handleRemoveOption = (optionValue, e) => {
    e.stopPropagation();
    const newValue = value.filter((v) => v !== optionValue);
    onChange(newValue);
  };

  const handleClearAll = (e) => {
    e.stopPropagation();
    onChange([]);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label
          className={cn(
            'block text-sm font-medium text-gray-700',
            required && "after:content-['*'] after:ml-0.5 after:text-red-500",
          )}
        >
          {label}
        </label>
      )}

      <div ref={dropdownRef} className="relative">
        {/* Main Input Area */}
        <div
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            'min-h-[42px] w-full px-3 py-2 border rounded-lg cursor-pointer transition-all',
            'focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent',
            error && 'border-red-500 focus-within:ring-red-500',
            disabled && 'bg-gray-50 cursor-not-allowed',
            !error && 'border-gray-300 hover:border-gray-400',
            Icon && 'pl-10',
          )}
        >
          {Icon && (
            <Icon className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
          )}

          <div className="flex flex-wrap gap-1.5 items-center pr-8">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((option) => (
                <span
                  key={option.value}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-md"
                >
                  {option.label}
                  <button
                    type="button"
                    onClick={(e) => handleRemoveOption(option.value, e)}
                    className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                    disabled={disabled}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-400">{placeholder}</span>
            )}
          </div>

          {/* Clear All & Dropdown Icon */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {selectedOptions.length > 0 && !disabled && (
              <button
                type="button"
                onClick={handleClearAll}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
            <ChevronDown
              className={cn(
                'h-4 w-4 text-gray-400 transition-transform',
                isOpen && 'transform rotate-180',
              )}
            />
          </div>
        </div>

        {/* Dropdown Menu */}
        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
            {/* Search Input */}
            <div className="p-2 border-b border-gray-200">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Options List */}
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => {
                  const isSelected = value.includes(option.value);
                  return (
                    <div
                      key={option.value}
                      onClick={() => handleToggleOption(option.value)}
                      className={cn(
                        'px-3 py-2 cursor-pointer transition-colors flex items-center justify-between',
                        'hover:bg-blue-50',
                        isSelected && 'bg-blue-50 text-blue-700',
                      )}
                    >
                      <span className="text-sm">{option.label}</span>
                      {isSelected && <Check className="h-4 w-4 text-blue-600" />}
                    </div>
                  );
                })
              ) : (
                <div className="px-3 py-4 text-sm text-gray-500 text-center">No options found</div>
              )}
            </div>

            {/* Footer with count */}
            {selectedOptions.length > 0 && (
              <div className="px-3 py-2 border-t border-gray-200 bg-gray-50">
                <span className="text-xs text-gray-600">{selectedOptions.length} selected</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && <p className="text-xs text-red-600">{error}</p>}

      {/* Help Text */}
      {!error && <p className="text-xs text-gray-500">Click to select multiple options</p>}
    </div>
  );
};

export { MultiSelect };
