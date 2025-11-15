import React from 'react';

interface CardProps {
  title: string;
  // Fix: Made the `children` prop optional to resolve TypeScript errors where it was not being detected.
  children?: React.ReactNode;
  className?: string;
  // Fix: Changed JSX.Element to React.ReactElement to fix namespace issue.
  // Fix: Specified that the icon element can accept a `className` prop to resolve type error with React.cloneElement.
  icon?: React.ReactElement<{ className?: string }>;
}

export function Card({ title, children, className = '', icon }: CardProps) {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="p-5 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-3">
            {icon && React.cloneElement(icon, { className: "w-6 h-6 text-indigo-500 dark:text-indigo-400" })}
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
        </div>
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  );
}
