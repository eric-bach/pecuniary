import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import MaterialLink from '@mui/material/Link';

function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'Copyright © '}
      <MaterialLink component={Link} to='/' color='inherit'>
        Your Website
      </MaterialLink>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function Album() {
  return (
    <React.Fragment>
      <main>
        <Box
          sx={{
            backgroundColor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth='sm'>
            <Typography component='h1' variant='h2' align='center' color='textPrimary' gutterBottom>
              Home Page
            </Typography>
            <Typography variant='h5' align='center' color='textSecondary' paragraph>
              Something short and leading about the collection below—its contents, the creator, etc. Make it short and sweet, but not too
              short so folks don&apos;t simply skip over it entirely.
            </Typography>
            <Box
              sx={{
                mt: 4,
              }}
            >
              <Grid container spacing={2} justifyContent='center'>
                <Grid item>
                  <Link to='/pricing'>
                    <Button variant='contained' color='primary'>
                      Pricing
                    </Button>
                  </Link>
                </Grid>
                <Grid item>
                  <Link to='/oldhome'>
                    <Button variant='outlined' color='primary'>
                      Old Home
                    </Button>
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Container>
        </Box>
        <Container
          sx={{
            pt: 8,
            pb: 8,
          }}
          maxWidth='md'
        >
          {/* End hero unit */}
          <Grid container spacing={4}>
            {cards.map((card) => (
              <Grid item key={card} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardMedia
                    sx={{
                      paddingTop: '56.25%', // 16:9
                    }}
                    image='https://source.unsplash.com/random'
                    title='Image title'
                  />
                  <CardContent
                    sx={{
                      flexGrow: 1,
                    }}
                  >
                    <Typography gutterBottom variant='h5' component='h2'>
                      Heading
                    </Typography>
                    <Typography>This is a media card. You can use this section to describe the content.</Typography>
                  </CardContent>
                  <CardActions>
                    <Button size='small' color='primary'>
                      View
                    </Button>
                    <Button size='small' color='primary'>
                      Edit
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      <footer>
        <Box
          sx={{
            backgroundColor: 'background.paper',
            padding: 6,
          }}
        >
          <Typography variant='h6' align='center' gutterBottom>
            Footer
          </Typography>
          <Typography variant='subtitle1' align='center' color='textSecondary' component='p'>
            Something here to give the footer a purpose!
          </Typography>
          <Copyright />
        </Box>
      </footer>
    </React.Fragment>
  );
}
