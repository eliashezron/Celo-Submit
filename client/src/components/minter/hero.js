import React from "react"
import "./heroSection.css"
import {
  CCard,
  CCardImage,
  CCardBody,
  CCardText,
  CCardTitle,
  CImage,
  CTooltip,
  CContainer,
  CButton,
} from "@coreui/react"
import { cilMediaPlay } from "@coreui/icons"
import CIcon from "@coreui/icons-react"
import coverImg from "../../assets/img/latest_nft.png"

const HeroSection = ({ connect }) => {
  return (
    <CContainer fluid className='hero_section'>
      {/* HERO TEXT */}
      <CContainer className='hero_left'>
        <h1 className='main_text'>
          CELO NAME SERVICE <br></br> extraordinary NFTs
        </h1>
        <h2 className='muted_text'>
          CNS is the world's first and <br></br>largest Celo Identity
          marketplace
        </h2>
        <CButton
          color='primary'
          size='lg'
          className='explore_btn'
          onClick={() => connect().catch((e) => console.log(e))}
        >
          Connect
        </CButton>
      </CContainer>

      <CContainer className='hero_btn'>
        <CButton color='primary' className='play_btn'>
          <CIcon icon={cilMediaPlay} className='play_icon' size='xl' />
        </CButton>
        <h2 className='play_text'>Learn more about CNS</h2>
      </CContainer>

      {/* HERO IMAGE */}
      <CCard className='hero_card' href='#nft'>
        <CCardImage orientation='top' src={coverImg} className='hero_img' />
        <CCardBody className='heroSection_card'>
          <CCardText>
            <CImage fluid src={coverImg} className='hero_profile' />
            <CCardTitle className='card_box'>
              <h2 className='art_name'>xyz.celo</h2>
              <h2 className='profile_name'>elias</h2>
              <CTooltip content='Get featured on the homepage' placement='top'>
                <CImage
                  src='https://cdn-icons-png.flaticon.com/128/545/545674.png'
                  className='info_icon'
                />
              </CTooltip>
            </CCardTitle>
          </CCardText>
        </CCardBody>
      </CCard>
    </CContainer>

    /*Description on left plus buttons */
  )
}

export default HeroSection
