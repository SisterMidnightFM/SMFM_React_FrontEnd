import type { ReactNode } from 'react';
import './CardGrid.css';

interface CardGridProps {
  children: ReactNode;
  className?: string;
}

export function CardGrid({ children, className }: CardGridProps) {
  return (
    <div className={`card-grid ${className || ''}`}>
      {children}
    </div>
  );
}
