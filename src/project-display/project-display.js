import React from 'react';
import { Grid } from '@mui/material';
import BuilderCard from './builder-card';
import ProjectCard from './project-card';
import ProjectStats from './project-stats';

const ProjectDisplay = ({ projectRow, builderList, buildCenters, data }) => {
  // console.log("project:", projectRow);
  // console.log("builders:", builderList);
  return (
    <div>
      <ProjectStats data={data} buildCenters={buildCenters} />
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
    </div>
  );
};

export default ProjectDisplay;
