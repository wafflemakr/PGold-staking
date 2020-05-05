import React, { useState, useEffect, useCallback } from "react";
import { STAKING_CONTRACT } from "../web3/constants";
import { Container, Card, Row, Button, Form } from "react-bootstrap";
import Modal from "./Modal";

export default function Admin({ account }) {
  const [allowance, setAllowance] = useState(0);
  const [balance, setBalance] = useState(0);
  const [tokensStaked, setTokensStaked] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [approve, setApprove] = useState({ modalOpen: false, amount: "" });

  const handleApprove = async () => {
    try {
      await window.token.methods
        .approve(STAKING_CONTRACT, +approve.amount * 10 ** 4)
        .send({ from: account });
    } catch (error) {
      console.log(error);
    }
  };

  const getStats = useCallback(async () => {
    try {
      const _allowance = await window.token.methods
        .allowance(account, STAKING_CONTRACT)
        .call();

      const _balance = await window.token.methods.balanceOf(account).call();

      const _tokensStaked = await window.token.methods
        .balanceOf(STAKING_CONTRACT)
        .call();

      const _totalUsers = await window.staking.methods.totalUsers().call();

      setAllowance(_allowance);
      setBalance(_balance);
      setTokensStaked(_tokensStaked);
      setTotalUsers(_totalUsers);
    } catch (error) {
      console.log(error);
    }
  }, [account]);

  useEffect(() => {
    if (account) getStats();
  }, [account, getStats]);

  return (
    <Container>
      <Modal
        modalOpen={approve.modalOpen}
        toggleModal={() => setApprove({ ...approve, modalOpen: false })}
        onConfirm={handleApprove}
        title="Approve Confirmation"
      >
        <Form.Control
          type="number"
          placeholder="Amount of tokens to approve"
          onChange={(e) => setApprove({ ...approve, amount: e.target.value })}
          value={approve.amount}
        />
      </Modal>
      <Row className="justify-content-center">
        <div style={{ width: "85%" }}>
          <Card className="mt-5 mb-3">
            <Card.Body className="align-self-center" style={{ width: "80%" }}>
              <Card.Title className="mt-3 mb-3 font-weight-bold">
                ADMIN PANEL
              </Card.Title>
              <Card.Text>
                Current Allowance:{" "}
                {new Intl.NumberFormat("en-US", {
                  maximumSignificantDigits: 20,
                }).format(allowance)}
              </Card.Text>
              <Card.Text>
                Wallet Balance:{" "}
                {new Intl.NumberFormat("en-US", {
                  maximumSignificantDigits: 20,
                }).format(balance)}
              </Card.Text>
              <Card.Text>
                Total Staked:{" "}
                {new Intl.NumberFormat("en-US", {
                  maximumSignificantDigits: 20,
                }).format(tokensStaked)}
              </Card.Text>
              <Card.Text>Total Users: {totalUsers}</Card.Text>
            </Card.Body>
            <Card.Footer>
              <Row className="justify-content-around">
                <Button
                  variant="outline-dark"
                  onClick={() => setApprove({ ...approve, modalOpen: true })}
                >
                  APPROVE
                </Button>
              </Row>
            </Card.Footer>
          </Card>
        </div>
      </Row>
    </Container>
  );
}
