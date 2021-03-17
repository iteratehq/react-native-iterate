import type { EdgeInsets } from './types';

class SafeArea {
  // A user-provided safe area provider
  provider?: () => EdgeInsets;
}

export default new SafeArea();
