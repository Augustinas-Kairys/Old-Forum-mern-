import React from 'react';

interface FormData {
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
}

interface Errors {
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
}

const RegisterValidation: React.FC<{ formData: FormData }> = ({ formData }) => {
  const errors: Errors = {};

  if (!formData.email) {
    errors.email = "Reikalingas El. Paštas.";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "Neteisingas El. Pašto formatas.";
  }

  if (!formData.username) {
    errors.username = "Reikalingas Vartotojo Vardas.";
  } else if (/\s/.test(formData.username)) {
    errors.username = "Vartotojo Vardas negali turėti tarpų.";
  }

  if (!formData.password) {
    errors.password = "Reikalingas Slaptažodis.";
  } else if (formData.password.length < 8) {
    errors.password = "Slaptažodis turi turėti bent 8 simbolius.";
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = "Reikia patvirtinti Slaptažodį.";
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Slaptažodžiai nesutampa.";
  }

  return errors;
};

const LoginValidation: React.FC<{ formData: FormData }> = ({ formData }) => {
  const errors: Errors = {};

  if (!formData.username) {
    errors.username = "Reikalingas Vartotojo Vardas.";
  } else if (/\s/.test(formData.username)) {
    errors.username = "Vartotojo Vardas negali turėti tarpų.";
  }

  if (!formData.password) {
    errors.password = "Reikalingas Slaptažodis.";
  }

  return errors;
};

export { RegisterValidation, LoginValidation };
