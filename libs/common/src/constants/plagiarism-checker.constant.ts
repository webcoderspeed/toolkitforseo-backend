export const PLAGIARISM_CHECKER_DETECTION_MODEL = {
  Standard: 'Standard',
  Academic: 'Academic',
  Thorough: 'Thorough',
} as const;

export const ALL_PLAGIARISM_CHECKER_DETECTION_MODEL = Object.values(
  PLAGIARISM_CHECKER_DETECTION_MODEL,
);
