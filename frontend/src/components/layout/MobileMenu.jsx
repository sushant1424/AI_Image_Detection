import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from 'src/constants';
import Button from '../common/Button';

const MobileMenu = ({ isOpen, navLinks, isAuthenticated, user, onClose, onLogout }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  if (!isOpen) return null;

  return (
    <div className="md:hidden border-t border-border bg-background animate-slide-down">
      <div className="px-4 pt-2 pb-3 space-y-1">
        {navLinks.map((link) => {
          if (!link.public && !isAuthenticated) return null;
          return (
            <Link key={link.path} to={link.path} onClick={onClose}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                isActive(link.path) ? 'bg-surface-light text-primary' : 'text-text-secondary hover:bg-surface hover:text-text'
              }`}
            >{link.label}</Link>
          );
        })}

        <div className="border-t border-border my-2 pt-2">
          {isAuthenticated ? (
            <>
              <Link to={ROUTES.PROFILE} onClick={onClose}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary hover:text-text">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  {user?.name?.substring(0, 2).toUpperCase() || 'US'}
                </div>
                <span>{user?.name} (Profile)</span>
              </Link>
              <button onClick={() => { onClose(); onLogout(); }}
                className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-danger hover:bg-surface">
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 p-2">
              <Link to={ROUTES.LOGIN} onClick={onClose}>
                <Button variant="secondary" className="w-full">Login</Button>
              </Link>
              <Link to={ROUTES.REGISTER} onClick={onClose}>
                <Button variant="primary" className="w-full">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
