import "./App.css";

import React from "react";
import { TopBar } from "./TopBar";
import {
  Card,
  CardContent,
  Typography,
  Container,
  Box,
  Grid
} from "@material-ui/core";

const App = () => {
  return (
    <>
      <TopBar />
      <Container>
        <Card >
          <CardContent>
            <Typography>Hello World</Typography>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default App;
