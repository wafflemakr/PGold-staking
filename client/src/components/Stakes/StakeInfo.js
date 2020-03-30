import React from "react";

import {
  Container,
  Button,
  Row,
  ListGroup,
  ListGroupItem
} from "react-bootstrap";

const formatDate = timestamp => {
  let date = new Date(null);
  date.setSeconds(timestamp);
  return date
    .toISOString()
    .slice(0, 19)
    .replace(/-/g, "/")
    .replace("T", " ");
};

export default function StakeInfo({ info, goBack }) {
  console.log(info);
  return (
    <Container className="justify-content-center">
      <ListGroup className="list-group-flush mb-3">
        <ListGroupItem>
          <strong>ID: </strong>
          <span>{info.id}</span>
        </ListGroupItem>

        <ListGroupItem>
          <strong>Amount: </strong>
          <span>{info.amountStaked} GOLD</span>
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
          <span>{info.currentRewards} GOLD</span>
        </ListGroupItem>

        <ListGroupItem>
          <strong>Start Time: </strong>
          <span>{formatDate(info.timeStaked)}</span>
        </ListGroupItem>

        <ListGroupItem>
          <strong>Claim Time: </strong>
          <span>{formatDate(info.stakeEndTime)}</span>
        </ListGroupItem>
      </ListGroup>

      <Row className="justify-content-around p-3">
        <Button
          disabled={!info.canClaim}
          variant={info.canClaim ? "outline-info" : "outline-dark"}
        >
          END STAKE
        </Button>
        <Button variant="outline-dark" onClick={goBack}>
          BACK
        </Button>
      </Row>
    </Container>
  );
}
