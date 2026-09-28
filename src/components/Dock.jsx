import { NavLink } from 'react-router-dom'
import { useAuth } from '../useAuth'

const icons = {
  explore: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8M12 3a14.5 14.5 0 010 18M12 3a14.5 14.5 0 000 18" />
    </>
  ),
  profile: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
    />
  ),
  availability: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
    />
  ),
  swaps: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-9L21 3m0 0l-4.5 4.5M21 3H7.5"
    />
  ),
  favorites: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
    />
  ),
  logout: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
    />
  ),
}

function Icon({ name }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      {icons[name]}
    </svg>
  )
}

const links = [
  { to: '/explore', icon: 'explore', label: 'Explore' },
  { to: '/profile', icon: 'profile', label: 'My Profile' },
  { to: '/availability', icon: 'availability', label: 'Availability' },
  { to: '/swaps', icon: 'swaps', label: 'Swaps' },
  { to: '/favorites', icon: 'favorites', label: 'Favorites' },
]

function Dock() {
  const { logout } = useAuth()

  return (
    <nav className="dock">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          title={link.label}
          className={({ isActive }) => `dock-item${isActive ? ' active' : ''}`}
        >
          <Icon name={link.icon} />
        </NavLink>
      ))}

      <div className="dock-divider" />

      <button className="dock-item" title="Log out" onClick={logout}>
        <Icon name="logout" />
      </button>
    </nav>
  )
}

export default Dock