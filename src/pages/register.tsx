import { Fragment } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import {
  Container,
  Box,
  Grid,
  TextField,
  Typography,
  Button
} from '@mui/material';



const Register = () => {
  const router = useRouter();
  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required('First name is required'),
    lastName: Yup.string()
      .required('Last name is required'),
    email: Yup.string()
      .required('Email is required')
      .email('Email is invalid'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must not exceed 40 characters'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  });

  async function onSubmit(data: any) {
    console.log(JSON.stringify(data, null, 2));
    const  { firstName, lastName, email, password } = data;
    try {
      const response = await axios.post('/api/auth/signup', { firstName, lastName, email, password })
      console.log('r  ', response)
      if (response.data) {
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });

        if(result){
          const { error } = result;
          if (!error) {
            // set some auth state
            console.log('success = ', result)
            router.replace('/');
          } else {
            console.log('There was an error...', error)
          }
        }
      }
    } catch (err) {
      console.log('ERROR = ',err)
    }
  }

  return (
    <Fragment>
      <Head>
        <title>
          Register | Trell-node
        </title>
      </Head>
      <Box
        component="form"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          minHeight: '100%'
        }}
      >
        <Container maxWidth="sm">
          <Box px={3} py={2} my={3}>
            <Typography variant="h4" align="center" margin="dense">
              Create a new account
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="fulfirstNamelname"
                  label="First Name"
                  fullWidth
                  margin="dense"
                  {...register('firstName')}
                  error={errors.firstName ? true : false}
                />
                <Typography variant="inherit" color="textSecondary">
                  {errors.firstName?.message}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="lastName"
                  label="Last Name"
                  fullWidth
                  margin="dense"
                  {...register('lastName')}
                  error={errors.lastName ? true : false}
                />
                <Typography variant="inherit" color="textSecondary">
                  {errors.lastName?.message}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  id="email"
                  label="Email"
                  fullWidth
                  margin="dense"
                  {...register('email')}
                  error={errors.email ? true : false}
                />
                <Typography variant="inherit" color="textSecondary">
                  {errors.email?.message}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="password"
                  label="Password"
                  type="password"
                  fullWidth
                  margin="dense"
                  {...register('password')}
                  error={errors.password ? true : false}
                />
                <Typography variant="inherit" color="textSecondary">
                  {errors.password?.message}
                </Typography>
              </Grid>
            </Grid>
            <Box mt={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit(onSubmit)}
              >
                Register
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Fragment>
  );
};

export default Register;

