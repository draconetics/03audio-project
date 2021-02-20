import React from 'react';
import './MenuComponent.css';
import { NavLink } from 'react-router-dom';

const Menu = () => (
  <nav className="main-nav">
    <div className="main-menu container">

      <NavLink className="main-menu__logo" to="/">AudioSet</NavLink>
      <ul>
        <li>
          <NavLink activeClassName="active" exact to="/">Home</NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/audio/new">Import</NavLink>
        </li>
      </ul>
    </div>
  </nav>
);

export default Menu;
