import React, { useEffect, useState } from "react"
import { ethers } from "ethers"
import { abi, contractAddresses } from "../constants"
import { useMoralis, useWeb3Contract } from "react-moralis"

const JoinRaffle = () => {
    // Component state variables
    const [enlistmentFee, setEnlistmentFee] = useState("0")

    const { chainId: chainIdHex, isWeb3Enabled, isWeb3EnableLoading } = useMoralis()
    const chainId = parseInt(chainIdHex) // chainId returned by Moralis is in hex format therefore we require to parse it to integer format to pick out appropriate contract address from contants/contractAddresses.json

    // Configures Raffle smart contract address
    const raffleContractAddress =
        chainId in contractAddresses ? contractAddresses[chainId][0] : null

    // Moralis hook useWeb3Contract allows us to interact with deployed smart contracts using runContractFunction, which can be a function that is exposed by a smart contract.
    const { runContractFunction: joinRaffle } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleContractAddress,
        functionName: "joinRaffle",
        params: {},
        msgValue: enlistmentFee,
    })

    const { runContractFunction: getEnlistmentFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleContractAddress,
        functionName: "getEnlistmentFee",
        params: {},
    })

    useEffect(() => {
        if (!isWeb3Enabled) {
            // try to read the raffle enlistment fee
            async function fetchEnlistmentFee() {
                const response = (await getEnlistmentFee()).toString()
                console.log(
                    `The enlistment or joining fees to participate in the raffle is ${response}`
                )
                setEnlistmentFee(response)
            }
            fetchEnlistmentFee()
        }
    }, [isWeb3Enabled])
    return (
        <main>
            {" "}
            <header>
                <h2>Welcome to Raffle. We are sure you are ready to test out you LUCK!</h2>
            </header>
            {raffleContractAddress ? (
                <section>
                    <h3>Joining fee is {ethers.utils.formatUnits(response, "ether")} ETH</h3>
                    <button
                        onClick={async () => await joinRaffle()}
                        className="px-4 py-2 rounded-lg hover:scale-105 transition-transform duration-300 bg-sky-400 text-black font-bold"
                    >
                        Join Raffle
                    </button>
                </section>
            ) : (
                <section className="mt-10 w-full place-items-center">
                    <p className="text-center bg-red-500 p-2 rounded-lg">
                        We&apos;re Sorry! No Raffle Address Deteched.
                    </p>
                </section>
            )}
        </main>
    )
}

export default JoinRaffle
