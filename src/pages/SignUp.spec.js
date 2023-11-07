import { render, screen } from '@testing-library/vue';
import { it, expect, describe, test } from '@jest/globals';
import '@testing-library/jest-dom';
import SignUpPage from './SignUp.vue';
import userEvent from '@testing-library/user-event';
import { TextEncoder } from 'util';
global.TextEncoder = TextEncoder;
import { setupServer } from 'msw/node';
import { rest } from 'msw';

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
    async function fillTheForm() {
      render(SignUpPage);

      const password = screen.queryByPlaceholderText('password');
      const confirmPassword = screen.queryByPlaceholderText('Confirm Password');
      const username = screen.queryByPlaceholderText('username');
      const email = screen.queryByPlaceholderText('e-mail');

      await userEvent.type(email, 'user1@mail.com');
      await userEvent.type(username, 'user1');
      const userPass = '123Zasdsd2@';
      await userEvent.type(password, userPass);
      await userEvent.type(confirmPassword, userPass);
    }

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

    it('sends username, email and password to backend after clicking submit button', async () => {
      let reqBody;
      const server = setupServer(
        rest.post('/api/1.0/users', (req, res, ctx) => {
          reqBody = req.body;
          return res(ctx.status(200));
        }),
      );

      server.listen();
      await fillTheForm();
      const button = screen.queryByRole('button', { name: 'Submit' });
      await userEvent.click(button);

      await server.close();

      expect(reqBody).toEqual({
        email: 'user1@mail.com',
        username: 'user1',
        password: '123Zasdsd2@',
      });
    });

    it('does not allow clicking to the button when there is an ongoing api call', async () => {
      let coutner = 0;
      const server = setupServer(
        rest.post('/api/1.0/users', (req, res, ctx) => {
          coutner = coutner + 1;
          return res(ctx.status(200));
        }),
      );

      server.listen();
      await fillTheForm();
      const button = screen.queryByRole('button', { name: 'Submit' });
      await userEvent.click(button);
      await userEvent.click(button);

      await server.close();

      expect(coutner).toBe(1);
    });

    it('displays spinner while api request is waiting', async () => {
      const server = setupServer(
        rest.post('/api/1.0/users', (req, res, ctx) => {
          return res(ctx.status(200));
        }),
      );

      server.listen();
      await fillTheForm();
      const button = screen.queryByRole('button', { name: 'Submit' });
      await userEvent.click(button);

      const spinner = screen.queryByRole('status');

      server.close();

      expect(spinner).toBeInTheDocument();
    });

    it('does not displays spinner while ther is no api request is waiting', async () => {
      await fillTheForm();
      const spinner = screen.queryByRole('status');

      expect(spinner).not.toBeInTheDocument();
    });

    it('shows account activation information after successful signin', async () => {
      const server = setupServer(
        rest.post('/api/1.0/users', (req, res, ctx) => {
          return res(ctx.status(200));
        }),
      );

      server.listen();
      await fillTheForm();
      const button = screen.queryByRole('button', { name: 'Submit' });
      await userEvent.click(button);

      server.close();

      const activationMessage = await screen.findByText('Please check your email to activate your account');

      expect(activationMessage).toBeInTheDocument();
    });

    it('does not show account activation information after successful signin', async () => {
      await fillTheForm();

      const activationMessage = screen.queryByText('Please check your email to activate your account');

      expect(activationMessage).not.toBeInTheDocument();
    });

    it('does not show account activation information after failing signin', async () => {
      const server = setupServer(
        rest.post('/api/1.0/users', (req, res, ctx) => {
          return res(ctx.status(400));
        }),
      );

      server.listen();
      await fillTheForm();
      const button = screen.queryByRole('button', { name: 'Submit' });
      await userEvent.click(button);

      server.close();

      const activationMessage = screen.findByText('Please check your email to activate your account');

      expect(activationMessage).rejects.toThrowError();
    });
  });
});
