import React from 'react';
import { Grid } from '@mui/material';
import BuilderCard from './builder-card';
import ProjectCard from './project-card';

const ProjectDisplay = ({ projectRow, builderList }) => {
  // console.log("project:", projectRow);
  // console.log("builders:", builderList);
  return (
    <Grid container spacing={2}>
        {/* ProjectCard on the left */}
        <Grid item xs={12} md={6}>
            <ProjectCard project={projectRow} />
        </Grid>

        {/* BuilderCard on the right */}
        <Grid item xs={12} md={6}>
            <BuilderCard builders={builderList} />
        </Grid>
    </Grid>
  );
};

export default ProjectDisplay;
