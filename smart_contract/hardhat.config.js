// require("@nomicfoundation/hardhat-toolbox");

// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.17",
// };


require('@nomiclabs/hardhat-waffle')
//require('@nomicfoundation/hardhat-toolbox')
//require("@nomicfoundation/hardhat-chai-matchers")

//require('dotenv').config()

// const GOERLI_RPC_URL = process.env.RPC_URL
// const PRIVATE_KEY = process.env.PRIVATE_KEY

module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/rtTVQWc_rgwDm4mkaYi-k0_OtHWm4gsI',
      accounts: ['58ecd49400427f57ecfeac42a032dcdc99c10d9fd27c47902ed7d3bb33dc1df6']
    }
  }
};