import { setupStripesCore } from '@folio/stripes/core/test';
import translations from '@folio/stripes-acq-components/translations/stripes-acq-components/en';
import prefixKeys from '@folio/stripes-acq-components/test/bigtest/helpers/prefixKeys';

import mirageOptions from '../network';

mirageOptions.serverType = 'miragejs';

export default function setupApplication({
  modules,
  scenarios,
  hasAllPerms = true,
} = {}) {
  setupStripesCore({
    modules,
    mirageOptions,
    scenarios,
    stripesConfig: {
      hasAllPerms,
    },
    translations: prefixKeys(translations, 'stripes-acq-components'),
  });
}
