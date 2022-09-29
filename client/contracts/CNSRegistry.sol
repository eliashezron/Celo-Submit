//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

// We first import some OpenZeppelin Contracts.
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

// We inherit the contracts we imported. This means we'll have access
// to the inherited contract's methods. So 'is' keyword gives it power
// to inherit other contracts
contract CNSRegistry is ERC721, ERC721Enumerable, ERC721URIStorage {
    // this helps us keep track of tokenIds.
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    struct CName {
        address owner;
        bool listed;
        uint256 price;
        uint256 sold;
        address[] likes;
    }
    mapping(uint256 => CName) private CNames; //to keep track of the structs
    mapping(string => address) public registeredNames; //to  map the registered names to the owners
    mapping(uint256 => mapping(address => bool)) private liked; // to keep track of those that have already liked an nft
    mapping(address => string) private imageToAddress; // to map the address/users to the avicons
    event Registered(address indexed who, string name); // emit this upon successfull registration

    // This is our SVG code. All we need to change is the name that's displayed. Everything else stays the same.
    // So, we make a baseSvg variable here that all our NFTs can use.
    // We split the SVG at the part where it asks for the background color.
    string svgPartOne =
        "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='";
    string svgPartTwo =
        "'/><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    // initialising the name and it's symbol of the ERC721 contract.
    constructor() ERC721("ENSRegistry", "ENSR") {}


    // modifier to check if CName with id "tokenId" exists
    modifier exists(uint tokenId){
        require(_exists(tokenId), "Query of nonexistent CName");
        _;
    }

    /// @dev A function used to reserve the CNS names
    function reserveName(string calldata _name, string calldata _bgColor) public {
        
        require(bytes(_name).length > 0, "Empty name");
        // query to see if the name is still available
        require(registeredNames[_name] == address(0), "Name Already taken");
        // if yes, we reconstruct the svg to  include the name and bg color
        string memory finalSvg = string(
            abi.encodePacked(
                svgPartOne,
                _bgColor,
                svgPartTwo,
                _name,
                "</text></svg>"
            )
        );
        // to autofill the .celo extention to the input name
        string memory name = string(abi.encodePacked(_name, ".celo"));

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
        uint256 newTokenId = _tokenIds.current();
        // Increment the counter for when the next NFT is minted.
        _tokenIds.increment();
        _safeMint(msg.sender, newTokenId);

        //  Updated our URI to be consistent with our Json files
        _setTokenURI(newTokenId, finalTokenUri);

        // update the struct for newTokenId
        CName storage newCName = CNames[newTokenId];
        newCName.owner = msg.sender;
        registeredNames[_name] = msg.sender;

        // emit the event
        emit Registered(msg.sender, _name);
    }

    /// @dev function to list the nfts for sale
    function sellCName(uint256 tokenId, uint256 _price) public exists(tokenId) {
        
        require(
            CNames[tokenId].owner == msg.sender,
            "Only NFT owner can list Item"
        );
        require(_price > 0, "price should be greater than zero");
        // update the struct
        CName storage editCName = CNames[tokenId];
        editCName.listed = true;
        editCName.price = _price;
    }

    // function to buy an nft and transfer ownership
    function buyCName(uint256 tokenId) public payable exists(tokenId) {
        CName storage currentCName = CNames[tokenId];
        require(
            currentCName.owner != msg.sender,
            "Owner can not buy own item"
        );
        require(currentCName.listed == true, "CName not listed");
        require(
            currentCName.price == msg.value,
            "insufficient funds to purchase item"
        );
        
        address owner = currentCName.owner;
        // update the struct
        // owner and listed values of CName will be updated in _beforeTokenTransfer
        currentCName.sold += 1;
        _transfer(owner, msg.sender, tokenId); // transfer CName
        (bool success, ) = payable(owner).call{
            value: msg.value
        }(""); // pay for the CName
        require(success, "Transfer failed");
        
    }

    /// @dev function to fetch a CName
    function getCName(uint256 tokenId)
        public
        view
        exists(tokenId)
        returns (
            address,
            bool,
            uint256,
            uint256,
            address[] memory
        )
    {
        CName storage rCName = CNames[tokenId];
        return (
            rCName.owner,
            rCName.listed,
            rCName.price,
            rCName.sold,
            rCName.likes
        );
    }

    /// @dev function to like the nfts
    /// @notice you can like a CName only once
    function likeCName(uint256 tokenId) public exists(tokenId) {
        require(liked[tokenId][msg.sender] == false, "CName already liked");
        CName storage currentCName = CNames[tokenId];
        currentCName.likes.push(msg.sender);
        liked[tokenId][msg.sender] = true;
    }

    /// @dev function to update the struct with the image of the users
    function setAddressAvicon(string calldata _imageUri) public {
        require(bytes(_imageUri).length > 0, "Empty image uri");
        imageToAddress[msg.sender] = _imageUri;
    }

    // function to query the mapping for the users' imageUri/avicon
    function getAddressAvicon(address _address)
        public
        view
        returns (string memory)
    {
        
        return imageToAddress[_address];
    }

    function getLiked(uint tokenId) public view exists(tokenId) returns(bool){
        return liked[tokenId][msg.sender];
    }

    // The following functions are overrides required by Solidity.

    // owner and listed values of CName are updated upon transfer of the NFT representing the CName
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        CName storage currentCName = CNames[tokenId];
        currentCName.owner = to;
        currentCName.listed = false;
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
