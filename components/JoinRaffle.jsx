import React, { useEffect, useState } from "react"
import { ethers } from "ethers"
import { abi, contractAddresses } from "../constants"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useNotification } from "web3uikit"

const JoinRaffle = () => {
    // Component state variables
    const [enlistmentFee, setEnlistmentFee] = useState("0")
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const { chainId: chainIdHex, isWeb3Enabled, isWeb3EnableLoading } = useMoralis()
    const chainId = parseInt(chainIdHex) // chainId returned by Moralis is in hex format therefore we require to parse it to integer format to pick out appropriate contract address from contants/contractAddresses.json

    const dispatch = useNotification()
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

    const { runContractFunction: getEnlistmentFeeAmount } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleContractAddress,
        functionName: "getEnlistmentFeeAmount",
        params: {},
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleContractAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleContractAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    useEffect(() => {
        if (isWeb3Enabled) {
            // try to read the raffle enlistment fee
            async function updateUI() {
                const enlistmentFeeFromContract = (await getEnlistmentFeeAmount()).toString()
                const numPlayersFromContract = (await getNumberOfPlayers()).toString()
                const recentWinnerFromContract = await getRecentWinner()

                console.log(
                    `The enlistment or joining fees to participate in the raffle is ${enlistmentFeeFromContract}`
                )
                setEnlistmentFee(enlistmentFeeFromContract)
                setNumPlayers(numPlayersFromContract)
                setRecentWinner(recentWinnerFromContract)
                console.log(enlistmentFeeFromContract)
            }
            updateUI()
        }
    }, [isWeb3Enabled, getEnlistmentFeeAmount, getNumberOfPlayers, getRecentWinner])

    const handleSuccess = async (tx) => {
        await tx.wait(1)
        handleNewNotification(tx)
    }
    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete",
            position: "topR",
            title: "Tx Notification",
            icon: "bell",
        })
    }
    return (
        <main className="w-full">
            {" "}
            <header>
                <h2>Welcome to Raffle. We are sure you are ready to test out you LUCK!</h2>
            </header>
            {raffleContractAddress ? (
                <section className="mt-10">
                    <p>
                        Joining fee is{" "}
                        <span className="py-1 px-2 rounded-md bg-black text-white font-bold">
                            {ethers.utils.formatUnits(enlistmentFee, "ether")} ETH
                        </span>
                    </p>
                    <p>
                        The current number of players is:{" "}
                        <span className="py-1 px-2 rounded-md bg-black text-white font-bold">
                            {numPlayers}
                        </span>
                    </p>
                    <p>
                        The most previous winner was:{" "}
                        <span className="py-1 px-2 rounded-md bg-black text-white font-bold">
                            {recentWinner}
                        </span>
                    </p>
                    <button
                        onClick={async () =>
                            await joinRaffle({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }
                        className="px-4 py-2 rounded-lg hover:scale-105 transition-transform my-4 duration-300 bg-sky-400 text-white font-bold"
                    >
                        Join Raffle
                    </button>
                </section>
            ) : (
                <section className="mt-10">
                    <p className="text-center bg-red-500 p-2 rounded-lg">
                        We&apos;re Sorry! No Raffle Address Deteched.
                    </p>
                </section>
            )}
        </main>
    )
}

export default JoinRaffle
