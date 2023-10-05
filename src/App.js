import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers';
import contractABI from './GiveForeverABI.json';

const contractAddress = '0x2187427dCd47207c95AbC1d0f4432c10df5F2a52'; // Goerli
let provider = new ethers.providers.Web3Provider(window.ethereum);
let contract = new ethers.Contract(contractAddress, contractABI, provider);
let signer;

function App() {
  const [donated,setDonated] = useState(0);
  const [lidoBalance,setLidoBalance] = useState(0);
  const [surplus,setSurplus] = useState(0);

  const connect = async () => {
    await provider.send("eth_requestAccounts",[]);
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, contractABI, signer);
    const userAddress = await signer.getAddress();
    console.log(userAddress);
  }
  
  const deposit = async () => {
    let userAmount = document.getElementById('deposit-amount').value;
    const weiAmount = ethers.utils.parseEther(userAmount);
    const tx = await contract.deposit({ value: weiAmount});
    const receipt = await tx.wait();
    updateBalances();
  }
  
  const withdraw = async () => {
    await contract.withdraw();
    updateBalances();
  }
  
  const updateBalances = async () => {
    const donated = await contract.donated();
    setDonated(ethers.utils.formatEther(donated));
    const lidoBalance = await contract.lidoBalance();
    setLidoBalance(ethers.utils.formatEther(lidoBalance));
    const surplus = lidoBalance.sub(donated);
    setSurplus(ethers.utils.formatEther(surplus));
  }

  setTimeout(() => {
    updateBalances();
  },
  1000);
  
  return (
    <div className="App">
      <header className="App-header">
        <h1><span className="blue">確認</span>購買</h1>
        <p>
          請連結Meta Mask錢包
        </p>
        <div className="App-body">
          <div className='App-balances'>
            目前的餘額: {lidoBalance} ETH<br />
            支付後剩餘: {surplus} ETH<br />
          </div>
          <div className="App-button-box">
            <button onClick={connect}>連結</button>
          </div>
          <div className="App-button-box">
            <input type="text" id="deposit-amount" 
            placeholder="999ETH" /><br />
            <button onClick={deposit}>確認支付</button>
          </div>
      </div>
      </header>
    </div>
  );
}

export default App;