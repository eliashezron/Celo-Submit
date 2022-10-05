import React, { useState, useEffect, useCallback } from "react"
import PropTypes from "prop-types"
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap"
import { nameTaken, uploadFileToWebStorage } from "../../../utils/minter"
import { hasAvicon } from "../../../utils/minter"

const COLORS = [
  "Black",
  "Red",
  "Green",
  "purple",
  "indigo",
  "Aqua",
  "Brown",
  "Yellow",
  "Coral",
  "Orange",
  "Gold",
  "Teal",
]

const AddNfts = ({ save, uploadImage, address, minterContract }) => {
  const [name, setName] = useState("")
  const [ipfsImage, setIpfsImage] = useState("")
  const [color, setColor] = useState("")
  const [show, setShow] = useState(false)
  const [avi, setAvi] = useState(null)
  const [taken, setTaken] = useState(null)
  const getUserAvi = useCallback(async (minterContract, address) => {
    // get the address that deployed the NFT contract
    const avicon = await hasAvicon(minterContract, address)
    setAvi(avicon)
    // eslint-disable-next-line
  }, [])
  const nameAlreadyTaken = useCallback(async (minterContract, name) => {
    const txr = await nameTaken(minterContract, name)
    if (txr !== "0x0000000000000000000000000000000000000000") setTaken(txr)
  }, [])
  useEffect(() => {
    if (name && minterContract) {
      nameAlreadyTaken(minterContract, name)
    }
  }, [name, minterContract, nameAlreadyTaken])
  useEffect(() => {
    if (address && minterContract) {
      getUserAvi(minterContract, address)
    }
  }, [address, minterContract, getUserAvi])
  // check if all form data has been filled
  const isFormFilled = () => name && color
  const isImageUpload = () => ipfsImage
  // close the popup modal
  const handleClose = () => {
    setShow(false)
  }

  // display the popup modal
  const handleShow = () => setShow(true)
  return (
    <>
      <Button
        onClick={handleShow}
        variant='dark'
        className='rounded-pill px-0'
        style={{ width: "38px" }}
      >
        <i className='bi bi-plus'></i>
      </Button>
      {!avi ? (
        <>
          <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>First Upload Address Avicon</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form>
                <Form.Label>
                  <h5>Upload image</h5>
                </Form.Label>
                <Form.Control
                  type='file'
                  className={"mb-3"}
                  onChange={async (e) => {
                    const imageUrl = await uploadFileToWebStorage(e)
                    if (!imageUrl) {
                      alert("failed to upload image")
                      return
                    }
                    setIpfsImage(imageUrl)
                  }}
                  placeholder='upload Image'
                ></Form.Control>
              </Form>
            </Modal.Body>

            <Modal.Footer>
              <Button variant='outline-secondary' onClick={handleClose}>
                Close
              </Button>
              <Button
                variant='dark'
                disabled={!isImageUpload()}
                onClick={() => {
                  uploadImage(ipfsImage)
                  handleClose()
                }}
              >
                Create Avicon
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Reserve Your Name</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              <FloatingLabel
                controlId='inputName'
                label={
                  name && taken ? `${name} already Taken` : "Name to reserve"
                }
                className='mb-3'
              >
                <Form.Control
                  type='text'
                  placeholder='name to reserve'
                  onChange={(e) => {
                    setName(e.target.value.replaceAll(" ", ""))
                  }}
                />
              </FloatingLabel>

              <FloatingLabel
                controlId='inputColor'
                label='background color'
                className='mb-3'
              >
                <Form.Control
                  as='select'
                  className={"mb-3"}
                  onChange={async (e) => {
                    setColor(e.target.value)
                  }}
                  placeholder='NFT Color'
                >
                  <option hidden>select Color</option>
                  {COLORS.map((color) => (
                    <option
                      key={`color-${color.toLowerCase()}`}
                      value={color.toLowerCase()}
                    >
                      {color}
                    </option>
                  ))}
                </Form.Control>
              </FloatingLabel>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant='outline-secondary' onClick={handleClose}>
              Close
            </Button>
            <Button
              variant='dark'
              disabled={!isFormFilled() || taken}
              onClick={() => {
                save(name, color)
                handleClose()
              }}
            >
              Create NFT
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  )
}
AddNfts.propTypes = {
  save: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  address: PropTypes.string.isRequired,
}

export default AddNfts
