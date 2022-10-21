// require("@nomicfoundation/hardhat-toolbox");

// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.17",
// };


require('@nomiclabs/hardhat-waffle')

module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: 'https://eth-mainnet.g.alchemy.com/v2/g-Yes-x8NdMoaxC_qE5ymZIjSfz_01xr',
      accounts: ['58ecd49400427f57ecfeac42a032dcdc99c10d9fd27c47902ed7d3bb33dc1df6']
    }
  }
};