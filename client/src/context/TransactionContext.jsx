import React, {useEffect, useState} from 'react'
import {ethers} from 'ethers'
import {contractABI, contractAddress} from '../utils/constants'

export const TransactionContext = React.createContext("");

const {ethereum} = window


const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer)

    return transactionsContract
}


export const TransactionProvider = ({children}) => {

    const [currentAccount, setCurrentAccount] = useState('')
    const [formData, setFormData] = useState({addressTo: '', amount: '', keyword: '', message: ''})
    const [isLoading, setIsLoading] = useState(false)
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'))
    const [transactions, setTransactions] = useState([])

    
    const handleChange = (e, name) => {
        setFormData((prevState) => ({...prevState, [name]: e.target.value}))
    }


    const getAllTransactions = async () => {
        try {
            if (!ethereum) return alert('Please install metamask')
            const transactionsContract = getEthereumContract()

            const availableTransactions = await transactionsContract.getAllTransactions()

            const structuredTransactions = availableTransactions.map((transaction) => ({
                addressTo: transaction.receiver,
                addressFrom: transaction.sender,
                timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                message: transaction.message,
                keyword: transaction.keyword,
                amount: parseInt(transaction.amount._hex) / (10 ** 18)
            }))

            console.log('structuredTransactions:',structuredTransactions)

            setTransactions(structuredTransactions)
        } catch (error) {
            console.log(error)
        }
    }


    const checkIfWalletIsConnected = async () => {
        try {
            if (!ethereum) return alert('Please install metamask')
    
            const accounts = await ethereum.request({method: 'eth_accounts'})
    
            if (accounts.length) {
                setCurrentAccount(accounts[0])
    
                getAllTransactions();
            }
            else {
                console.log('No account found')
            }
        } catch (error) {
            console.log(error)
            throw new Error('No ethereum object.')
        }
    }

    
    const checkIfTransactionsExists = async () => {
        try {
            const transactionsContract = getEthereumContract()
            const currentTransactionCount = await transactionsContract.getTransactionCount()
            
            localStorage.setItem('transactionCount', currentTransactionCount)
        } catch (error) {
            console.log(error)
            throw new Error('No ethereum object.')
        }
    }


    const connectWallet = async () => {
        try {
            if (!ethereum) return alert('Please install metamask')
    
            const accounts = await ethereum.request({method: 'eth_requestAccounts'})
    
            setCurrentAccount(accounts[0])
        } catch (error) {
            console.log(error)
            throw new Error('No ethereum object.')
        }
    }


    const sendTransaction = async () => {
        try {
            if (!ethereum) 
                return alert('Please install metamask')

            //get the data from the form...
            const {addressTo, amount, keyword, message} = formData            
            const transactionsContract = getEthereumContract()
            const parsedAmount = ethers.utils.parseEther(amount) //string to number

            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208', //21000 Gwei (~0.000021 Ether)
                    value: parsedAmount._hex, //ex: 0.00001
                }]
            })

            const transactionHash = await transactionsContract.addToBlockChain(addressTo, parsedAmount, message, keyword)

            setIsLoading(true)
            console.log(`Loading - ${transactionHash.hash}`)
            await transactionHash.wait()
            console.log(`Success - ${transactionHash.hash}`)
            setIsLoading(false)

            const transactionsCount = await transactionsContract.getTransactionCount()

            setTransactionCount(transactionsCount.toNumber())
            window.location.reload()

        } catch (error) {
            console.log(error)
            throw new Error('No ethereum object.')
        }
    }


    useEffect(() => {
        checkIfWalletIsConnected()
        checkIfTransactionsExists()
    }, [])


    return (
        <TransactionContext.Provider value={{connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction, transactions, isLoading}}>
            {children}
        </TransactionContext.Provider>
    )
}