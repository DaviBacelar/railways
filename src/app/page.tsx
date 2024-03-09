"use client"
import React from "react";
import {Container, Typography} from "@mui/material";

import FiltersContainer from "@/components/FiltersContainer";


export default function Home() {
  return (
      <Container maxWidth="md">
          <Typography variant="h6" gutterBottom>
              Railways Graphical Time Table
          </Typography>
          <FiltersContainer/>
      </Container>
  );
}
