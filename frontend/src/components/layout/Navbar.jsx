import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from 'src/store/authSlice';
import { ROUTES } from 'src/constants';
import Button from '../common/Button';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.HOME);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: 'Detect', path: ROUTES.DETECT, public: true },
    { label: 'History', path: ROUTES.HISTORY, public: false },
    { label: 'Stats', path: ROUTES.STATS, public: false },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border glass bg-background/85">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5 group">
            <svg className="w-8 h-8 text-primary transition-transform duration-300 group-hover:rotate-12" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#111" className="border border-border" />
              <path d="M8 24V8h4l4 10 4-10h4v16h-3.5V14l-3.5 10h-2L12 14v10H8z" fill="currentColor" />
              <circle cx="24" cy="8" r="3" fill="#22c55e" />
            </svg>
            <span className="font-bold text-lg tracking-tight text-text group-hover:text-primary transition-colors">
              DeepGuard
            </span>
          </Link>

          {/* Navigation links (Desktop) */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              // Hide private links if not authenticated
              if (!link.public && !isAuthenticated) return null;
              
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-primary'
                      : 'text-text-secondary hover:text-text'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Auth Button / Profile (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link
                  to={ROUTES.PROFILE}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-surface-light border border-transparent hover:border-border transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {user?.name ? user.name.substring(0, 2).toUpperCase() : 'US'}
                  </div>
                  <span className="text-sm font-medium text-text">{user?.name}</span>
                </Link>
                <Button onClick={handleLogout} variant="ghost" size="sm">
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link to={ROUTES.LOGIN}>
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to={ROUTES.REGISTER}>
                  <Button variant="primary" size="sm">Register</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-text-secondary hover:text-text p-2 rounded-lg hover:bg-surface-light transition-all"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background animate-slide-down">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => {
              if (!link.public && !isAuthenticated) return null;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-base font-medium ${
                    isActive(link.path)
                      ? 'bg-surface-light text-primary'
                      : 'text-text-secondary hover:bg-surface hover:text-text'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            
            <div className="border-t border-border my-2 pt-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to={ROUTES.PROFILE}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary hover:text-text"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {user?.name ? user.name.substring(0, 2).toUpperCase() : 'US'}
                    </div>
                    <span>{user?.name} (Profile)</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left block px-3 py-2 rounded-lg text-base font-medium text-danger hover:bg-surface"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 p-2">
                  <Link to={ROUTES.LOGIN} onClick={() => setIsOpen(false)}>
                    <Button variant="secondary" className="w-full">Login</Button>
                  </Link>
                  <Link to={ROUTES.REGISTER} onClick={() => setIsOpen(false)}>
                    <Button variant="primary" className="w-full">Register</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
