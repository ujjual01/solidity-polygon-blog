import '../styles/globals.css'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { AccountContext } from './context.js'
import { ownerAddress } from '../config'
import 'easymde/dist/easymde.min.css'
import { useState } from 'react'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  /* create local state to save account information after signin */
  const [account, setAccount] = useState(null)
  /* web3Modal configuration for enabling wallet access */
  async function getWeb3Modal() {
    const web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: false,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: { 
            infuraId: process.env.NEXT_PUBLIC_INFURA_ID
          },
        },
      },
    })
    return web3Modal
  }

  /* the connect function uses web3 modal to connect to the user's wallet */
  async function connect() {
    try {
      const web3Modal = await getWeb3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const accounts = await provider.listAccounts()
      setAccount(accounts[0])
    } catch (err) {
      console.log('error:', err)
    }
  }

  return (
    <div>
      <nav className="">
        <div className="">
          <Link href="/">
            <a>
              <img
                src='/logo.svg'
                alt="React Logo"
                style={{ width: '50px' }}
              />
            </a>
          </Link>
          <Link href="/">
            <a>
              <div className="">
                <h2 className="">Full Stack</h2>
                <p className="">WEB3</p>
              </div>
            </a>
          </Link>
          {
            !account && (
              <div className="">
                <button className="" onClick={connect}>Connect</button>
              </div>
            )
          }
          {
            account && <p className="">{account}</p>
          }
        </div>
        <div className="">
          <Link href="/" >
            <a className="">
              Home
            </a>
          </Link>
          {
            /* if the signed in user is the contract owner, we */
            /* show the nav link to create a new post */
            (account === ownerAddress) && (
              <Link href="/create-post">
                <a className="">
                  Create Post
                </a>
              </Link>
            )
          }
        </div>
      </nav>
      <div className="">
        <AccountContext.Provider value={account}>
          <Component {...pageProps} connect={connect} />
        </AccountContext.Provider>
      </div>
    </div>
  )
}

export default MyApp
