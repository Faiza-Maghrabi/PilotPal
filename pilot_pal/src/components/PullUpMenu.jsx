import React, { useState } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import './PullUpMenu.css';

function PullUpMenu({show, onOptionClick }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!show){return <></>;}

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Dropdown show={isOpen} autoClose="outside" onToggle={toggle}>
      <Dropdown.Toggle
        as={Button}
        variant="Secondary"
        id="Dropdown"
      ></Dropdown.Toggle>
      <Dropdown.Menu style={{ color: 'light blue' }}>
        <Dropdown.Item
          onClick={() => {
            onOptionClick(0);
          }}
        >
          Current Weather
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            onOptionClick(1);
          }}
        >
          Tomorrow
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            onOptionClick(2);
          }}
        >
          Day after Tomorrow
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default PullUpMenu;
