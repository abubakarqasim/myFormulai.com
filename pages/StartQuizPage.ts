import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { QuizLocators } from '../constants/locators/quizlocator';

/**
 * StartQuizPage - Page Object Model for Formulai Quiz Flow
 * 
 * This class handles all interactions with the Formulai quiz, including:
 * - Navigation to quiz pages
 * - Answering quiz questions (radio buttons, checkboxes, dropdowns, inputs)
 * - Waiting for quiz transitions between questions
 * - Submitting quiz results
 * 
 * All quiz interactions are centralized here following the Page Object Model pattern.
 */
export class StartQuizPage extends BasePage {
  readonly quizLocators: QuizLocators;

  constructor(page: Page) {
    super(page);
    this.quizLocators = new QuizLocators(page);
  }

  /**
   * Navigate to the Formulai homepage
   */
  async navigate(): Promise<void> {
    await this.goto('https://myformulai.com/', { waitUntil: 'domcontentloaded' });
    await this.waitForLoad();
  }

  /**
   * Wait for quiz page to be fully loaded and ready for interaction
   * 
   * Uses flexible selectors to handle different quiz page layouts.
   * Falls back to basic DOM ready state if specific selectors aren't found.
   */
  async waitForQuizPageReady(): Promise<void> {
    await this.waitForLoad({ state: 'domcontentloaded', timeout: 30000 });
    
    try {
      await this.page.waitForSelector('form, [data-testid="quiz-input"], [class*="quiz"], [class*="question"]', { 
        state: 'visible', 
        timeout: 15000 
      });
    } catch (error) {
      await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    }
    
    await this.wait(1000);
  }

