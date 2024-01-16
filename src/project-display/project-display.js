import React from 'react';
import { Grid } from '@mui/material';
import BuilderCard from './builder-card';
import ProjectCard from './project-card';

const ProjectDisplay = ({ projectRow, builderList, primaryOps, lastBC }) => {
  // console.log("project:", projectRow);
  // console.log("builders:", builderList);
  return (
    <Grid container spacing={2}>
        <Grid item xs={12}>
            <ProjectCard project={projectRow} />     
            <BuilderCard builders={builderList} />   
        </Grid>
    </Grid>
  );
};

export default ProjectDisplay;
