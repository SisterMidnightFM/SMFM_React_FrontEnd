import { Link } from '@tanstack/react-router'
import './Footer.css'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__divider" />
      <nav className="footer__nav">
        <Link to="/" className="footer__link">
          Home
        </Link>
        <Link to="/about" className="footer__link">
          About
        </Link>
        <Link to="/contact" className="footer__link">
          Contact
        </Link>
        <a
          href="https://www.instagram.com/sistermidnightfm/"
          className="footer__link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram
        </a>
        <a
          href="https://www.sistermidnight.org/"
          className="footer__link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Sister Midnight
        </a>
      </nav>
      <p className="footer__copyright">
        &copy; {currentYear} Sister Midnight
      </p>
      <p className="footer__disclaimer">
        Sister Midnight FM is a community radio station that platforms a wide
        range of voices, music, and perspectives from across South East London
        and beyond. The views and opinions expressed by presenters, guests, and
        contributors are their own, and do not represent the views of Sister
        Midnight Community Venues Limited, its Workers, Board, or Committee.
      </p>
    </footer>
  )
}