  /**
   * Wait for the next quiz question to load
   * 
   * Efficiently waits for either the Next button or quiz input elements to appear.
   * Uses Promise.race to proceed as soon as any quiz element is visible.
   */
  async waitForNextQuestion(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    
    try {
      await Promise.race([
        this.quizLocators.nextButton.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {}),
        this.page.waitForSelector('[data-testid^="radio-option"], [data-testid^="checkbox-option"], select[aria-label*="Select frequency"], input[type="number"]', { 
          state: 'visible', 
          timeout: 10000 
        }).catch(() => {})
      ]);
    } catch (error) {
      await this.wait(1000);
    }
  }

  /**
   * Click the "Take the Quiz" button and navigate to quiz page
   * 
   * Handles navigation to quiz.myformulai.com and ensures the quiz page
   * is fully loaded before proceeding.
   */
  async clickTakeQuiz(): Promise<void> {
    await this.click(this.quizLocators.takeQuizButton);
    
    try {
      await this.waitForNavigation({ 
        url: /quiz\.myformulai\.com/,
        timeout: 30000 
      });
    } catch (error) {
      await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
    }
    
    await this.waitForQuizPageReady();
  }

  /**
   * Verify that the "Take the Quiz" button is visible on the homepage
   */
  async verifyTakeQuizButtonVisible(): Promise<void> {
    await this.expectVisible(this.quizLocators.takeQuizButton);
  }

  /**
   * Verify the text content of the "Take the Quiz" button
   */
  async verifyTakeQuizButtonText(): Promise<void> {
    await this.expectText(this.quizLocators.takeQuizButton, 'Take the Quiz');
  }

  /**
   * Complete flow to start the quiz: verify button visibility, click, and wait for load
   */
  async startQuiz(): Promise<void> {
    await this.verifyTakeQuizButtonVisible();
    await this.clickTakeQuiz();
    await this.waitForLoad();
  }

  /**
   * Enter date of birth in the quiz form
   * @param dateOfBirth - Date in format YYYY-MM-DD (e.g., '1997-10-13')
   */
  async enterDateOfBirth(dateOfBirth: string): Promise<void> {
    await this.waitForAttached(this.quizLocators.dateOfBirthInput, 15000);
    await this.waitForVisible(this.quizLocators.dateOfBirthInput, 10000);
    await this.fill(this.quizLocators.dateOfBirthInput, dateOfBirth);
  }

  /**
   * Verify that the date of birth input field is visible and ready for interaction
   */
  async verifyDateOfBirthInputVisible(): Promise<void> {
    await this.waitForQuizPageReady();
    await this.waitForAttached(this.quizLocators.dateOfBirthInput, 15000);
    await this.waitForVisible(this.quizLocators.dateOfBirthInput, 10000);
    await this.expectVisible(this.quizLocators.dateOfBirthInput);
  }

  /**
   * Select Male gender option
   */
  async selectMale(): Promise<void> {
    await this.waitForVisible(this.quizLocators.maleOption);
    await this.click(this.quizLocators.maleOption);
  }

  /**
   * Click the Next button with fallback locators
   * 
   * Tries multiple locator strategies to handle variations in Next button rendering.
   * This ensures reliability across different quiz question types.
   */
  async clickNext(): Promise<void> {
    try {
      await this.waitForVisible(this.quizLocators.nextButton, 5000);
      await this.click(this.quizLocators.nextButton);
      return;
    } catch (error) {
      try {
        await this.waitForVisible(this.quizLocators.nextButtonBySpan, 5000);
        await this.click(this.quizLocators.nextButtonBySpan);
        return;
      } catch (error2) {
        await this.waitForVisible(this.quizLocators.nextButtonByText, 5000);
        await this.click(this.quizLocators.nextButtonByText);
      }
    }
  }

  /**
   * Verify that the Next button is visible
   * 
   * Uses fallback locators to handle different button rendering scenarios.
   */
  async verifyNextButtonVisible(): Promise<void> {
    try {
      await this.waitForVisible(this.quizLocators.nextButton, 5000);
      await this.expectVisible(this.quizLocators.nextButton);
      return;
    } catch (error) {
      try {
        await this.waitForVisible(this.quizLocators.nextButtonBySpan, 5000);
        await this.expectVisible(this.quizLocators.nextButtonBySpan);
        return;
      } catch (error2) {
        await this.waitForVisible(this.quizLocators.nextButtonByText, 5000);
        await this.expectVisible(this.quizLocators.nextButtonByText);
      }
    }
  }

  /**
   * Select the "Frequent urination" option
   */
  async selectFrequentUrination(): Promise<void> {
    await this.waitForVisible(this.quizLocators.frequentUrinationOption, 15000);
    await this.click(this.quizLocators.frequentUrinationOption);
  }

  /**
   * Select No known allergies option
   */
  async selectNoKnownAllergies(): Promise<void> {
    await this.waitForVisible(this.quizLocators.noKnownAllergiesOption, 15000);
    await this.click(this.quizLocators.noKnownAllergiesOption);
  }

  /**
   * Select Yes — list below option
   */
  async selectYesListBelow(): Promise<void> {
    await this.waitForVisible(this.quizLocators.yesListBelowOption, 15000);
    await this.click(this.quizLocators.yesListBelowOption);
  }

  /**
   * Select Warfarin (Coumadin) option
   */
  async selectWarfarin(): Promise<void> {
    await this.waitForVisible(this.quizLocators.warfarinOption, 15000);
    await this.click(this.quizLocators.warfarinOption);
  }

  /**
   * Select Multivitamin option
   */
  async selectMultivitamin(): Promise<void> {
    await this.waitForVisible(this.quizLocators.multivitaminOption, 15000);
    await this.click(this.quizLocators.multivitaminOption);
  }

  /**
   * Select Vegetarian option
   */
  async selectVegetarian(): Promise<void> {
    await this.waitForVisible(this.quizLocators.vegetarianOption, 15000);
    await this.click(this.quizLocators.vegetarianOption);
  }

  /**
   * Select "Never" from Caffeine dropdown
   */
  async selectCaffeineNever(): Promise<void> {
    await this.waitForVisible(this.quizLocators.caffeineDropdown, 15000);
    await this.quizLocators.caffeineDropdown.selectOption('Never');
  }

  /**
   * Select "Never" from Tobacco/Nicotine dropdown
   */
  async selectTobaccoNever(): Promise<void> {
    await this.waitForVisible(this.quizLocators.tobaccoDropdown, 15000);
    await this.quizLocators.tobaccoDropdown.selectOption('Never');
  }

  /**
   * Select "Never" from Alcohol dropdown
   */
  async selectAlcoholNever(): Promise<void> {
    await this.waitForVisible(this.quizLocators.alcoholDropdown, 15000);
    await this.quizLocators.alcoholDropdown.selectOption('Never');
  }

  /**
   * Select sleep hours option (5–6 hours)
   */
  async selectSleepHours5to6(): Promise<void> {
    await this.waitForVisible(this.quizLocators.sleepHours5to6, 15000);
    await this.click(this.quizLocators.sleepHours5to6);
  }

  /**
   * Select Stress & Emotional Balance checkbox option
   */
  async selectStressEmotionalBalance(): Promise<void> {
    await this.waitForVisible(this.quizLocators.stressEmotionalBalanceOption, 15000);
    await this.click(this.quizLocators.stressEmotionalBalanceOption);
  }

  /**
   * Select multiple checkbox options dynamically
   * 
   * Finds all available checkbox options and selects the specified number.
   * Useful for questions that allow multiple selections.
   * 
   * @param count - Number of checkbox options to select (default: 4)
   */
  async selectMultipleCheckboxOptions(count: number = 4): Promise<void> {
    const checkboxOptions = this.page.locator('[data-testid^="checkbox-option-"]');
    const optionCount = await checkboxOptions.count();
    const selectCount = Math.min(count, optionCount);
    
    for (let i = 0; i < selectCount; i++) {
      const option = checkboxOptions.nth(i);
      await this.waitForVisible(option, 15000);
      await this.click(option);
      await this.wait(500);
    }
  }

  /**
   * Select Low mood or motivation option
   */
  async selectLowMood(): Promise<void> {
    await this.waitForVisible(this.quizLocators.lowMoodOption, 15000);
    await this.click(this.quizLocators.lowMoodOption);
  }

  /**
   * Select Work or school pressure / deadlines option
   */
  async selectWorkSchoolPressure(): Promise<void> {
    await this.waitForVisible(this.quizLocators.workSchoolPressureOption, 15000);
    await this.click(this.quizLocators.workSchoolPressureOption);
  }

  /**
   * Select Morning option
   */
  async selectMorning(): Promise<void> {
    await this.waitForVisible(this.quizLocators.morningOption, 15000);
    await this.click(this.quizLocators.morningOption);
  }

  /**
   * Select Calm and relaxed option
   */
  async selectCalmRelaxed(): Promise<void> {
    await this.waitForVisible(this.quizLocators.calmRelaxedOption, 15000);
    await this.click(this.quizLocators.calmRelaxedOption);
  }

  /**
   * Select Low energy all day option
   */
  async selectLowEnergyAllDay(): Promise<void> {
    await this.waitForVisible(this.quizLocators.lowEnergyAllDayOption, 15000);
    await this.click(this.quizLocators.lowEnergyAllDayOption);
  }

  /**
   * Select Poor sleep option
   */
  async selectPoorSleep(): Promise<void> {
    await this.waitForVisible(this.quizLocators.poorSleepOption, 15000);
    await this.click(this.quizLocators.poorSleepOption);
  }

  /**
   * Select Steady energy all day option
   */
  async selectSteadyEnergyAllDay(): Promise<void> {
    await this.waitForVisible(this.quizLocators.steadyEnergyAllDayOption, 15000);
    await this.click(this.quizLocators.steadyEnergyAllDayOption);
  }

  /**
   * Select Trouble falling asleep option
   */
  async selectTroubleFallingAsleep(): Promise<void> {
    await this.waitForVisible(this.quizLocators.troubleFallingAsleepOption, 15000);
    await this.click(this.quizLocators.troubleFallingAsleepOption);
  }

  /**
   * Select After stressful days option
   */
  async selectAfterStressfulDays(): Promise<void> {
    await this.waitForVisible(this.quizLocators.afterStressfulDaysOption, 15000);
    await this.click(this.quizLocators.afterStressfulDaysOption);
  }

  /**
   * Select Fine — bounce back quickly option
   */
  async selectFineBounceBack(): Promise<void> {
    await this.waitForVisible(this.quizLocators.fineBounceBackOption, 15000);
    await this.click(this.quizLocators.fineBounceBackOption);
  }

  /**
   * Select Gas option
   */
  async selectGas(): Promise<void> {
    await this.waitForVisible(this.quizLocators.gasOption, 15000);
    await this.click(this.quizLocators.gasOption);
  }

  /**
   * Select After meals option
   */
  async selectAfterMeals(): Promise<void> {
    await this.waitForVisible(this.quizLocators.afterMealsOption, 15000);
    await this.click(this.quizLocators.afterMealsOption);
  }

  /**
   * Select Comfort after eating option
   */
  async selectComfortAfterEating(): Promise<void> {
    await this.waitForVisible(this.quizLocators.comfortAfterEatingOption, 15000);
    await this.click(this.quizLocators.comfortAfterEatingOption);
  }

  /**
   * Select Under $25/month option
   */
  async selectUnder25Month(): Promise<void> {
    await this.waitForVisible(this.quizLocators.under25MonthOption, 15000);
    await this.click(this.quizLocators.under25MonthOption);
  }

  /**
   * Click Complete button
   */
  async clickComplete(): Promise<void> {
    await this.waitForVisible(this.quizLocators.completeButton, 15000);
    await this.click(this.quizLocators.completeButton);
  }

  /**
   * Click the "Submit My Results" button with fallback locators
   * 
   * This is the final step in the quiz flow. Uses multiple locator strategies
   * to ensure reliable clicking of the submit button.
   */
  async clickSubmitResults(): Promise<void> {
    try {
      await this.waitForVisible(this.quizLocators.submitResultsButton, 15000);
      await this.click(this.quizLocators.submitResultsButton);
      return;
    } catch (error) {
      try {
        await this.waitForVisible(this.quizLocators.submitResultsButtonByClass, 15000);
        await this.click(this.quizLocators.submitResultsButtonByClass);
        return;
      } catch (error2) {
        await this.waitForVisible(this.quizLocators.submitResultsButtonByText, 15000);
        await this.click(this.quizLocators.submitResultsButtonByText);
      }
    }
  }

  /**
   * Verify that the "Submit My Results" button is visible
   */
  async verifySubmitResultsButtonVisible(): Promise<void> {
    try {
      await this.waitForVisible(this.quizLocators.submitResultsButton, 10000);
      await this.expectVisible(this.quizLocators.submitResultsButton);
      return;
    } catch (error) {
      try {
        await this.waitForVisible(this.quizLocators.submitResultsButtonByClass, 10000);
        await this.expectVisible(this.quizLocators.submitResultsButtonByClass);
        return;
      } catch (error2) {
        await this.waitForVisible(this.quizLocators.submitResultsButtonByText, 10000);
        await this.expectVisible(this.quizLocators.submitResultsButtonByText);
      }
    }
  }

  /**
   * Enter email address in the quiz email input field
   * @param email - Email address to enter (e.g., 'test@formulai.com')
   */
  async enterEmail(email: string): Promise<void> {
    await this.waitForAttached(this.quizLocators.emailInput, 15000);
    await this.waitForVisible(this.quizLocators.emailInput, 10000);
    await this.fill(this.quizLocators.emailInput, email);
  }

  /**
   * Verify that the email input field is visible and ready for interaction
   */
  async verifyEmailInputVisible(): Promise<void> {
    await this.waitForAttached(this.quizLocators.emailInput, 15000);
    await this.waitForVisible(this.quizLocators.emailInput, 10000);
    await this.expectVisible(this.quizLocators.emailInput);
  }

  /**
   * Click the "Unlock My Personalized Plan" button with fallback locators
   * 
   * This button appears after entering email and is used to submit the email
   * and unlock the personalized plan results.
   */
  async clickUnlockPlan(): Promise<void> {
    try {
      await this.waitForVisible(this.quizLocators.unlockPlanButton, 15000);
      await this.click(this.quizLocators.unlockPlanButton);
      return;
    } catch (error) {
      await this.waitForVisible(this.quizLocators.unlockPlanButtonByText, 15000);
      await this.click(this.quizLocators.unlockPlanButtonByText);
    }
  }

  /**
   * Verify that the "Unlock My Personalized Plan" button is visible
   */
  async verifyUnlockPlanButtonVisible(): Promise<void> {
    try {
      await this.waitForVisible(this.quizLocators.unlockPlanButton, 10000);
      await this.expectVisible(this.quizLocators.unlockPlanButton);
      return;
    } catch (error) {
      await this.waitForVisible(this.quizLocators.unlockPlanButtonByText, 10000);
      await this.expectVisible(this.quizLocators.unlockPlanButtonByText);
    }
  }

  /**
   * Enter first name in the registration form
   * @param firstName - First name to enter (e.g., 'John')
   */
  async enterFirstName(firstName: string): Promise<void> {
    await this.waitForAttached(this.quizLocators.firstNameInput, 15000);
    await this.waitForVisible(this.quizLocators.firstNameInput, 10000);
    await this.fill(this.quizLocators.firstNameInput, firstName);
  }

  /**
   * Enter last name in the registration form
   * @param lastName - Last name to enter (e.g., 'Doe')
   */
  async enterLastName(lastName: string): Promise<void> {
    await this.waitForAttached(this.quizLocators.lastNameInput, 15000);
    await this.waitForVisible(this.quizLocators.lastNameInput, 10000);
    await this.fill(this.quizLocators.lastNameInput, lastName);
  }

  /**
   * Enter password in the registration form
   * @param password - Password to enter
   */
  async enterPassword(password: string): Promise<void> {
    await this.waitForAttached(this.quizLocators.passwordInput, 15000);
    await this.waitForVisible(this.quizLocators.passwordInput, 10000);
    await this.fill(this.quizLocators.passwordInput, password);
  }

  /**
   * Verify that all registration form fields are visible
   */
  async verifyRegistrationFormVisible(): Promise<void> {
    await this.waitForAttached(this.quizLocators.firstNameInput, 15000);
    await this.waitForVisible(this.quizLocators.firstNameInput, 10000);
    await this.expectVisible(this.quizLocators.firstNameInput);

    await this.waitForAttached(this.quizLocators.lastNameInput, 15000);
    await this.waitForVisible(this.quizLocators.lastNameInput, 10000);
    await this.expectVisible(this.quizLocators.lastNameInput);

    await this.waitForAttached(this.quizLocators.passwordInput, 15000);
    await this.waitForVisible(this.quizLocators.passwordInput, 10000);
    await this.expectVisible(this.quizLocators.passwordInput);
  }

  /**
   * Click the "Create" button with fallback locators
   * 
   * This button creates the user account after filling the registration form.
   */
  async clickCreate(): Promise<void> {
    try {
      await this.waitForVisible(this.quizLocators.createButton, 15000);
      await this.click(this.quizLocators.createButton);
      return;
    } catch (error) {
      await this.waitForVisible(this.quizLocators.createButtonByText, 15000);
      await this.click(this.quizLocators.createButtonByText);
    }
  }

  /**
   * Verify that the "Create" button is visible
   */
  async verifyCreateButtonVisible(): Promise<void> {
    try {
      await this.waitForVisible(this.quizLocators.createButton, 10000);
      await this.expectVisible(this.quizLocators.createButton);
      return;
    } catch (error) {
      await this.waitForVisible(this.quizLocators.createButtonByText, 10000);
      await this.expectVisible(this.quizLocators.createButtonByText);
    }
  }

  /**
   * Enter height in feet
   * @param feet - Height in feet (e.g., '5')
   */
  async enterHeightFeet(feet: string): Promise<void> {
    await this.waitForAttached(this.quizLocators.heightFeetInput, 15000);
    await this.waitForVisible(this.quizLocators.heightFeetInput, 10000);
    await this.fill(this.quizLocators.heightFeetInput, feet);
  }

  /**
   * Enter height in inches
   * @param inches - Height in inches (e.g., '11')
   */
  async enterHeightInches(inches: string): Promise<void> {
    await this.waitForAttached(this.quizLocators.heightInchesInput, 15000);
    await this.waitForVisible(this.quizLocators.heightInchesInput, 10000);
    await this.fill(this.quizLocators.heightInchesInput, inches);
  }

  /**
   * Enter weight in pounds
   * @param weight - Weight in pounds (e.g., '100')
   */
  async enterWeight(weight: string): Promise<void> {
    await this.waitForAttached(this.quizLocators.weightInput, 15000);
    await this.waitForVisible(this.quizLocators.weightInput, 10000);
    await this.fill(this.quizLocators.weightInput, weight);
  }

  /**
   * Verify that all height and weight input fields are visible and ready
   */
  async verifyHeightWeightInputsVisible(): Promise<void> {
    await this.waitForAttached(this.quizLocators.heightFeetInput, 15000);
    await this.waitForVisible(this.quizLocators.heightFeetInput, 10000);
    await this.expectVisible(this.quizLocators.heightFeetInput);

    await this.waitForAttached(this.quizLocators.heightInchesInput, 15000);
    await this.waitForVisible(this.quizLocators.heightInchesInput, 10000);
    await this.expectVisible(this.quizLocators.heightInchesInput);

    await this.waitForAttached(this.quizLocators.weightInput, 15000);
    await this.waitForVisible(this.quizLocators.weightInput, 10000);
    await this.expectVisible(this.quizLocators.weightInput);
  }
}
