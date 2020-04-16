import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, Button, Row } from "react-bootstrap";

export default function Header({ account, connectWeb3, logout, isPool }) {
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
      {isPool && (
        <Nav.Link as={NavLink} to="/admin" exact>
          Admin Panel
        </Nav.Link>
      )}
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
      style={{ height: "70px" }}
    >
      <div>
        <Navbar.Toggle onClick={() => setExpanded((prev) => !prev)} />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto" onClick={() => setExpanded(false)}>
            {routes}
          </Nav>
        </Navbar.Collapse>
      </div>
      <div className="align-self-baseline">
        <Nav>
          {/* <Navbar.Text> */}
          {account ? (
            <Row className="mr-2">
              <Nav.Link
                className="align-self-center mr-2"
                onClick={() => setExpanded(false)}
                target="_blank"
                rel="noopener noreferrer"
                href={`https://rinkeby.etherscan.io/address/${account}`}
              >
                Connected to:{" "}
                {account.substring(0, 4) + "..." + account.substring(38, 42)}
              </Nav.Link>
              <Nav.Link>
                <Button variant="info" onClick={logout}>
                  Logout
                </Button>
              </Nav.Link>
            </Row>
          ) : (
            window.web3 && (
              <Row className="mr-2">
                <Nav.Link>
                  <Button className="mr-2" variant="info" onClick={connectWeb3}>
                    Connect to Web3
                  </Button>
                </Nav.Link>
              </Row>
            )
          )}
          {/* </Navbar.Text> */}
        </Nav>
      </div>
    </Navbar>
  );
}
