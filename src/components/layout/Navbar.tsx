
import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/actions/authActions';
import { Button } from '@/components/ui/button';
import { 
  BarChart2, 
  Search, 
  LogOut, 
  LogIn, 
  UserPlus, 
  DollarSign
} from 'lucide-react';

const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, user } = useSelector((state: any) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const authLinks = (
    <div className="flex gap-4 items-center">
      <Link to="/portfolio" className="flex items-center gap-1 text-sm hover:text-primary">
        <BarChart2 className="h-4 w-4" />
        <span>Portfolio</span>
      </Link>
      
      <Link to="/" className="flex items-center gap-1 text-sm hover:text-primary">
        <Search className="h-4 w-4" />
        <span>Search</span>
      </Link>
      
      {user && (
        <div className="text-sm px-3 py-1 rounded-md bg-muted">
          <span className="flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-green-500" />
            ${user.buyingPower ? user.buyingPower.toFixed(2) : '0.00'}
          </span>
        </div>
      )}
      
      <Button variant="outline" size="sm" onClick={handleLogout}>
        <LogOut className="h-4 w-4 mr-1" />
        Logout
      </Button>
    </div>
  );

  const guestLinks = (
    <div className="flex gap-2">
      <Link to="/login">
        <Button variant="outline" size="sm">
          <LogIn className="h-4 w-4 mr-1" />
          Login
        </Button>
      </Link>
      <Link to="/register">
        <Button size="sm">
          <UserPlus className="h-4 w-4 mr-1" />
          Register
        </Button>
      </Link>
    </div>
  );

  return (
    <nav className="bg-background border-b border-border py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <DollarSign className="h-6 w-6" />
          <span>StockTrader</span>
        </Link>
        
        {!loading && (isAuthenticated ? authLinks : guestLinks)}
      </div>
    </nav>
  );
};

export default Navbar;
