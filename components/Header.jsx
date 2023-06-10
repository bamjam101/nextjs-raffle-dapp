import React from "react"
import { ConnectButton } from "web3uikit"

const Header = () => {
    return (
        <nav className="py-5 border-b-2 flex justify-between items-center">
            <h1 className="py-4 font-bold text-3xl"> Decentralized Lottery</h1>
            <div className="ml-auto py-2">
                {/* Moralis enables us with a clean modal to choose the type of wallet to connect with as well as handles the state management - connection, disconnection, account switching (facilitated using localstorage under the hood) */}
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}

export default Header
