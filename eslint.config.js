import * as path from 'node:path';

import { config } from '@douglasneuroinformatics/eslint-config';

export default config({
  fileRoots: path.relative(import.meta.dirname, 'test')
});
