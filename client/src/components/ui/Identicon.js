import { useEffect, useRef, useState, useCallback } from "react"
import Jazzicon from "@metamask/jazzicon"
import { hasAvicon } from "../../utils/minter"
export default function Identicon({ minterContract, address, size, ...rest }) {
  const ref = useRef()
  const [avi, setAvi] = useState(null)
  const getUserAvi = useCallback(async (minterContract, address) => {
    // get the address that deployed the NFT contract
    const avicon = await hasAvicon(minterContract, address)
    if (avicon.length > 0) {
      setAvi(avicon)
    }
    // eslint-disable-next-line
  }, [])
  useEffect(() => {
    if (address && minterContract) {
      getUserAvi(minterContract, address)
    }
  }, [address, getUserAvi, minterContract])
  useEffect(() => {
    if (address && ref.current) {
      ref.current.innerHTML = ""
      ref.current.appendChild(
        Jazzicon(size, parseInt(address.slice(2, 10), 16))
      )
    }
  }, [address, size])

  return (
    <>
      {avi ? (
        <div>
          <img
            src={avi}
            alt='avi'
            style={{
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: "25%",
              marginLeft: "5px",
            }}
          ></img>
        </div>
      ) : (
        <div {...rest}>
          <div ref={ref} style={{ width: `${size}px`, height: `${size}px` }} />
        </div>
      )}
    </>
  )
}
