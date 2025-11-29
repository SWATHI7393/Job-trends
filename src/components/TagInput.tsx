'use client';

import { useState, KeyboardEvent } from 'react';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export default function TagInput({ value, onChange, placeholder, className }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && inputValue.trim() !== '') {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (!value.includes(newTag)) {
        onChange([...value, newTag]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2 p-2 rounded-lg border bg-background", className)}>
      {value.map((tag) => (
        <Badge key={tag} variant="secondary" className="text-sm py-1 pl-3 pr-2 flex items-center gap-1.5">
          {tag}
          <button
            onClick={() => removeTag(tag)}
            className="rounded-full hover:bg-muted-foreground/20 transition-colors"
          >
            <X size={14} />
          </button>
        </Badge>
      ))}
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 border-0 shadow-none focus-visible:ring-0 p-0 h-auto min-w-[100px]"
      />
    </div>
  );
}
