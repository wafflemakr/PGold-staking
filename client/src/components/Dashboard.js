import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  ListGroupItem,
  ListGroup,
  Button,
  Row,
  Form,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { MdContentCopy } from "react-icons/md"; // Material Design
import copy from "copy-to-clipboard";
import ReactLoading from "react-loading";

import { getUserInfo, register, createStake } from "../web3";
import { ZERO_ADDRESS } from "../web3/constants";

import Modal from "./Modal";

import history from "../history";

export default function Dashboard({ account }) {
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [registerModal, setRegisterModal] = useState(false);
  const [referrer, setReferrer] = useState("");
  const [userInfo, setUserInfo] = useState({});

  const [stake, setStake] = useState({
    amount: "",
    option: "1",
    modal: false,
    waiting: false,
  });

  const handleCopy = () => {
    copy(window.location.href + account);
    alert("Copied!");
  };

  const handleRegister = async () => {
    try {
      setRegistering(true);
      await register(referrer ? referrer : ZERO_ADDRESS, account);
      setRegistering(false);
      checkUser();
    } catch (error) {
      setRegistering(false);
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
      setStake({ ...stake, waiting: false, modal: false });
      console.log(error.message);
    }
  };

  const checkUser = useCallback(() => {
    getUserInfo(account).then((userInfo) => {
      setUserInfo(userInfo);
      setLoading(false);
    });
  }, [account]);

  useEffect(() => {
    checkUser();
    setReferrer(history.location.pathname.substr(1));
  }, [account, checkUser]);

  if (loading)
    return (
      <Row className="justify-content-center mt-5">
        <ReactLoading
          className="text-center"
          type="spin"
          color="#343a40"
          height={333}
          width={187}
        />
      </Row>
    );

  return (
    <Row className="justify-content-center">
      <div style={{ width: "85%" }}>
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
                  {userInfo.referrer === ZERO_ADDRESS ? (
                    "(none)"
                  ) : (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://rinkeby.etherscan.io/address/${userInfo.referrer}`}
                    >
                      {userInfo.referrer}
                    </a>
                  )}
                </ListGroupItem>
                <ListGroupItem>
                  <strong>Active Stakes: </strong>
                  <span>
                    <Link to="/stakes">{userInfo.activeStakes}</Link>
                  </span>
                </ListGroupItem>

                <ListGroupItem>
                  <strong>Total Referees: </strong>
                  <span>{userInfo.amountReferees}</span>
                </ListGroupItem>
                <ListGroupItem>
                  <strong>PGOLD Balance: </strong>
                  <span>
                    {new Intl.NumberFormat("en-US").format(userInfo.balance)}
                  </span>
                </ListGroupItem>

                <ListGroupItem>
                  <strong>Referral Link: </strong>
                  <div>
                    {window.location.href + account}
                    <span>
                      <MdContentCopy
                        onClick={handleCopy}
                        data-toggle="tooltip"
                        title="Copy Ref Link"
                        style={{ cursor: "pointer" }}
                        size="20px"
                        className="ml-3 text-dark"
                      />
                    </span>
                  </div>
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
                  {stake.waiting ? (
                    <div className="d-flex align-items-center">
                      STAKING
                      <span className="loading ml-2"></span>
                    </div>
                  ) : (
                    "NEW STAKE"
                  )}
                </Button>
              ) : (
                <Button
                  variant="outline-dark"
                  onClick={() => setRegisterModal(true)}
                >
                  {registering ? (
                    <div className="d-flex align-items-center">
                      REGISTERING
                      <span className="loading ml-2"></span>
                    </div>
                  ) : (
                    "REGISTER"
                  )}
                </Button>
              )}
            </Row>
          </Card.Footer>
        </Card>
        <p className="text-warning font-weight-bold">
          DISCLAIMER: There is no warranty. We do not assume any responsibility
          for bugs, vulnerabilities, or any other technical defects in the
          Staking smart contract. Use it at your own risk.
        </p>

        <p className="text-center">
          Contract Address:{" "}
          <a href="https://etherscan.io/address/0xe53d86543b98a60231fa55ada4d90c48c9fad382">
            0xe53d86543b98a60231fa55ada4d90c48c9fad382
          </a>
        </p>
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
          onChange={(e) => setReferrer(e.target.value)}
          value={referrer}
        />
      </Modal>

      <Modal
        modalOpen={stake.modal}
        toggleModal={() => setStake({ ...stake, modal: false })}
        onConfirm={handleStake}
        title="Staking"
      >
        <Form.Label className="font-weight-bold">Amount PGOLD</Form.Label>
        <Form.Control
          className="mb-2"
          style={{ width: "80%" }}
          type="number"
          max={Number(userInfo.balance)}
          placeholder="Enter amount of tokens to stake"
          onChange={(e) => setStake({ ...stake, amount: e.target.value })}
          value={stake.amount}
        />
        <div key={`inline-radio`} className="mt-3 mb-2">
          <Form.Label className="font-weight-bold">
            Choose Reward Option
          </Form.Label>
          <br />
          <Form.Check
            className="ml-2"
            label="1 (6 months = 3% APR)"
            type="radio"
            id={`inline-radio-1`}
            checked={stake.option === "1"}
            onChange={(e) => setStake({ ...stake, option: "1" })}
            value="1"
          />

          <Form.Check
            className="ml-2"
            label="2 (12 months = 4.5% APR)"
            type="radio"
            id={`inline-radio-2`}
            checked={stake.option === "2"}
            onChange={(e) => setStake({ ...stake, option: "2" })}
            value="2"
          />

          <Form.Check
            className="ml-2"
            label="3 (18 months = 6.5% APR)"
            type="radio"
            id={`inline-radio-3`}
            value="3"
            checked={stake.option === "3"}
            onChange={(e) => setStake({ ...stake, option: "3" })}
          />
        </div>
      </Modal>
    </Row>
  );
}
