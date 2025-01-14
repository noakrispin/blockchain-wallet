import React, { useContext } from 'react';
import { Home, LogOut } from 'lucide-react';
import Context from '../../utils/context';
import { Button } from './Button';

export function NavigationSidebar() {
  const { dispatch } = useContext(Context);

  return (
    <div className="flex gap-4 mb-6">
      <Button 
        text="Back to Home"
        icon={Home}
        onClick={() => dispatch({ type: 'SET_VIEW', param: 'home' })}
        variant="outline"
        className="flex-1"
      />
      <Button 
        text="Exit"
        icon={LogOut}
        onClick={() => dispatch({ type: 'EXIT' })}
        variant="outline"
        className="flex-1"
      />
    </div>
  );
}

