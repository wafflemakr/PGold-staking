import React, { useState, useEffect, useCallback } from "react";
import { Switch, Router, Route, Redirect } from "react-router-dom";
import { Container, Row } from "react-bootstrap";
import "./App.css";

import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Stakes from "./components/Stakes/";
import RewardProgram from "./components/RewardProgram";
import ReactLoading from "react-loading";

import history from "./history";

import { STAKING_CONTRACT, TOKEN_ADDRESS } from "./web3/constants";
import erc20Abi from "./web3/abis/erc20";
import stakingAbi from "./web3/abis/staking";

const netId = "4";
const Web3 = window.Web3;

function App() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  const connectWeb3 = useCallback(async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
      console.log("Using Ethereum enabled browser");
      window.web3 = new Web3(window.ethereum);

      window.web3.eth.transactionConfirmationBlocks = 1; //Hard code number of blocks needed

      let contract = new window.web3.eth.Contract(stakingAbi, STAKING_CONTRACT);
      window.staking = contract;

      contract = new window.web3.eth.Contract(erc20Abi, TOKEN_ADDRESS);
      window.token = contract;

      try {
        await window.ethereum.enable();
        setAccount(window.ethereum.selectedAddress);

        //If accounts change
        window.ethereum.on("accountsChanged", accounts => {
          console.log("accounts changed");
          if (accounts.length > 0) setAccount(accounts[0]);
          else setAccount(null);
        });
      } catch (error) {
        console.error("You must approve this dApp to interact with it");
      }
    }
    // Non-dapp browsers...
    else {
      alert("Please Install Metamask");
    }
  }, []);

  useEffect(() => {
    connectWeb3().then(() => setLoading(false));
  }, [account, connectWeb3]);

  const routes = (
    <Switch>
      <Route path="/stakes" exact>
        <Stakes account={account} />
      </Route>
      <Route path="/reward" exact>
        <RewardProgram />
      </Route>
      <Route path="/">
        <Dashboard account={account} />
      </Route>
      <Redirect to="/" />
    </Switch>
  );
  if (loading)
    return (
      <Container>
        <Router history={history}>
          <Header account={account} connectWeb3={connectWeb3} />
          <Row className="justify-content-center mt-5">
            <ReactLoading
              className="text-center"
              type="spin"
              color="#343a40"
              height={333}
              width={187}
            />
          </Row>
        </Router>
      </Container>
    );

  if (!account)
    return (
      <Container>
        <Router history={history}>
          <Header account={account} connectWeb3={connectWeb3} />
          Connect to your web3 Wallet
        </Router>
      </Container>
    );

  if (account && window.web3.givenProvider.networkVersion !== netId)
    return (
      <Container>
        <Router history={history}>
          <Header account={account} connectWeb3={connectWeb3} />
          Please switch to Rinkeby Network
        </Router>
      </Container>
    );
  return (
    <Container>
      <Router history={history}>
        <Header account={account} connectWeb3={connectWeb3} />
        {routes}
      </Router>
    </Container>
  );
}

export default App;
