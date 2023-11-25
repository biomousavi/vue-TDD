import { expect, describe } from 'vitest';
import { mount } from '@vue/test-utils';
import Language from './Language.vue';

describe('Language', () => {
  it('has FA locale', async () => {
    const wrapper = mount(Language);

    const span = wrapper.find(`span[title="فارسی"]`);
    expect(span.exists()).toBe(true);
  });

  it('has EN locale', async () => {
    const wrapper = mount(Language);

    const span = wrapper.find(`span[title="English"]`);
    expect(span.exists()).toBe(true);
  });
});
