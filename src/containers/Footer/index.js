import React from 'react';
import styled from 'styled-components';

const Footer = styled.footer`
  text-align: center;
  font-family: sans-serif;
  font-size: 14px;
  color: #555;
  padding-top: 10px;
  small {
    font-size: 0.75rem;
  }
`;
const A = styled.a`
  text-decoration: none;
  color: #333;
`;

const FooterComponent = () => (
  <Footer>
    <p>
      Made with{' '}
      <span role="img" aria-label="love">
        ❤️
      </span>{' '}
      by <A href="https://jackfletch.com">Jack Fletcher</A>
    </p>
    <p>
      Follow development on{' '}
      <A href="https://github.com/jackfletch/splash">GitHub</A>!
    </p>
    <p>
      <small>
        Raw data from <A href="https://stats.nba.com">stats.nba.com</A>
      </small>
    </p>
    <p>
      <small>
        My apologies for the lack of visualization of the uncertainty in the
        data. Good thing it&apos;s just basketball.
      </small>
    </p>
  </Footer>
);

export default FooterComponent;
