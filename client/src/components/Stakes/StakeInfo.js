import React, { useState } from "react";
import { endStake } from "../../web3";

import {
  Container,
  Button,
  Row,
  ListGroup,
  ListGroupItem,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";

const formatDate = (timestamp) => {
  let date = new Date(null);
  date.setSeconds(timestamp);
  return date.toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " ");
};

export default function StakeInfo({ account, info, goBack }) {
  const [ending, setEnding] = useState(false);

  const handleClaim = async () => {
    try {
      setEnding(true);
      console.log(info.id, account);
      await endStake(info.id, account);
      setEnding(false);

      goBack();
    } catch (error) {
      setEnding(false);
      console.log(error.message);
    }
  };

  return (
    <Container className="justify-content-center w-60">
      <ListGroup className="list-group-flush mb-3">
        <ListGroupItem>
          <strong>ID: </strong>
          <span>{info.id}</span>
        </ListGroupItem>

        <ListGroupItem>
          <strong>Amount: </strong>
          <span>
            {new Intl.NumberFormat("en-US").format(info.amountStaked)} GOLD
          </span>
        </ListGroupItem>

        <ListGroupItem>
          <strong>Reward Program Option Chosen: </strong>
          <span>{info.option}</span>
        </ListGroupItem>

        <ListGroupItem>
          <strong>Anual Rate: </strong>
          <span>{info.rate / 1000} %</span>
        </ListGroupItem>

        <ListGroupItem>
          <strong>Current Rewards: </strong>
          <span>
            {new Intl.NumberFormat("en-US", {
              maximumSignificantDigits: 20,
            }).format(info.currentRewards)}{" "}
            GOLD
          </span>
        </ListGroupItem>

        <ListGroupItem>
          <strong>Start Time: </strong>
          <span>{formatDate(info.timeStaked)}</span>
        </ListGroupItem>

        <ListGroupItem>
          <strong>Claim Time: </strong>
          <span>{formatDate(info.stakeEndTime)}</span>
        </ListGroupItem>

        <ListGroupItem>
          <strong>Claimed: </strong>
          <span>{info.claimed ? "true" : "false"}</span>
        </ListGroupItem>
      </ListGroup>

      <Row className="justify-content-around p-3">
        {!info.claimed && (
          <OverlayTrigger
            placement="right"
            overlay={
              <Tooltip>
                {info.canClaim ? "Claim your Rewards!" : "Can't Claim Yet!"}
              </Tooltip>
            }
          >
            <Button
              variant={info.canClaim ? "outline-info" : "outline-dark"}
              onClick={info.canClaim ? handleClaim : null}
            >
              {ending ? (
                <div className="d-flex align-items-center">
                  ENDING
                  <span className="loading ml-2"></span>
                </div>
              ) : (
                "END STAKE"
              )}
            </Button>
          </OverlayTrigger>
        )}
        <Button variant="outline-dark" onClick={goBack}>
          BACK
        </Button>
      </Row>
    </Container>
  );
}
