import React, { useState, useEffect, useCallback } from "react";
import { Router } from "react-router-dom";
import {
  Card,
  ListGroupItem,
  ListGroup,
  Button,
  Row,
  Form
} from "react-bootstrap";

import { getUserInfo, register, createStake } from "../web3";
import { ZERO_ADDRESS } from "../web3/constants";

import Modal from "./Modal";

import history from "../history";

export default function Dashboard({ account }) {
  const [registering, setRegistering] = useState(false);
  const [registerModal, setRegisterModal] = useState(false);
  const [referrer, setReferrer] = useState("");
  const [userInfo, setUserInfo] = useState({});

  const [stake, setStake] = useState({ amount: "", option: "", modal: false });

  const handleRegister = async () => {
    try {
      setRegistering(true);
      await register(referrer ? referrer : ZERO_ADDRESS, account);
      setRegistering(false);
      checkUser();
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleStake = async () => {
    try {
      setStake({ ...stake, waiting: true, modal: false });
      await createStake(stake.amount, stake.option, account);
      setStake({ ...stake, waiting: false, modal: false });
      checkUser();
    } catch (error) {
      console.log(error.message);
    }
  };

  const checkUser = useCallback(() => {
    getUserInfo(account).then(userInfo => setUserInfo(userInfo));
  }, [account]);

  useEffect(() => {
    checkUser();
    setReferrer(history.location.pathname.substr(1));
  }, [account, checkUser]);

  return (
    <Row className="justify-content-center">
      <div style={{ width: "80%" }}>
        <Card className="mt-5 mb-3">
          <Card.Title className="text-center mt-3 p-3 font-weight-bold">
            YOUR DASHBOARD
          </Card.Title>
          <Card.Body className="align-self-center" style={{ width: "80%" }}>
            {registering && <p>Registering to Staking Contract...</p>}
            {userInfo.isRegistered ? (
              <ListGroup className="list-group-flush">
                <ListGroupItem>
                  <strong>Referrer: </strong>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://kovan.etherscan.io/address/${userInfo.referrer}`}
                  >
                    {userInfo.referrer}
                  </a>
                </ListGroupItem>
                <ListGroupItem>
                  <strong>Active Stakes: </strong>
                  <p>{userInfo.activeStakes}</p>
                </ListGroupItem>

                <ListGroupItem>
                  <strong>Total Referees: </strong>
                  <p>{userInfo.amountReferees}</p>
                </ListGroupItem>
                <ListGroupItem>
                  <strong>PGOLD Balance: </strong>
                  <p>{userInfo.balance}</p>
                </ListGroupItem>
              </ListGroup>
            ) : !registering ? (
              <div className="text-center">
                <p>You need to register first!</p>
              </div>
            ) : null}
          </Card.Body>
          <Card.Footer className="text-center">
            <Row className="justify-content-around">
              {userInfo.isRegistered ? (
                <Button
                  variant="outline-dark"
                  onClick={() => setStake({ ...stake, modal: true })}
                >
                  NEW STAKE
                </Button>
              ) : (
                <Button
                  variant="outline-dark"
                  onClick={() => setRegisterModal(true)}
                >
                  REGISTER
                </Button>
              )}
            </Row>
          </Card.Footer>
        </Card>
      </div>
      <Modal
        modalOpen={registerModal}
        toggleModal={() => setRegisterModal(!registerModal)}
        onConfirm={handleRegister}
        title="Registering"
      >
        <Form.Label>Referrer Address</Form.Label>
        <Form.Control
          className="mb-2"
          style={{ width: "80%" }}
          type="text"
          placeholder="Enter your referrer address"
          onChange={e => setReferrer(e.target.value)}
          value={referrer}
        />
      </Modal>

      <Modal
        modalOpen={stake.modal}
        toggleModal={() => setStake({ ...stake, modal: false })}
        onConfirm={handleStake}
        title="Staking"
      >
        <Form.Control
          className="mb-2"
          style={{ width: "80%" }}
          type="number"
          placeholder="Enter amount to stake"
          onChange={e => setStake({ ...stake, amount: e.target.value })}
          value={stake.amount}
        />
        <Form.Control
          className="mb-2"
          style={{ width: "80%" }}
          type="number"
          placeholder="Enter reward system option"
          onChange={e => setStake({ ...stake, option: e.target.value })}
          value={stake.option}
        />
      </Modal>
    </Row>
  );
}
