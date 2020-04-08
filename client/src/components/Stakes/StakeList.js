import React from "react";

import { Table, Row, Col } from "react-bootstrap";

export default function StakeList({ stakes, checkInfo }) {
  console.log(stakes);

  const getStakeColor = (s) => {
    if (s.endTime * 1000 < Date.now() && !s.claimed) return "table-success";
    else if (s.claimed) return "table-info";
    else return "";
  };
  return (
    <>
      <Table striped bordered hover className="text-center">
        <thead>
          <tr>
            <th>ID</th>
            <th>Amount</th>
            <th>Anual Rate</th>
          </tr>
        </thead>
        <tbody>
          {stakes.map((s, key) => (
            <tr
              className={getStakeColor(s)}
              key={key}
              onClick={() => checkInfo(s.id)}
              style={{
                cursor: "pointer",
              }}
            >
              <td>{s.id}</td>
              <td>{new Intl.NumberFormat("en-US").format(s.amount)}</td>
              <td>{s.rate}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Row className="mt-5 ml-5 text-center justify-content-around">
        <Col>
          <Row>
            <p>Can Claim:</p>
            <div
              className="table-success ml-2"
              style={{
                width: "80px",
                height: "20px",
              }}
            />
          </Row>
        </Col>

        <Col>
          <Row>
            <p>Claimed: </p>
            <div
              className="table-info ml-2"
              style={{
                width: "80px",
                height: "20px",
              }}
            />
          </Row>
        </Col>
      </Row>
    </>
  );
}
