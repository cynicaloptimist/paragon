import "./App.css";

import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Container,
  Box
} from "@material-ui/core";
import GridLayout from "react-grid-layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

import { TopBar } from "./TopBar";

const App = () => {
  return (
    <>
      <Container>
        <TopBar />
        <GridLayout
          cols={12}
          rowHeight={30}
          width={1200}
          draggableHandle=".drag-handle"
          verticalCompact={false}
          style={{ position: "absolute" }}
        >
          <div key="justadiv" data-grid={{ x: 8, y: 0, w: 2, h: 2 }}>
            <HelloCard />
          </div>
        </GridLayout>
      </Container>
    </>
  );
};

const HelloCard = () => (
  <Card>
    <CardContent>
      <FontAwesomeIcon icon={faBars} className="drag-handle" />
      <Typography>Hello World</Typography>
    </CardContent>
  </Card>
);

export default App;
