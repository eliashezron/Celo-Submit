import React, { useState } from "react"
import PropTypes from "prop-types"
import {
  Card,
  Col,
  Badge,
  Stack,
  Button,
  Modal,
  Form,
  FloatingLabel,
} from "react-bootstrap"
import { truncateAddress } from "../../../utils"
import Identicon from "../../ui/Identicon"

const NftCard = ({ nft, minterContract, address, list }) => {
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
  const [sellPrice, setSellPrice] = useState(0)
  const [show, setShow] = useState(false)
  const handleShow = () => setShow(true)
  const handleClose = () => setShow(false)
  const isPriceEntered = () => sellPrice
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
            <>
              <Button onClick={handleShow}>List</Button>
              <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                  <Modal.Title>First Upload Address Avicon</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                  <Form>
                    <Form.Label>
                      <h5>Enter Price Sell Price</h5>
                    </Form.Label>
                    <FloatingLabel
                      controlId='inputPrice'
                      label='Name'
                      className='mb-3'
                    >
                      <Form.Control
                        type='number'
                        placeholder='Enter Sell Price'
                        onChange={(e) => {
                          setSellPrice(e.target.value)
                        }}
                      />
                    </FloatingLabel>
                  </Form>
                </Modal.Body>

                <Modal.Footer>
                  <Button variant='outline-secondary' onClick={handleClose}>
                    Close
                  </Button>
                  <Button
                    variant='dark'
                    disabled={!isPriceEntered()}
                    onClick={() => {
                      list(index, sellPrice)
                      handleClose()
                    }}
                  >
                    LIst Name
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
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
