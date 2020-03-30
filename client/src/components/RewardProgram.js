import React from "react";

import { Container, Image } from "react-bootstrap";

import image from "../assets/rewards.jpg";

export default function RewardProgram() {
  return (
    <Container className="text-center">
      <Image src={image} height="700" />
    </Container>
  );
}
