import React from "react";

import { Container, Image } from "react-bootstrap";

import image from "../assets/staking-program.png";

export default function RewardProgram() {
  return (
    <Container className="text-center mt-5">
      <Image src={image} height="500" />
    </Container>
  );
}
