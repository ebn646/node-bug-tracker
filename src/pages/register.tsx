import React, { useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { signIn } from 'next-auth/react';

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
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      firstName: Yup
        .string()
        .max(255)
        .required(
          'First Name is required'),
      lastName: Yup
        .string()
        .max(255)
        .required(
          'Last Name is required'),
      email: Yup
        .string()
        .max(255)
        .required(
          'Email is required')
        .email(
          'Must be a valid email'),
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
    const firstName = formik.values.firstName;
    const lastName = formik.values.lastName;
    const password = formik.values.password;

    try {
      const response = await axios.post('/api/auth/signup', { firstName, lastName, email, password })
      console.log('r  ', response)
      if (response.data) {
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });

        if (!result.error) {
          // set some auth state
          console.log('success = ', result)
          router.replace('/');
        } else {
          console.log(result.error)
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <Head>
        <title>
          Register | Trell-node
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
              {
                error && (
                  <Typography
                    color="error"
                    variant="subtitle2"
                  >
                    There was an error!
                  </Typography>
                )
              }
            </Box>
            <Box sx={{ display: 'flex' }}>
              <TextField
                sx={{ width: '50%' }}
                error={Boolean(formik.touched.firstName && formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
                label="First name"
                margin="normal"
                name="firstName"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.firstName}
                variant="outlined"
              />
              <TextField
                sx={{ width: '50%' }}
                error={Boolean(formik.touched.lastName && formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
                label="Last Name"
                margin="normal"
                name="lastName"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.lastName}
                variant="outlined"
              />
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
