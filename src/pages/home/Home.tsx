import React from "react";
import styled from "@emotion/styled";
import NativeTest from "./NativeTest";

const Container = styled.div(({ theme }) => ({
  color: theme.color.primary,
}));

const Home = () => {
  return (
    <Container>
      <NativeTest />
    </Container>
  );
};

export default Home;
