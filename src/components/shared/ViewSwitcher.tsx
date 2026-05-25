import { Link } from 'react-router-dom';
import './ViewSwitcher.css';

/**
 * Top-right button on the 2D landing page. Navigates to `/` (the 3D
 * world). Visual styling stays the same as the previous button version.
 */
export default function ViewSwitcher() {
  return (
    <Link
      to="/"
      className="view-switcher"
      title="Switch to 3D world"
      aria-label="Switch to 3D world"
    >
      3D
    </Link>
  );
}
