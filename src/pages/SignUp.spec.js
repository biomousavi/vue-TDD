/// type="@testing-library/jest-dom"
import axios from 'axios';
import { render, screen } from '@testing-library/vue';
import { it, expect, describe, test } from '@jest/globals';
import '@testing-library/jest-dom';
import SignUpPage from './SignUp.vue';
import userEvent from '@testing-library/user-event';

describe('SignUp page', () => {
  describe('Layout', () => {
    it('has SighUp header', () => {
      render(SignUpPage);
      const header = screen.queryByRole('heading', { name: 'SignUp page' });

      expect(header).not.toBeNull();
    });

    it('has username input', () => {
      render(SignUpPage);

      const input = screen.queryByPlaceholderText('username');
      expect(input).toBeInTheDocument();
    });

    it('has username input label', () => {
      render(SignUpPage);

      const input = screen.getByLabelText('Username');
      expect(input).toBeInTheDocument();
    });

    it('has email input', () => {
      render(SignUpPage);
      const input = screen.queryByPlaceholderText('e-mail');
      expect(input).toBeInTheDocument();
    });

    it('has email input label', () => {
      render(SignUpPage);
      const input = screen.getByLabelText('E-mail');
      expect(input).toBeInTheDocument();
    });

    it('has password input', () => {
      render(SignUpPage);
      const input = screen.queryByPlaceholderText('password');
      expect(input).toBeInTheDocument();
    });

    it('has password input label', () => {
      render(SignUpPage);
      const input = screen.getByLabelText('Password');
      expect(input).toBeInTheDocument();
    });

    it('has password type for password input ', () => {
      render(SignUpPage);
      const input = screen.getByLabelText('Password');
      expect(input.type).toBe('password');
    });

    it('has confirm password input', () => {
      render(SignUpPage);
      const input = screen.queryByPlaceholderText('Confirm Password');
      expect(input).toBeInTheDocument();
    });

    it('has confirm password input label', () => {
      render(SignUpPage);
      const input = screen.getByLabelText('Confirm Password');
      expect(input).toBeInTheDocument();
    });

    it('has confirm password type for password input ', () => {
      render(SignUpPage);
      const input = screen.getByLabelText('Confirm Password');
      expect(input.type).toBe('password');
    });

    it('Has submit button', () => {
      render(SignUpPage);
      const button = screen.queryByRole('button', { name: 'Submit' });

      expect(button).toBeInTheDocument();
    });

    it('Submit button is disabled', () => {
      render(SignUpPage);
      const button = screen.queryByRole('button', { name: 'Submit' });

      expect(button).toBeDisabled();
    });
  });

  describe('Interaction', () => {
    test('submit button is enable when password and confirm password are same', async () => {
      render(SignUpPage);
      const password = screen.queryByPlaceholderText('password');
      const confirmPassword = screen.queryByPlaceholderText('Confirm Password');
      const button = screen.queryByRole('button', { name: 'Submit' });

      const userPass = '123Zasdsd2@';
      await userEvent.type(password, userPass);
      await userEvent.type(confirmPassword, userPass);

      expect(button).not.toBeDisabled();
    });
  });
});
