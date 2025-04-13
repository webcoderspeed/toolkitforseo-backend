import { AIVendor, AIVendorType } from '@app/common/types';
import { GeminiVendor } from '@app/common/vendor_apis';

export class AIVendorFactory {
  static createVendor(type: AIVendorType): AIVendor {
    switch (type) {
      case 'gemini':
        return new GeminiVendor();
      default:
        throw new Error(`Unsupported AI vendor type: ${type}`);
    }
  }
}
