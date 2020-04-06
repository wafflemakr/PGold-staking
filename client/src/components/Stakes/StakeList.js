import React from "react";

import { Table } from "react-bootstrap";

export default function StakeList({ stakes, checkInfo }) {
  return (
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
            key={key}
            onClick={() => checkInfo(s.id)}
            style={{ cursor: "pointer" }}
          >
            <td>{s.id}</td>
            <td>{new Intl.NumberFormat("en-US").format(s.amount)}</td>
            <td>{s.rate}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
