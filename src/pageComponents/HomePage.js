import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

export default function HomePage() {
  const { user } = useAuth0();
  return (
    <div>
      {user?.name ? (
        <div>
        <div>
          HomePage
        </div>
        <div>
          <Link to="/upload">
            <button>Upload</button>
          </Link>
        </div>
        <div>
          <Link to={`/editProfile/${user.name}`}>
            <button>Artist Profile</button>
          </Link>
        </div>
        </div>
      ) : (
        <div>
          Please log in to access this content.
        </div>
      )}
    </div>
  );
}
