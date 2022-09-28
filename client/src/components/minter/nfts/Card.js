import React from "react"
import PropTypes from "prop-types"
import { Card, Col, Badge, Stack, Button } from "react-bootstrap"
import { truncateAddress } from "../../../utils"
import Identicon from "../../ui/Identicon"

const NftCard = ({ nft, minterContract, address }) => {
  const {
    image,
    description,
    owner,
    name,
    index,
    favorites,
    listed,
    sold,
    price,
  } = nft

  return (
    <Col key={index}>
      <Card className=' h-100'>
        <Card.Header>
          <Stack direction='horizontal' gap={2}>
            <Identicon
              minterContract={minterContract}
              address={owner}
              size={28}
            />
            <span className='font-monospace text-secondary'>
              {truncateAddress(owner)}
            </span>
            <Badge bg='secondary' className='ms-auto'>
              {index} ID
            </Badge>
          </Stack>
        </Card.Header>

        <div className=' ratio ratio-4x3'>
          <img src={image} alt={description} style={{ objectFit: "cover" }} />
        </div>

        <Card.Body className='d-flex  flex-column text-center'>
          <Stack direction='horizontal' gap={2}>
            <Card.Title>{name}</Card.Title>
            <Badge bg='secondary' className='ms-auto'>
              {favorites} Likes
            </Badge>
          </Stack>
          <Stack direction='horizontal' gap={2}>
            <Card.Title>{price} Celo</Card.Title>
            <Badge bg='secondary' className='ms-auto'>
              {sold} Transfers
            </Badge>
          </Stack>
          <Card.Text className='flex-grow-1'>{description}</Card.Text>
          {address === owner && !listed ? (
            <Button>List</Button>
          ) : (
            <>
              <Button disabled={owner}> Like</Button>
              <Button disabled={owner} className='mt-2'>
                Buy
              </Button>
            </>
          )}
        </Card.Body>
      </Card>
    </Col>
  )
}

NftCard.propTypes = {
  // props passed into this component
  nft: PropTypes.instanceOf(Object).isRequired,
}

export default NftCard
