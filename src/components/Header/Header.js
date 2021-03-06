import React from 'react';
import { IndexLink } from 'react-router';
import './Header.scss';

export const Header = () => (
  <div className="navbar navbar-default">
    <div className="container">
      <IndexLink to="/" className="navbar-brand">
        Athenen ilmomasiina
      </IndexLink>
    </div>
  </div>
);

export default Header;
