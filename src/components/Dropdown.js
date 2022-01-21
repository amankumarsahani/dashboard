import "./Dropdown.css";
import { ReactComponent as CaretIcon } from "../icons/caret.svg";
import { ReactComponent as CogIcon } from "../icons/cog.svg";
import { ReactComponent as ChevronIcon } from "../icons/chevron.svg";
import { ReactComponent as ArrowIcon } from "../icons/arrow.svg";
import { ReactComponent as BoltIcon } from "../icons/bolt.svg";

import React, { useState, useEffect, useRef } from "react";
import { CSSTransition } from "react-transition-group";

function App() {
  return (
    <Navbar>
      <NavItem icon={<CaretIcon />}>
        <DropdownMenu></DropdownMenu>
      </NavItem>
    </Navbar>
  );
}

function Navbar(props) {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">{props.children}</ul>
    </nav>
  );
}

function NavItem(props) {
  const [open, setOpen] = useState(false);

  return (
    <li className="nav-item">
      <a href="#" className="icon-button" onClick={() => setOpen(!open)}>
        {props.icon}
      </a>

      {open && props.children}
    </li>
  );
}

function DropdownMenu() {
  const [activeMenu, setActiveMenu] = useState("main");
  const [menuHeight, setMenuHeight] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMenuHeight(dropdownRef.current?.firstChild.offsetHeight);
  }, []);

  function calcHeight(el) {
    const height = el.offsetHeight;
    setMenuHeight(height);
  }

  function DropdownItem(props) {
    return (
      <a
        href="#"
        className="menu-item"
        onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}
      >
        <span className="icon-button">{props.leftIcon}</span>
        {props.children}
        <span className="icon-right">{props.rightIcon}</span>
      </a>
    );
  }

  return (
    <div className="dropdown" style={{ height: menuHeight }} ref={dropdownRef}>
      <CSSTransition
        in={activeMenu === "main"}
        timeout={500}
        classNames="menu-primary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className="menu">
          <DropdownItem leftIcon="📘">About</DropdownItem>
          <DropdownItem
            leftIcon={<CogIcon />}
            rightIcon={<ChevronIcon />}
            goToMenu="settings"
          >
            Sensors
          </DropdownItem>
          <DropdownItem
            leftIcon="⏱"
            rightIcon={<ChevronIcon />}
            goToMenu="animals"
          >
            Duration
          </DropdownItem>
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === "settings"}
        timeout={500}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className="menu">
          <DropdownItem goToMenu="main" leftIcon={<ArrowIcon id="arrowIcon" />}>
            <h2>Sensors</h2>
          </DropdownItem>
          <DropdownItem leftIcon={<BoltIcon />}>Sensor 1</DropdownItem>
          <DropdownItem leftIcon={<BoltIcon />}>Sensor 2</DropdownItem>
          <DropdownItem leftIcon={<BoltIcon />}>Sensor 3</DropdownItem>
          <DropdownItem leftIcon={<BoltIcon />}>Sensor 4</DropdownItem>
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === "animals"}
        timeout={500}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className="menu">
          <DropdownItem goToMenu="main" leftIcon={<ArrowIcon id="arrowIcon" />}>
            <h2>Duration</h2>
          </DropdownItem>
          <DropdownItem leftIcon="🦘">1 Day</DropdownItem>
          <DropdownItem leftIcon="🦋">1 Week</DropdownItem>
          <DropdownItem leftIcon="🐸">1 Month</DropdownItem>
          <DropdownItem leftIcon="🦔">1 Year</DropdownItem>
        </div>
      </CSSTransition>
    </div>
  );
}

export default App;
