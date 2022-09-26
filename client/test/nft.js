const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("test", function () {
  this.timeout(50000)

  let myCNS
  let owner
  let acc1
  let acc2

  this.beforeEach(async function () {
    // This is executed before each test
    // Deploying the smart contract
    const MyCNS = await ethers.getContractFactory("CNSRegistry")
    ;[owner, acc1, acc2] = await ethers.getSigners()
    myCNS = await MyCNS.deploy()
  })
  it("Should mint one NFT", async function () {
    expect(await myCNS.balanceOf(owner.address)).to.equal(0)

    const tx = await myCNS.connect(owner).reserveName("elias", "blue")
    await tx.wait()

    expect(await myCNS.balanceOf(owner.address)).to.equal(1)
  })
  it("can reserve name only once", async function () {
    const tx = await myCNS.connect(owner).reserveName("elias", "blue")
    await tx.wait()

    await expect(
      myCNS.connect(acc1).reserveName("elias", "blue")
    ).to.be.revertedWith("Name Already taken")
  })
  it("only owner can sell", async function () {
    const tx = await myCNS.connect(owner).reserveName("elias", "blue")
    await tx.wait()

    await expect(myCNS.connect(acc1).sell(0, 2)).to.be.revertedWith(
      "Only NFT owner can list Item"
    )
    const tx1 = await myCNS.connect(owner).sell(0, 3)
    await tx1.wait()
    const tx2 = await myCNS.connect(owner).getNft(0)
    expect(tx2[1]).to.equal(true)
    expect(tx2[2]).to.equal(3)
    expect(tx2[3]).to.equal(0)
  })
  it("can like nft", async function () {
    const tx = await myCNS.connect(owner).reserveName("elias", "blue")
    await tx.wait()
    const tx1 = await myCNS.connect(acc1).likeNft(0)
    await tx1.wait()

    await expect(myCNS.connect(acc1).likeNft(0)).to.be.revertedWith(
      "nft already favorited"
    )
    const tx2 = await myCNS.connect(owner).getNft(0)
    expect(tx2[4].length).to.equal(1)
    expect(tx2[4][0]).to.equal(acc1.address)
  })
  it("set Avicon", async function () {
    const tx = await myCNS
      .connect(owner)
      .setAddressAvicon(
        "https://ipfs.io/ipfs/QmU1iLV62RCjagdyMNcNtAswP7jSd13epczX5rwhP4tb4Z/images/9.png"
      )
    await tx.wait()
    const tx1 = await myCNS.connect(acc1).getAddressAvicon(owner.address)
    expect(tx1).to.equal(
      "https://ipfs.io/ipfs/QmU1iLV62RCjagdyMNcNtAswP7jSd13epczX5rwhP4tb4Z/images/9.png"
    )
  })
  it("can buy NFT", async function () {
    const tx = await myCNS
      .connect(owner)
      .setAddressAvicon(
        "https://ipfs.io/ipfs/QmU1iLV62RCjagdyMNcNtAswP7jSd13epczX5rwhP4tb4Z/images/9.png"
      )
    await tx.wait()
    const tx1 = await myCNS.connect(acc1).getAddressAvicon(owner.address)
    expect(tx1).to.equal(
      "https://ipfs.io/ipfs/QmU1iLV62RCjagdyMNcNtAswP7jSd13epczX5rwhP4tb4Z/images/9.png"
    )
  })
})
