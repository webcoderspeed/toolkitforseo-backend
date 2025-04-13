import { PLAGIARISM_CHECKER_DETECTION_MODEL } from '../constants';

export type IPlagiarismCheckerDetectionModelType =
  (typeof PLAGIARISM_CHECKER_DETECTION_MODEL)[keyof typeof PLAGIARISM_CHECKER_DETECTION_MODEL];
