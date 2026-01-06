/**
 * Test constants for Formulai website
 * Centralized location for all test-related constants
 */

const BASE_URL = process.env.BASE_URL || 'https://myformulai.com';

const SELECTORS = {
  // Navigation
  SHOP_LINK: 'text=Shop',
  TAKE_QUIZ_BUTTON: 'text=Take the Quiz',
  OUR_BRANDS_LINK: 'text=Our Brands',
  ABOUT_US_LINK: 'text=About Us',
  
  // Homepage content
  MAIN_HEADING: 'text=Overwhelmed by Supplements?',
  SUB_HEADING: 'text=Get Clarity in Minutes',
  
  // Footer
  FOOTER_LINKS: {
    MY_ACCOUNT: 'text=My Account',
    DASHBOARD: 'text=Dashboard',
    FAQS: 'text=FAQs',
  },
};

const TIMEOUTS = {
  NAVIGATION: 30000,
  ELEMENT_VISIBLE: 10000,
  NETWORK_IDLE: 5000,
};

module.exports = {
  BASE_URL,
  SELECTORS,
  TIMEOUTS,
};
