import "./App.css";

import React from "react";
import { TopBar } from "./TopBar";
import {
  Card,
  CardContent,
  Typography,
  Container
} from "@material-ui/core";

const App = () => {
  return (
    <>
      <TopBar />
      <Container>
        <HelloCard />
      </Container>
    </>
  );
};

const HelloCard = () => (
  <Card>
    <CardContent>
      <Typography>Hello World</Typography>
    </CardContent>
  </Card>
);

export default App;
