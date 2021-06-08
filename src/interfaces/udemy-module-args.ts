export interface UdemyModuleArgs {
  googleClientId: string;
  isUfbEnrollmentOrPurchase: boolean;
  initialCurriculumItemId: number;
  canManageCourseQA: boolean;
  canUserEditCourse: boolean;
  availableFeatures: string[];
  isCourseInConsumerSubs: boolean;
  useCache: boolean;
  hasDismissedReviewPrompt: boolean;
  initialCurriculumItemType: string;
  isUserInstructor: boolean;
  isPreviewingAsStudent: boolean;
  courseId: number;
}
