import { Locator, Page } from '@playwright/test';

/**
 * Quiz Locators
 * Contains all locators related to the Quiz functionality
 */
export class QuizLocators {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Take the Quiz button locator
   * Locates the first span element with class "button-text is-focus-button:opacity-0" and text "Take the Quiz"
   * <span class="button-text is-focus-button:opacity-0">Take the Quiz</span>
   */
  get takeQuizButton(): Locator {
    return this.page.locator('span.button-text', { hasText: 'Take the Quiz' }).first();
  }

  /**
   * Take the Quiz button locator with full class name
   * Uses the exact class "button-text is-focus-button:opacity-0"
   */
  get takeQuizButtonWithFullClass(): Locator {
    return this.page.locator('span[class*="button-text"][class*="is-focus-button"]', { hasText: 'Take the Quiz' });
  }

  /**
   * Alternative locator for Take the Quiz button using text
   */
  get takeQuizButtonByText(): Locator {
    return this.page.getByText('Take the Quiz');
  }

  /**
   * Take the Quiz button using role and name
   */
  get takeQuizButtonByRole(): Locator {
    return this.page.getByRole('button', { name: /Take the Quiz/i });
  }

  /**
   * Date of birth input field locator
   * <input data-testid="quiz-input" type="date" placeholder="Select your birth date">
   */
  get dateOfBirthInput(): Locator {
    return this.page.getByTestId('quiz-input');
  }

  /**
   * Male gender option locator
   * <div class="flex items-center gap-2">Male</div>
   */
  get maleOption(): Locator {
    return this.page.getByText('Male', { exact: true });
  }

  /**
   * Next button locator
   * Try button element first, then fallback to span
   */
  get nextButton(): Locator {
    // Try button with "Next" text first (most common pattern)
    return this.page.getByRole('button', { name: /Next/i }).first();
  }

  /**
   * Next button by span (alternative locator)
   */
  get nextButtonBySpan(): Locator {
    return this.page.locator('span.button-text', { hasText: /Next/i }).first();
  }

  /**
   * Next button by any element containing "Next" text
   */
  get nextButtonByText(): Locator {
    return this.page.getByText(/Next/i).first();
  }

  /**
   * Frequent urination option locator
   * <div class="flex items-center gap-2">Frequent urination (especially at night)</div>
   */
  get frequentUrinationOption(): Locator {
    return this.page.getByText('Frequent urination (especially at night)', { exact: true });
  }

  /**
   * Height (feet) input locator
   * <input id="height_feet" type="number" placeholder="5" min="4" max="7">
   */
  get heightFeetInput(): Locator {
    return this.page.locator('#height_feet');
  }

  /**
   * Height (inches) input locator
   * <input id="height_inches" type="number" placeholder="8" min="0" max="11">
   */
  get heightInchesInput(): Locator {
    return this.page.locator('#height_inches');
  }

  /**
   * Weight (pounds) input locator
   * <input id="weight_lbs" type="number" placeholder="Pounds (lbs)">
   */
  get weightInput(): Locator {
    return this.page.locator('#weight_lbs');
  }

  /**
   * No known allergies option locator
   * <div class="flex items-center gap-2">No known allergies</div>
   */
  get noKnownAllergiesOption(): Locator {
    return this.page.getByText('No known allergies', { exact: true });
  }

  /**
   * Yes — list below option locator
   * <div class="flex items-center gap-2">Yes — list below</div>
   */
  get yesListBelowOption(): Locator {
    return this.page.getByText('Yes — list below', { exact: true });
  }

  /**
   * Warfarin (Coumadin) option locator
   * <span class="text-gray-900 text-md">Warfarin (Coumadin)</span>
   */
  get warfarinOption(): Locator {
    return this.page.getByText('Warfarin (Coumadin)', { exact: true });
  }

  /**
   * Multivitamin option locator
   * <div class="flex items-center gap-2">Multivitamin</div>
   */
  get multivitaminOption(): Locator {
    return this.page.getByText('Multivitamin', { exact: true });
  }

  /**
   * Vegetarian option locator
   * <span class="flex items-center">Vegetarian</span>
   */
  get vegetarianOption(): Locator {
    return this.page.getByText('Vegetarian', { exact: true });
  }

  /**
   * Caffeine dropdown locator
   * <select aria-label="Select frequency for Caffeine (coffee, tea, energy drinks)">
   */
  get caffeineDropdown(): Locator {
    return this.page.locator('select[aria-label*="Caffeine"]');
  }

  /**
   * Tobacco/Nicotine dropdown locator
   * <select aria-label="Select frequency for Tobacco or Nicotine">
   */
  get tobaccoDropdown(): Locator {
    return this.page.locator('select[aria-label*="Tobacco"]');
  }

  /**
   * Alcohol dropdown locator
   * <select aria-label="Select frequency for Alcohol">
   */
  get alcoholDropdown(): Locator {
    return this.page.locator('select[aria-label*="Alcohol"]');
  }

  /**
   * Sleep hours option locator (5–6 hours)
   * <div data-testid="radio-option-5–6">
   */
  get sleepHours5to6(): Locator {
    return this.page.locator('[data-testid="radio-option-5–6"]');
  }

