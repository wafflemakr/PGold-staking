import React, { useState, useEffect } from "react";

import { Card, Row } from "react-bootstrap";

import StakeList from "./StakeList";
import StakeInfo from "./StakeInfo";

import { getStakeList, getStakeDetails } from "../../web3";

export default function Stakes({ account }) {
  const [stakes, setStakes] = useState([]);
  const [show, setShow] = useState("list");
  const [stakeInfo, setStakeInfo] = useState(null);

  const handleStakeCheck = async id => {
    const stakeDetails = await getStakeDetails(account, id);
    setStakeInfo(stakeDetails);
    setShow("info");
  };

  useEffect(() => {
    getStakeList(account).then(_stakes => setStakes(_stakes));
  }, []);

  return (
    <Row className="justify-content-center">
      <div style={{ width: "90%" }}>
        <Card className="mt-5 mb-3">
          <Card.Title className="text-center mt-3 p-3 font-weight-bold">
            {show === "list" ? "STAKE LIST" : "STAKE INFO"}
          </Card.Title>
          <Card.Body className="align-self-center" style={{ width: "90%" }}>
            {show === "list" && (
              <StakeList
                stakes={stakes}
                checkInfo={id => handleStakeCheck(id)}
              />
            )}
            {show === "info" && (
              <StakeInfo info={stakeInfo} goBack={() => setShow("list")} />
            )}
          </Card.Body>
        </Card>
      </div>
    </Row>
  );
}
