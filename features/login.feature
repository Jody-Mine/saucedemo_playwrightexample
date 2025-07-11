Feature: Login Functionality
  As a user of Swag Labs
  I want to login with different user types
  So that I can verify login and user-specific behaviors

  Scenario: Login as problem_user and verify all product images are the same
    Given I am on the login page
    When I login as "problem_user"
    Then all product images should be the same

  Scenario: Login as performance_glitch_user and verify login time
    Given I am on the login page
    When I login as "performance_glitch_user"
    Then login should complete within 7 seconds

  Scenario: Login as error_user and verify error behaviors
    Given I am on the login page
    When I login as "error_user"
    Then error_user should see errors when removing items or sorting

  Scenario: Login as visual_user and verify visual defects
    Given I am on the login page
    When I login as "visual_user"
    Then visual defects should be detected
