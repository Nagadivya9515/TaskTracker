
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import React from 'react';
const links = [
  { to: '/', label: 'Home' },
  { to: '/planned', label: 'Planned' },
  { to: '/checklist', label: 'Checklist' },
  { to: '/timer', label: 'Timer' },
  { to: '/alarm', label: 'Alarm' },
  { to: '/notes', label: 'Notes' },
];

export default function Navbar() {

  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();


  return (
    <nav className="bg-white shadow sticky top-0 z-10">
      <div className="container flex items-center justify-between">
        <div className="py-3">
          <span className="font-bold text-lg">Tasks</span>
        </div>
        <div className="flex gap-1">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link-active' : 'text-gray-700 hover:bg-gray-200'}`
              }
              end
            >
              {l.label}
            </NavLink>
          ))}
        </div>
        {isLoggedIn ? (
          <button onClick={() => {logout(); navigate("/login");}} className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-600">Logout</button>
        ) : (
          <button onClick={() => navigate("/login")} className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-600">Login</button>
        )}
      </div>
    </nav>
  );
}