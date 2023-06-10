import Head from "next/head"
import styles from "../styles/Home.module.css"
import Header from "../components/Header"
import JoinRaffle from "../components/JoinRaffle"
import { useMoralis } from "react-moralis"

const supportedChains = ["31337", "11155111"]

export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis()

    return (
        <div className={styles.container}>
            <Head>
                <title>Decentralized Raffle</title>
                <meta
                    name="description"
                    content="A decentralized raffle based on smart contract and Ethereum blockchain"
                />
            </Head>
            <Header />
            {isWeb3Enabled ? (
                <div>
                    {supportedChains.includes(parseInt(chainId).toString()) ? (
                        <div className="flex flex-row">
                            <JoinRaffle className="p-8" />
                        </div>
                    ) : (
                        <div>{`Please switch to a supported chainId. The supported Chain Ids are: ${supportedChains}`}</div>
                    )}
                </div>
            ) : (
                <div>Please connect to a Wallet</div>
            )}
        </div>
    )
}
