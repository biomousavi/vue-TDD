/// type="@testing-library/jest-dom"
import { render, screen } from '@testing-library/vue';
import { it, expect, describe } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import SignUpPage from './SignUp.vue';

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

    it('Submit button is disabled', () => {
      render(SignUpPage);
      const button = screen.queryByRole('button', { name: 'Submit' });

      expect(button).toBeDisabled();
    });
  });
});
