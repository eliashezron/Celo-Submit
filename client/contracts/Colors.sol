//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

// We first import some OpenZeppelin Contracts.
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

// We need to import the helper functions from the contract that we copy/pasted.
import "@openzeppelin/contracts/utils/Base64.sol";

    // We inherit the contract we imported. This means we'll have access
    // to the inherited contract's methods. So 'is' keyword gives it power
    // to inherit other contracts
    contract MyEpicNFT is ERC721URIStorage {
    // Magic given to us by OpenZeppelin to help us keep track of tokenIds.
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

     // This is our SVG code. All we need to change is the word that's displayed. Everything else stays the same.
     // So, we make a baseSvg variable here that all our NFTs can use.
     // We split the SVG at the part where it asks for the background color.
    string svgPartOne = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='";
    string svgPartTwo = "'/><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    // I create three arrays, each with their own theme of random words.
  // Pick some random funny words, names of anime characters, foods you like, whatever! 
    // string[] firstWords = ["Sandwich", "Rabbits", "Yakuza", "Husky", "Rolex", "Sabi", "Nawe", "Ballbuster", "Epic", "Wild"];
    // string[] secondWords = ["Pizza", "Chicken", "Sheesh", "Dorime", "Harrystyles", "Banange", "Milkshake", "Curry", "Salad", "Cupcake"];
    // string[] thirdWords = ["Omo", "Bucket", "Green", "Beef", "Goddess", "Onedirection", "Naruto", "Gaara", "Minato", "Kakashi"];

    // get facncy with it and declare a bunch of colors
    string[] colors = ["#f4791f", "#dd3e54", "#2ebf91", "#544a7d", "#eaafc8", "#FF416C", "black" ];
    string[] fcolors = ["#f4791f", "#dd3e54", "#2ebf91", "#544a7d", "#eaafc8", "#FF416C", "black" ];


    
    //magical events
    event NewEpicNFTMinted(address sender, uint256 tokenId);

    // We need to pass the name of our NFTs token and it's symbol.
    constructor() ERC721 ("SquareNFT", "SQUARE") {
        console.log("This is my NFT contract. Woah!");
    }

    // // I create a function to randomly pick a word from each array.
    // function pickRandomFirstWord(uint256 tokenId) public view returns(string memory){
    //     // i seed the random generator
    //     uint256 rand = random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId))));
    //     // Squash the # between 0 and the length of the array to avoid going out of bounds.
    //     rand = rand % firstWords.length;
    //     return firstWords[rand];
    // }

    // function pickRandomSecondWord(uint256 tokenId) public view returns(string memory){
    //     uint256 rand = random(string(abi.encodePacked("SECOND_WORD", Strings.toString(tokenId))));
    //     rand = rand % secondWords.length;
    //     return secondWords[rand];
    // }

    // function pickRandomThirdWord(uint256 tokenId) public view returns(string memory){
    //     uint256 rand = random(string(abi.encodePacked("THIRD_WORD", Strings.toString(tokenId))));
    //     rand = rand % thirdWords.length;
    //     return thirdWords[rand];
    // }

    // // Same old stuff, pick a random color.
    function pickRandomColor(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("COLOR", Strings.toString(tokenId))));
        rand = rand % colors.length;
        return colors[rand];
    }

    function random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }

    // A function our user will hit to get their NFT.
    function makeAnEpicNFT(string memory combinedWord, string memory randomColor) public {
        // Get the current tokenId, this starts at 0.
        uint256 newItemId = _tokenIds.current();

        // We go and randomly garb one word from each of the three arrays
        // string memory first = pickRandomFirstWord(newItemId);
        // string memory second = pickRandomSecondWord(newItemId);
        // string memory third = pickRandomThirdWord(newItemId);
        // string memory combinedWord = string(abi.encodePacked(first, second, third));

        // I concatenate it all together, and then close the <text> and <svg> tags.
        // string memory randomColor = pickRandomColor(newItemId);
        string memory finalSvg = string(abi.encodePacked(svgPartOne, randomColor, svgPartTwo, combinedWord, "</text></svg>"));

        // Get all the JSON metadata in place and base64 encode it.
        string memory json = Base64.encode( // this whole block encodes our json data into base64
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "', // here we dynmaically add the name to it
                        // We set the title of our NFT as the generated word.
                        combinedWord,
                        '", "description": "A highly acclaimed collection of squares.", "image": "data:image/svg+xml;base64,',
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
        console.log("\n--------------------");
        console.log(
            string(
                abi.encodePacked( // passed it in as a parameter
                    "https://nftpreview.0xdev.codes/?code=", // with this we can do a quicj preview of the image and the contents of the json without deploying it again and again on the opensea testnet
                    finalTokenUri
                )
            )
        );
        console.log("--------------------\n");
        


        // Actually mint the NFT to the sender using msg.sender.
        _safeMint(msg.sender, newItemId);

        //  Updated our URI to be consistent with our Json files
        _setTokenURI(newItemId, finalTokenUri);

        // Increment the counter for when the next NFT is minted.
        _tokenIds.increment();
        console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);
        
        //emit magical events
        emit NewEpicNFTMinted(msg.sender, newItemId);
    }
}