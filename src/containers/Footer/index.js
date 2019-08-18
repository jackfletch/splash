import React from 'react'
import styled from 'styled-components'

const Footer = styled.footer`
  text-align: center
  font-family: sans-serif
  font-size: 14px
  color: #555
  padding-top: 10px
`
const A = styled.a`
  text-decoration: none
  color: #333
`

const FooterComponent = () =>
  <Footer>
    <p>&copy; 2017 <A href="jackfletch.com">Jack Fletcher</A></p>
    <p>Basketball data from <A href="stats.nba.com">stats.nba.com</A></p>
  </Footer>

export default FooterComponent
