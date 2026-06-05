import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from 'src/constants';
import useAuth from 'src/hooks/useAuth';
import Input from '../common/Input';
import Button from '../common/Button';

export const RegisterForm = () => {
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    const val = formData[name];
    setErrors((prev) => {
      const copy = { ...prev };
      if (name === 'name') {
        if (!val) copy.name = 'Full name is required';
        else if (val.length < 2) copy.name = 'Name must be at least 2 characters';
        else delete copy.name;
      }
      if (name === 'email') {
        if (!val) copy.email = 'Email address is required';
        else if (!/\S+@\S+\.\S+/.test(val)) copy.email = 'Please enter a valid email address';
        else delete copy.email;
      }
      if (name === 'password') {
        if (!val) copy.password = 'Password is required';
        else if (val.length < 6) copy.password = 'Password must be at least 6 characters';
        else delete copy.password;
      }
      if (name === 'confirmPassword') {
        if (!val) copy.confirmPassword = 'Please confirm your password';
        else if (val !== formData.password) copy.confirmPassword = 'Passwords do not match';
        else delete copy.confirmPassword;
      }
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 w-full">
      <Input
        label="Full Name"
        type="text"
        name="name"
        placeholder="John Doe"
        value={formData.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.name}
        icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        }
      />

      <Input
        label="Email Address"
        type="email"
        name="email"
        placeholder="you@example.com"
        value={formData.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.email}
        icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
          </svg>
        }
      />

      <Input
        label="Password"
        type="password"
        name="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.password}
        icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        }
      />

      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        placeholder="••••••••"
        value={formData.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.confirmPassword}
        icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        }
      />

      <Button type="submit" isLoading={loading} className="w-full mt-2 py-3">
        Create Account
      </Button>

      <div className="text-center text-xs text-text-secondary mt-2">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="text-primary hover:text-primary-hover font-semibold transition-colors">
          Sign in
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;
