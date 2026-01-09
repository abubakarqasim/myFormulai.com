import { test } from './BaseTest';
import { StartQuizPage } from '../pages/StartQuizPage';
import { TestData } from '../constants/testData';

/**
 * Start Quiz Test Suite
 * 
 * This test suite automates the complete Formulai quiz flow from start to finish.
 * It covers all quiz questions including personal information, health questions,
 * lifestyle choices, and final submission.
 * 
 * Note: This test runs only on Chromium browser for consistency.
 */
test.describe('Start Quiz Tests', { tag: ['@regression'] }, () => {
  let startQuizPage: StartQuizPage;

  test.beforeEach(async ({ page }, testInfo) => {
    startQuizPage = new StartQuizPage(page);
  });

  test('Complete Formulai quiz flow from homepage to results submission', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'Test runs only on Chrome');
    test.setTimeout(300000); // 5 minutes for complete quiz flow

    // ========== Setup Phase ==========
    await startQuizPage.maximizeWindow();
    await startQuizPage.goto('https://myformulai.com/', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await startQuizPage.wait(3000);

    // ========== Quiz Initialization ==========
    await startQuizPage.verifyTakeQuizButtonVisible();
    await startQuizPage.clickTakeQuiz();
    await startQuizPage.verifyDateOfBirthInputVisible();

    // ========== Personal Information Questions ==========
    await startQuizPage.enterDateOfBirth(TestData.QUIZ.DATE_OF_BIRTH);
    await startQuizPage.wait(1000);
    
    await startQuizPage.verifyNextButtonVisible();
    try {
      await startQuizPage.scrollIntoView(startQuizPage.quizLocators.nextButton, 5000);
    } catch {
      await startQuizPage.page.evaluate(() => {
        // @ts-expect-error - window is available in browser context
        window.scrollBy(0, 300);
      });
      await startQuizPage.wait(500);
    }
    await startQuizPage.clickNext();

    // Gender selection
    await startQuizPage.waitForNextQuestion();
    await startQuizPage.selectMale();
    await startQuizPage.wait(500);
    await startQuizPage.verifyNextButtonVisible();
    await startQuizPage.clickNext();

    // Height and weight
    await startQuizPage.waitForNextQuestion();
    await startQuizPage.verifyHeightWeightInputsVisible();
    await startQuizPage.enterHeightFeet(TestData.QUIZ.HEIGHT_FEET);
    await startQuizPage.wait(300);
    await startQuizPage.enterHeightInches(TestData.QUIZ.HEIGHT_INCHES);
    await startQuizPage.wait(300);
    await startQuizPage.enterWeight(TestData.QUIZ.WEIGHT_LBS);
    await startQuizPage.wait(500);
    await startQuizPage.verifyNextButtonVisible();
    await startQuizPage.clickNext();

    // ========== Health & Medical Questions ==========
    await startQuizPage.waitForNextQuestion();
    await startQuizPage.selectNoKnownAllergies();
    await startQuizPage.wait(500);
    await startQuizPage.verifyNextButtonVisible();
    await startQuizPage.clickNext();

    await startQuizPage.waitForNextQuestion();
    await startQuizPage.selectWarfarin();
    await startQuizPage.wait(500);
    await startQuizPage.verifyNextButtonVisible();
    await startQuizPage.clickNext();

    await startQuizPage.waitForNextQuestion();
    await startQuizPage.selectMultivitamin();
    await startQuizPage.wait(500);
    await startQuizPage.verifyNextButtonVisible();
    await startQuizPage.clickNext();

    await startQuizPage.waitForNextQuestion();
    await startQuizPage.selectVegetarian();
    await startQuizPage.wait(500);
    await startQuizPage.verifyNextButtonVisible();
    await startQuizPage.clickNext();

    // ========== Lifestyle Questions ==========
    await startQuizPage.waitForNextQuestion();
    await startQuizPage.selectCaffeineNever();
    await startQuizPage.wait(500);

    await startQuizPage.waitForNextQuestion();
    await startQuizPage.selectTobaccoNever();
    await startQuizPage.wait(500);

    await startQuizPage.waitForNextQuestion();
    await startQuizPage.selectAlcoholNever();
    await startQuizPage.wait(500);
    await startQuizPage.verifyNextButtonVisible();
    await startQuizPage.clickNext();

    // ========== Sleep & Energy Questions ==========
    await startQuizPage.waitForNextQuestion();
    await startQuizPage.selectSleepHours5to6();
    await startQuizPage.wait(500);
    await startQuizPage.verifyNextButtonVisible();
    await startQuizPage.clickNext();

    await startQuizPage.waitForNextQuestion();
    await startQuizPage.selectMultipleCheckboxOptions(4);
    await startQuizPage.verifyNextButtonVisible();
    await startQuizPage.clickNext();

    await startQuizPage.waitForNextQuestion();
    await startQuizPage.selectLowMood();
    await startQuizPage.wait(500);
    await startQuizPage.verifyNextButtonVisible();
    await startQuizPage.clickNext();

    await startQuizPage.waitForNextQuestion();
    await startQuizPage.selectWorkSchoolPressure();
    await startQuizPage.wait(500);
    await startQuizPage.verifyNextButtonVisible();
    await startQuizPage.clickNext();

    await startQuizPage.waitForNextQuestion();
    await startQuizPage.selectMorning();
    await startQuizPage.wait(500);
    await startQuizPage.verifyNextButtonVisible();
    await startQuizPage.clickNext();

    await startQuizPage.waitForNextQuestion();
    await startQuizPage.selectCalmRelaxed();
    await startQuizPage.wait(500);
    await startQuizPage.verifyNextButtonVisible();
    await startQuizPage.clickNext();

    await startQuizPage.waitForNextQuestion();
    await startQuizPage.selectLowEnergyAllDay();
    await startQuizPage.wait(500);
    await startQuizPage.verifyNextButtonVisible();
    await startQuizPage.clickNext();

    await startQuizPage.waitForNextQuestion();
    await startQuizPage.selectPoorSleep();
    await startQuizPage.wait(500);
    await startQuizPage.verifyNextButtonVisible();
    await startQuizPage.clickNext();

    await startQuizPage.waitForNextQuestion();
    await startQuizPage.selectSteadyEnergyAllDay();
    await startQuizPage.wait(500);
    await startQuizPage.verifyNextButtonVisible();
    await startQuizPage.clickNext();

    await startQuizPage.waitForNextQuestion();
    await startQuizPage.selectTroubleFallingAsleep();
    await startQuizPage.wait(500);
    await startQuizPage.verifyNextButtonVisible();
    await startQuizPage.clickNext();

    await startQuizPage.waitForNextQuestion();
    await startQuizPage.selectAfterStressfulDays();
    await startQuizPage.wait(500);
    await startQuizPage.verifyNextButtonVisible();
    await startQuizPage.clickNext();

    await startQuizPage.waitForNextQuestion();
    await startQuizPage.selectFineBounceBack();
    await startQuizPage.wait(500);
    await startQuizPage.verifyNextButtonVisible();
    await startQuizPage.clickNext();

    // ========== Digestive Health Questions ==========
    await startQuizPage.waitForNextQuestion();
    await startQuizPage.selectGas();
    await startQuizPage.wait(500);
    await startQuizPage.verifyNextButtonVisible();
    await startQuizPage.clickNext();

    await startQuizPage.waitForNextQuestion();
    await startQuizPage.selectAfterMeals();
    await startQuizPage.wait(500);
    await startQuizPage.verifyNextButtonVisible();
    await startQuizPage.clickNext();

    await startQuizPage.waitForNextQuestion();
    await startQuizPage.selectComfortAfterEating();
    await startQuizPage.wait(500);
    await startQuizPage.verifyNextButtonVisible();
    await startQuizPage.clickNext();

    // ========== Budget & Final Questions ==========
    await startQuizPage.waitForNextQuestion();
    await startQuizPage.verifyNextButtonVisible();
    await startQuizPage.clickNext();

    await startQuizPage.waitForNextQuestion();
    await startQuizPage.verifyNextButtonVisible();
    await startQuizPage.clickNext();

    await startQuizPage.waitForNextQuestion();
    await startQuizPage.selectUnder25Month();
    await startQuizPage.wait(500);
    await startQuizPage.verifyNextButtonVisible();
    await startQuizPage.clickNext();

    // ========== Quiz Completion ==========
    await startQuizPage.wait(2000);
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await startQuizPage.clickComplete();

    // Wait for Submit My Results button to appear and verify it's visible
    await startQuizPage.wait(2000);
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await startQuizPage.verifySubmitResultsButtonVisible();
    await startQuizPage.clickSubmitResults();

    // ========== Email Submission ==========
    // Wait for email input to appear after submitting results
    await startQuizPage.wait(2000);
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await startQuizPage.verifyEmailInputVisible();
    
    // Generate unique email with test prefix and 3 random digits
    const quizEmail = TestData.QUIZ.generateEmail();
    await startQuizPage.enterEmail(quizEmail);
    await startQuizPage.wait(500);

    // Verify and click Unlock My Personalized Plan button
    await startQuizPage.verifyUnlockPlanButtonVisible();
    await startQuizPage.clickUnlockPlan();

    // ========== Account Registration ==========
    // Wait for registration form to appear after unlocking plan
    await startQuizPage.wait(2000);
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await startQuizPage.verifyRegistrationFormVisible();

    // Fill in registration form
    await startQuizPage.enterFirstName(TestData.QUIZ.FIRST_NAME);
    await startQuizPage.wait(300);
    await startQuizPage.enterLastName(TestData.QUIZ.LAST_NAME);
    await startQuizPage.wait(300);
    await startQuizPage.enterPassword(TestData.QUIZ.PASSWORD);
    await startQuizPage.wait(500);

    // Verify and click Create button
    await startQuizPage.verifyCreateButtonVisible();
    await startQuizPage.clickCreate();
  });
});
