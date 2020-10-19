const { expect } = require("chai");

// CREATE2: new_address = hash(0xFF, sender, salt, bytecode)

const salt = 'random string';

describe("Suite", function () {
  // calculate the address of the contracts...
  it("Creates root with deterministic address", async function () {
    const [alice, bob, charlie, dylan] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("Factory");
    const Root = await ethers.getContractFactory("Root");
    const BranchA = await ethers.getContractFactory("BranchA");
    const BranchB = await ethers.getContractFactory("BranchB");
    
    const factory = await Factory.deploy();
    
    const saltHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(salt));
    const rootHash = ethers.utils.keccak256(Root.bytecode);
    const branchAHash = ethers.utils.keccak256(BranchA.bytecode);
    const branchBHash = ethers.utils.keccak256(BranchB.bytecode);

    const rootAddress = await factory.computeAddress(saltHash, rootHash);
    const branchAAddress = await factory.computeAddress(saltHash, branchAHash);
    const branchBAddress = await factory.computeAddress(saltHash, branchBHash);

    // console.log({
    //   saltHash,
    //   rootHash,
    //   branchAHash,
    //   branchBHash,
    //   rootAddress,        
    //   branchAAddress,       
    //   branchBAddress  
    // });

    console.log(await dylan.getAddress(), ethers.utils.formatEther(await dylan.getBalance()))
    // fund the root wallet (now an empty address)
    await (await dylan.sendTransaction({ to: rootAddress, value: ethers.utils.parseEther("1") })).wait()
    console.log('dylan', await dylan.getAddress(), ethers.utils.formatEther(await dylan.getBalance()))
    console.log('root', rootAddress, ethers.utils.formatEther(await ethers.provider.getBalance(rootAddress)))
    console.log('root CODE', rootAddress, await ethers.provider.getCode(rootAddress))
    // deploy the contract
    const { events: [{ args: { deployed: deployedRootAddress } }] } = await (await factory.deploy(0, saltHash, Root.bytecode)).wait()
    expect(deployedRootAddress).to.equal(rootAddress);
    console.log('root CODE', rootAddress, await ethers.provider.getCode(rootAddress))
    // alice claims it
    const root = await Root.attach(rootAddress);
    await (await root.execute()).wait();
    console.log('root', rootAddress, ethers.utils.formatEther(await ethers.provider.getBalance(rootAddress)))
    console.log('branch A', branchAAddress, ethers.utils.formatEther(await ethers.provider.getBalance(branchAAddress)))
    // deploy branch a
    console.log('branch A CODE', branchAAddress, await ethers.provider.getCode(branchAAddress))
    const { events: [{ args: { deployed: deployedBranchAAddress } }] } = await (await factory.deploy(0, saltHash, BranchA.bytecode)).wait()
    expect(deployedBranchAAddress).to.equal(branchAAddress);
    console.log('branch A CODE', branchAAddress, await ethers.provider.getCode(branchAAddress))
    // alice can now claim it
    const branchA = await BranchA.attach(branchAAddress);
    console.log('alice', await alice.getAddress(), ethers.utils.formatEther(await alice.getBalance()))
    await (await branchA.claim()).wait()
    console.log('alice', await alice.getAddress(), ethers.utils.formatEther(await alice.getBalance()))
    console.log('branch A', branchAAddress, ethers.utils.formatEther(await ethers.provider.getBalance(branchAAddress)))
    // console.log('branch A', branchAAddress, ethers.utils.formatEther(await ethers.provider.getBalance(branchAAddress)))

    // const root = await Root.attach(args.deployed);
    // console.log(await (await root.execute()).wait())

  })
})