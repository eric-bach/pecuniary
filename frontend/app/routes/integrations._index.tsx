import { Link } from '@remix-run/react';
import { Box, Button, Card, CardActions, CardContent, CardMedia, Container, Grid, Typography } from '@mui/material';

export default function IntegrationsRoute() {
  return (
    <Box sx={{ pt: '50px' }}>
      <Grid container spacing={9}>
        <Grid item xs={3}>
          <Card sx={{ maxWidth: 345 }}>
            <CardMedia
              sx={{ height: 140 }}
              image='https://www.questrade.com/images/librariesprovider4/default-album/logos/questrade-primary-logo-digital-light-background.png'
              title='questrade'
            />
            <CardContent>
              <Typography gutterBottom variant='h5' component='div'>
                Questrade Code Grant
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Example with Questrade using Oauth Code Grant
              </Typography>
            </CardContent>
            <CardActions>
              <Button component={Link} to='/integrations/qtcode' size='small'>
                Add Integration
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={3}>
          <Card sx={{ maxWidth: 345 }}>
            <CardMedia
              sx={{ height: 140 }}
              image='https://www.questrade.com/images/librariesprovider4/default-album/logos/questrade-primary-logo-digital-light-background.png'
              title='questrade'
            />
            <CardContent>
              <Typography gutterBottom variant='h5' component='div'>
                Questrade Implicit Grant
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Example with Questrade using Oauth Implicit Grant
              </Typography>
            </CardContent>
            <CardActions>
              <Button component={Link} to='/integrations/qtimplicit' size='small'>
                Add Integration
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
