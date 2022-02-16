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
      <nav className="bg-white">
        <div className="flex border-b  px-2 py-3">
          <Link href="/">
            <a>
              <img
                src='/icon.svg'
                alt="React Logo"
                style={{ width: '50px' }}
              />
            </a>
          </Link>
          <Link href="/">
            <a>
              <div className="flex flex-col pl-2 ">
                <h2 className="ml-3 m-0 font-medium">Full Stack</h2>
                <p className="m-0 ml-3 text-[#4d4b4b]">WEB3</p>
              </div>
            </a>
          </Link>
          {
            !account && (
              <div className="flex flex-1 justify-end w-screen">
                <button className="bg-[#fafafa] outline-none border-none text-base px-4 py-3 cursor-pointer rounded-md  shadow " onClick={connect}>Connect</button>
              </div>
            )
          }
          {
            account && <p className="w-screen flex flex-1 justify-end text-lg">{account}</p>
          }
        </div>
        <div className=" px-2 py-4 bg-[#fafafa]">
          <Link href="/" >
            <a className=" text-lg font-medium ml-2">
              Home
            </a>
          </Link>
          {
            
            (account === ownerAddress) && (
              <Link href="/create-post">
                <a className="text-lg font-medium ml-2">
                  Create Post
                </a>
              </Link>
            )
          }
        </div>
      </nav>
      <div className="p-7">
        <AccountContext.Provider value={account}>
          <Component {...pageProps} connect={connect} />
        </AccountContext.Provider>
      </div>
    </div>
  )
}

export default MyApp
