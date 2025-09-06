"use client";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="relative">
        {/* Main spinner */}
        <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
        
        {/* Inner pulse */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-blue-500/20 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {/* Loading text */}
      <div className="ml-4 space-y-1">
        <div className="flex items-center space-x-1">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Generating your image
          </span>
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
        <p className="text-xs text-slate-500">
          This may take 30-60 seconds...
        </p>
      </div>
    </div>
  );
}