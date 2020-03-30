import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, Button } from "react-bootstrap";

export default function Header({ account, connectWeb3 }) {
  const [expanded, setExpanded] = useState(false);

  let routes = (
    <>
      <Nav.Link as={NavLink} to="/" exact>
        Dashboard
      </Nav.Link>
      <Nav.Link as={NavLink} to="/stakes" exact>
        Stakes
      </Nav.Link>
      <Nav.Link as={NavLink} to="/reward" exact>
        Reward Program
      </Nav.Link>
    </>
  );

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="dark"
      variant="dark"
      expanded={expanded}
      className="justify-content-between"
    >
      <div>
        <Navbar.Toggle onClick={() => setExpanded(prev => !prev)} />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto" onClick={() => setExpanded(false)}>
            {routes}
          </Nav>
        </Navbar.Collapse>
      </div>
      <div className="align-self-baseline">
        <Nav>
          <Navbar.Text>
            {account ? (
              <>
                <Nav.Link
                  onClick={() => setExpanded(false)}
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://kovan.etherscan.io/address/${account}`}
                >
                  Connected to:{" "}
                  {account.substring(0, 5) + "..." + account.substring(37, 42)}
                </Nav.Link>
              </>
            ) : (
              window.web3 && (
                <Button className="mr-2" variant="info" onClick={connectWeb3}>
                  Connect to Web3
                </Button>
              )
            )}
          </Navbar.Text>
        </Nav>
      </div>
    </Navbar>
  );
}
