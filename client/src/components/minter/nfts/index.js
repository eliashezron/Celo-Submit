import { useContractKit } from "@celo-tools/use-contractkit"
import React, { useEffect, useState, useCallback } from "react"
import { toast } from "react-toastify"
import PropTypes from "prop-types"
import AddNfts from "./Add"
import Nft from "./Card"
import Loader from "../../ui/Loader"
import { NotificationSuccess, NotificationError } from "../../ui/Notifications"
import {
  getNfts,
  createNft,
  setAvicon,
  listCNS,
  likeCNS,
  buyCNS,
} from "../../../utils/minter"
import { Row } from "react-bootstrap"
// ...
const NftList = ({ minterContract, name }) => {
  const { performActions, address } = useContractKit()
  const [nfts, setNfts] = useState([])
  const [loading, setLoading] = useState(false)
  const getAssets = useCallback(async () => {
    try {
      setLoading(true)
      const allNfts = await getNfts(minterContract)
      if (!allNfts) return
      setNfts(allNfts)
    } catch (error) {
      console.log({ error })
    } finally {
      setLoading(false)
    }
  }, [minterContract])

  const addNft = async (name, color) => {
    try {
      setLoading(true)
      await createNft(minterContract, performActions, name, color)
      toast(<NotificationSuccess text='Updating NFT list....' />)
      getAssets()
    } catch (error) {
      console.log({ error })
      toast(<NotificationError text='Failed to create an NFT.' />)
    } finally {
      setLoading(false)
    }
  }
  const uploadImage = async (data) => {
    try {
      setLoading(true)
      await setAvicon(minterContract, performActions, data)
      toast(<NotificationSuccess text='uploading  Avicon....' />)
      toast(<NotificationSuccess text='Avicon Uploaded....' />)
      toast(
        <NotificationSuccess text='You can now reserve your Name on the celo Blockchain....' />
      )
    } catch (error) {
      console.log({ error })
      toast(<NotificationError text='Failed update Avicon.' />)
    } finally {
      setLoading(false)
    }
  }
  const listName = async (index, price) => {
    try {
      setLoading(true)
      await listCNS(minterContract, performActions, index, price)
      toast(<NotificationSuccess text='listing Item....' />)
      toast(<NotificationSuccess text='Item listed....' />)
      getAssets()
    } catch (error) {
      console.log({ error })
      toast(<NotificationError text='Transaction Failed.' />)
    } finally {
      setLoading(false)
    }
  }
  const buyName = async (index, price) => {
    try {
      setLoading(true)
      await buyCNS(minterContract, performActions, index, price)
      toast(<NotificationSuccess text='CNS Name Bought' />)
      getAssets()
    } catch (error) {
      console.log({ error })
      toast(<NotificationError text='Transaction Failed.' />)
    } finally {
      setLoading(false)
    }
  }
  const likeName = async (index) => {
    try {
      setLoading(true)
      await likeCNS(minterContract, performActions, index)
      toast(<NotificationSuccess text='CNS name liked....' />)
      getAssets()
    } catch (error) {
      console.log({ error })
      toast(<NotificationError text='Transaction Failed.' />)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    try {
      if (address && minterContract) {
        getAssets()
      }
    } catch (error) {
      console.log({ error })
    }
  }, [minterContract, address, getAssets])
  if (address) {
    return (
      <>
        {!loading ? (
          <>
            <div className='d-flex justify-content-between align-items-center mb-4'>
              <h1 className='fs-4 fw-bold mb-0'>{name}</h1>
              <AddNfts
                minterContract={minterContract}
                save={addNft}
                uploadImage={uploadImage}
                address={address}
              />
            </div>
            <Row xs={1} sm={2} lg={3} className='g-3  mb-5 g-xl-4 g-xxl-5'>
              {nfts.map((_nft) => (
                <Nft
                  minterContract={minterContract}
                  list={listName}
                  buy={buyName}
                  like={likeName}
                  address={address}
                  key={_nft.index}
                  nft={{
                    ..._nft,
                  }}
                />
              ))}
            </Row>
          </>
        ) : (
          <Loader />
        )}
      </>
    )
  }
  return null
}
NftList.propTypes = {
  minterContract: PropTypes.instanceOf(Object),
  updateBalance: PropTypes.func.isRequired,
}

NftList.defaultProps = {
  minterContract: null,
}

export default NftList
