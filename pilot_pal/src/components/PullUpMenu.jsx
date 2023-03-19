import React, { useState } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import './PullUpMenu.css';

function PullUpMenu() {
  const [isOpen, setIsOpen] = useState(false);

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
        <Dropdown.Item>Option 1</Dropdown.Item>
        <Dropdown.Item>Option 2</Dropdown.Item>
        <Dropdown.Item>Option 3</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default PullUpMenu;
