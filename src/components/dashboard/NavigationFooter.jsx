import { Home, LogOut } from 'lucide-react';

export function NavigationFooter({ onBack, onExit }) {
  return (
    <div className="w-full flex items-center gap-4 pt-4 mt-8 border-t border-gray-200">
      <button 
        type="button"
        onClick={onBack}
        className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400 rounded-lg flex items-center justify-center gap-2"
      >
        <Home className="w-4 h-4" />
        Back
      </button>
      <button 
        type="button"
        onClick={onExit}
        className="flex-1 px-4 py-2 text-red-500 hover:text-red-600 border border-red-200 hover:border-red-300 rounded-lg flex items-center justify-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        Exit
      </button>
    </div>
  );
}

