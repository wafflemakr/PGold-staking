import React, { useState, useCallback, useEffect } from "react";
import { Switch, Router, Route, Redirect } from "react-router-dom";
import { Container, Row } from "react-bootstrap";
import "./App.css";

import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Stakes from "./components/Stakes/";
import RewardProgram from "./components/RewardProgram";
import Admin from "./components/Admin";
import ReactLoading from "react-loading";

import history from "./history";

import { STAKING_CONTRACT, TOKEN_ADDRESS } from "./web3/constants";
import erc20Abi from "./web3/abis/erc20";
import stakingAbi from "./web3/abis/staking";

const netId = "1";
const Web3 = window.Web3;

function App() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPool, setIsPool] = useState(false);

  const logout = () => {
    setAccount(null);
  };

  const connectWeb3 = useCallback(async () => {
    setLoading(true);
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
        window.ethereum.on("accountsChanged", (accounts) => {
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
    setLoading(false);
  }, []);

  useEffect(() => {
    const checkPool = async () => {
      const _pool = await window.staking.methods.pool().call();
      setIsPool(_pool === window.web3.utils.toChecksumAddress(account));
    };
    if (window.staking && account) checkPool();
  }, [account]);

  const routes = (
    <Switch>
      {isPool && (
        <Route path="/admin">
          <Admin account={account} />
        </Route>
      )}
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
          <Header account={account} logout={logout} connectWeb3={connectWeb3} />
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
          <Header account={account} logout={logout} connectWeb3={connectWeb3} />
          <div className="p-5">
            <h3>Connect to your web3 Wallet</h3>
          </div>
        </Router>
      </Container>
    );

  if (account && window.web3.givenProvider.networkVersion !== netId)
    return (
      <Container>
        <Router history={history}>
          <Header account={account} logout={logout} connectWeb3={connectWeb3} />
          <div className="p-5">
            <h3> Please switch to Ethereum Mainnet</h3>
          </div>
        </Router>
      </Container>
    );
  return (
    <Container>
      <Router history={history}>
        <Header
          account={account}
          logout={logout}
          connectWeb3={connectWeb3}
          isPool={isPool}
        />
        {routes}
      </Router>
    </Container>
  );
}

export default App;
