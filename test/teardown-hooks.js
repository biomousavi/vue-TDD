import { beforeEach } from 'vitest';
import i18n from '../locales/i18n';

beforeEach(() => {
  // reset i18n locale
  i18n.global.locale = 'en';
});
