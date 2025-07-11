Feature: Cart Functionality
  As a user of Swag Labs
  I want to manage my cart
  So that I can add, remove, and verify items in my cart

  Scenario: Display empty cart initially
    Given I am logged in as a standard user
    When I view the cart page
    Then the cart should be empty

  Scenario: Add item to cart and verify in cart page
    Given I am logged in as a standard user
    When I add "Sauce Labs Backpack" to the cart
    And I view the cart page
    Then I should see "Sauce Labs Backpack" in the cart

  Scenario: Add multiple items to cart and verify all items
    Given I am logged in as a standard user
    When I add multiple items to the cart
    And I view the cart page
    Then I should see all added items in the cart

  Scenario: Remove item from cart
    Given I have "Sauce Labs Backpack" in the cart
    When I remove it from the cart
    Then the cart should be empty
