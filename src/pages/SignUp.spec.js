import { render, screen } from '@testing-library/vue';
import { it, expect, describe } from '@jest/globals';

import SignUpPage from './SignUp.vue';

describe('SignUp page', () => {
  it('has SighUp header', () => {
    render(SignUpPage);
    const header = screen.queryByRole('heading', { name: 'SignUp page' });

    expect(header).not.toBeNull();
  });
});
