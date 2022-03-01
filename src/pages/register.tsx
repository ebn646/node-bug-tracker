import React from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography
} from '@mui/material';

const Register = () => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      username: '',
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .max(255)
        .email(
          'Must be a valid email')
        .required(
          'Email is required'),
      username: Yup
          .string()
          .max(255)
          .required(
            'username is required'),
      password: Yup
        .string()
        .min(4)
        .max(255)
        .required(
          'Password is required')
    }),
    onSubmit: () => {
      console.log('sumbit me')
    }
  });

  async function createUser(e) {
    e.preventDefault()
    const email = formik.values.email;
    const username = formik.values.username;
    const password = formik.values.password;
    console.log('e ', email, 'u ', username, 'p ', password)

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, username, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    try{
      const data = await response;
      const { status, ok } = data;
      console.log('satus = ', status)
      if (ok) {
        console.log('sign up is a success...')
        router.replace('/');
      }   else if (status == 422) {
        console.log('there was an error...')
      }
    } catch(err){
      console.log('there was an error ', err)
    }
  }

  return (
    <>
      <Head>
        <title>
          Register | Material Kit
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          minHeight: '100%'
        }}
      >
        <Container maxWidth="sm">
          <form onSubmit={(e) => { createUser(e) }}>
            <Box sx={{ my: 3 }}>
              <Typography
                color="textPrimary"
                variant="h4"
              >
                Create a new account
              </Typography>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="body2"
              >
                Use your email to create a new account
              </Typography>
            </Box>
            <TextField
              error={Boolean(formik.touched.email && formik.errors.email)}
              fullWidth
              helperText={formik.touched.email && formik.errors.email}
              label="Email Address"
              margin="normal"
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="email"
              value={formik.values.email}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.username && formik.errors.username)}
              fullWidth
              helperText={formik.touched.username && formik.errors.username}
              label="Username"
              margin="normal"
              name="username"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.username}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="Password"
              margin="normal"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password}
              variant="outlined"
            />
            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Sign Up Now
              </Button>
            </Box>
            <Typography
              color="textSecondary"
              variant="body2"
            >
              Have an account?
              {' '}
              <NextLink
                href="/login"
                passHref
              >
                <Link
                  variant="subtitle2"
                  underline="hover"
                >
                  Sign In
                </Link>
              </NextLink>
            </Typography>
          </form>
        </Container>
      </Box>
    </>
  );
};

export default Register;
