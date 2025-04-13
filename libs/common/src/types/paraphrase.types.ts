import { PARAPHRASED_MODE } from '../constants';

export type IParaphrasedModeType =
  (typeof PARAPHRASED_MODE)[keyof typeof PARAPHRASED_MODE];
