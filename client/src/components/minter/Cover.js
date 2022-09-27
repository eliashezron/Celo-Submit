import React from "react"
import PropTypes from "prop-types"
import HeroSection from "./hero"

const Cover = ({ name, coverImg, connect }) => {
  if (name) {
    return <HeroSection connect={connect} />
  }

  return null
}

Cover.propTypes = {
  name: PropTypes.string,
}

Cover.defaultProps = {
  name: "",
}

export default Cover
