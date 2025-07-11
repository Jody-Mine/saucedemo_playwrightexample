Feature: Checkout Functionality
  As a user of Swag Labs
  I want to complete the checkout process
  So that I can purchase items in my cart

  Scenario: Complete checkout with single item
    Given I have "Sauce Labs Backpack" in the cart
    When I complete the checkout process
    Then I should see the checkout complete page

  Scenario: Complete checkout with multiple items
    Given I have multiple items in the cart
    When I complete the checkout process
    Then I should see a completion message

  Scenario: Validate checkout information form
    Given I have "Sauce Labs Backpack" in the cart
    When I proceed to checkout without filling information
    Then I should see an error for missing first name

  Scenario: Validate missing last name
    Given I have "Sauce Labs Backpack" in the cart
    When I fill only the first name and proceed
    Then I should see an error for missing last name
