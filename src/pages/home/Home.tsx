import React from "react";
import styled from "@emotion/styled";
import Homepage from "./homepage";

const Container = styled.div(({ theme }) => ({
  color: theme.color.primary,
}));

const Home = () => {
  return (
    <Container>
      <Homepage />
    </Container>
  );
};

export default Home;
