import React from 'react';
import styled from 'styled-components';

const Footer = styled.footer`
  text-align: center
  font-family: sans-serif
  font-size: 14px
  color: #555
  padding-top: 10px
`;
const A = styled.a`
  text-decoration: none
  color: #333
`;

const FooterComponent = () => (
  <Footer>
    <p>
      <small>
        &copy; 2019 <A href="https://jackfletch.com">Jack Fletcher</A>
      </small>
    </p>
    <p>
      <small>
        Basketball data from <A href="https://stats.nba.com">stats.nba.com</A>
      </small>
    </p>
  </Footer>
);

export default FooterComponent;
