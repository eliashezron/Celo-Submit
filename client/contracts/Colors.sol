//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

// We first import some OpenZeppelin Contracts.
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "hardhat/console.sol";

// We inherit the contract we imported. This means we'll have access
// to the inherited contract's methods. So 'is' keyword gives it power
// to inherit other contracts
contract CNSRegistry is ERC721URIStorage {
    // Magic given to us by OpenZeppelin to help us keep track of tokenIds.
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    struct CName {
        address owner;
        bool listed;
        uint256 price;
        uint256 sold;
        address[] favorites;
    }
    event Registered(address indexed who, string name);
    mapping(uint256 => CName) public CNames;

    // This is our SVG code. All we need to change is the name that's displayed. Everything else stays the same.
    // So, we make a baseSvg variable here that all our NFTs can use.
    // We split the SVG at the part where it asks for the background color.
    string svgPartOne =
        "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='";
    string svgPartTwo =
        "'/><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    //magical events
    event NewEpicNFTMinted(address sender, uint256 tokenId);

    // We need to pass the name of our NFTs token and it's symbol.
    constructor() ERC721("ENSRegistry", "ENSR") {}

    // A function used to reserve the ENS names
    function reserveName(string memory _name, string memory _bgColor) public {
        // Get the current tokenId, this starts at 0.
        uint256 newTokenId = _tokenIds.current();
        require(CName[newTokenId].owner == address(0), "Name Already taken");

        string memory finalSvg = string(
            abi.encodePacked(
                svgPartOne,
                _bgColor,
                svgPartTwo,
                _name,
                "</text></svg>"
            )
        );
        string memory name = string(abi.encodePacked(_name, ".celo"));
        console.log(name);
        // Get all the JSON metadata in place and base64 encode it.
        string memory json = Base64.encode( // this whole block encodes our json data into base64
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "', // here we dynmaically add the name to it
                        // We set the title of our NFT as the generated word.
                        name,
                        '", "description": "Your Unique identity on the celo Blockchain.", "image": "data:image/svg+xml;base64,',
                        // We add data:image/svg+xml;base64 and then append our base64 encode our svg.
                        Base64.encode(bytes(finalSvg)),
                        '"}'
                    )
                )
            )
        );

        // Just like before, we prepend data:application/json;base64, to our data.
        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json) // so here we put it all together
        );
        // Actually mint the NFT to the sender using msg.sender.
        _safeMint(msg.sender, newTokenId);

        //  Updated our URI to be consistent with our Json files
        _setTokenURI(newTokenId, finalTokenUri);
        CName storage newCName = CNames[newTokenId];
        newCName.owner = msg.sender;
        newCName.listed = false;
        newCName.price = 0;
        newCName.sold = 0;

        // Increment the counter for when the next NFT is minted.
        _tokenIds.increment();
        emit Registered(msg.sender, _name);
    }

    function list(uint256 _tokenId, uint256 _price) public {
        require(
            CNames[_tokenId].owner == msg.sender,
            "Only NFT owner can list Item"
        );
        CName storage editCName = CNames[_tokenId];
        editCName.listed = !editCName.listed;
        editCName.price = _price;
    }
}
