import React from "react";

import {
  Container,
  Button,
  Row,
  ListGroup,
  ListGroupItem
} from "react-bootstrap";

const formatDate = timestamp => {
  const date = new Date();
  date.setTime(timestamp);
  return String(date);
};

export default function StakeInfo({ info, goBack }) {
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
          <strong>Current Rewards: </strong>
          <span>{info.currentRewards} GOLD</span>
        </ListGroupItem>

        <ListGroupItem>
          <strong>Start Time: </strong>
          <span>{formatDate(info.timeStaked * 1000)}</span>
        </ListGroupItem>

        <ListGroupItem>
          <strong>Claim Time: </strong>
          <span>{formatDate(info.stakeEndTime * 1000)}</span>
        </ListGroupItem>
      </ListGroup>

      <Row className="justify-content-around">
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