  /**
   * Stress & Emotional Balance checkbox option locator
   * <div data-testid="checkbox-option-stress_emotional_balance">
   */
  get stressEmotionalBalanceOption(): Locator {
    return this.page.locator('[data-testid="checkbox-option-stress_emotional_balance"]');
  }

  /**
   * Low mood or motivation option locator
   */
  get lowMoodOption(): Locator {
    return this.page.getByText('Low mood or motivation', { exact: true });
  }

  /**
   * Work or school pressure / deadlines option locator
   */
  get workSchoolPressureOption(): Locator {
    return this.page.getByText('Work or school pressure / deadlines', { exact: true });
  }

  /**
   * Morning option locator
   */
  get morningOption(): Locator {
    return this.page.getByText('Morning', { exact: true });
  }

  /**
   * Calm and relaxed option locator
   */
  get calmRelaxedOption(): Locator {
    return this.page.getByText('Calm and relaxed', { exact: true });
  }

  /**
   * Low energy all day option locator
   */
  get lowEnergyAllDayOption(): Locator {
    return this.page.getByText('Low energy all day', { exact: true });
  }

  /**
   * Poor sleep option locator
   */
  get poorSleepOption(): Locator {
    return this.page.getByText('Poor sleep', { exact: true });
  }

  /**
   * Steady energy all day option locator
   */
  get steadyEnergyAllDayOption(): Locator {
    return this.page.getByText('Steady energy all day', { exact: true });
  }

  /**
   * Trouble falling asleep option locator
   */
  get troubleFallingAsleepOption(): Locator {
    return this.page.getByText('Trouble falling asleep', { exact: true });
  }

  /**
   * After stressful days option locator
   */
  get afterStressfulDaysOption(): Locator {
    return this.page.getByText('After stressful days', { exact: true });
  }

  /**
   * Fine — bounce back quickly option locator
   */
  get fineBounceBackOption(): Locator {
    return this.page.getByText('Fine — bounce back quickly', { exact: true });
  }

  /**
   * Gas option locator
   */
  get gasOption(): Locator {
    return this.page.getByText('Gas', { exact: true });
  }

  /**
   * After meals option locator
   */
  get afterMealsOption(): Locator {
    return this.page.getByText('After meals', { exact: true });
  }

  /**
   * Comfort after eating option locator
   */
  get comfortAfterEatingOption(): Locator {
    return this.page.getByText('Comfort after eating', { exact: true });
  }

  /**
   * Under $25/month option locator
   */
  get under25MonthOption(): Locator {
    return this.page.getByText('Under $25/month – basic essentials only', { exact: true });
  }

  /**
   * Complete button locator
   * <button>Complete</button>
   */
  get completeButton(): Locator {
    return this.page.getByRole('button', { name: /Complete/i });
  }

  /**
   * Submit My Results button locator
   * <button class="...quiz-body...">Submit My Results</button>
   */
  get submitResultsButton(): Locator {
    return this.page.getByRole('button', { name: /Submit My Results/i });
  }

  /**
   * Submit My Results button locator (fallback by class)
   */
  get submitResultsButtonByClass(): Locator {
    return this.page.locator('button.quiz-body').filter({ hasText: /Submit My Results/i });
  }

  /**
   * Submit My Results button locator (fallback by text)
   */
  get submitResultsButtonByText(): Locator {
    return this.page.getByText('Submit My Results', { exact: false });
  }

  /**
   * Email input field locator
   * <input data-testid="quiz-email-input" type="email" placeholder="you@email.com">
   */
  get emailInput(): Locator {
    return this.page.getByTestId('quiz-email-input');
  }

  /**
   * Unlock My Personalized Plan button locator
   * <button data-testid="quiz-email-submit">Unlock My Personalized Plan</button>
   */
  get unlockPlanButton(): Locator {
    return this.page.getByTestId('quiz-email-submit');
  }

  /**
   * Unlock My Personalized Plan button locator (fallback by text)
   */
  get unlockPlanButtonByText(): Locator {
    return this.page.getByRole('button', { name: /Unlock My Personalized Plan/i });
  }

  /**
   * First name input field locator
   * <input id="RegisterForm-FirstName" name="customer[first_name]" placeholder="First name">
   */
  get firstNameInput(): Locator {
    return this.page.locator('#RegisterForm-FirstName');
  }

  /**
   * Last name input field locator
   * <input name="customer[last_name]" placeholder="Last name">
   * Uses name attribute for reliable identification
   */
  get lastNameInput(): Locator {
    return this.page.locator('input[name="customer[last_name]"]');
  }

  /**
   * Password input field locator
   * <input id="CustomerPassword" name="customer[password]" type="password" placeholder="Password">
   */
  get passwordInput(): Locator {
    return this.page.locator('#CustomerPassword');
  }

  /**
   * Create button locator
   * <button><span class="button-text">Create</span></button>
   */
  get createButton(): Locator {
    return this.page.getByRole('button', { name: /Create/i });
  }

  /**
   * Create button locator (fallback by text)
   */
  get createButtonByText(): Locator {
    return this.page.locator('button').filter({ hasText: /Create/i });
  }
}
