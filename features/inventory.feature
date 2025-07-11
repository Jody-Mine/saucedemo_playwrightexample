Feature: Inventory Page Actions
  As a user of Swag Labs
  I want to interact with the inventory page
  So that I can filter, sort, and manage products in my cart

  Scenario: Display all inventory items
    Given I am logged in as a standard user
    When I view the inventory page
    Then I should see all inventory items

  Scenario: Add single item to cart
    Given I am logged in as a standard user
    When I add "Sauce Labs Backpack" to the cart
    Then the cart badge should show 1

  Scenario: Add multiple items to cart
    Given I am logged in as a standard user
    When I add multiple items to the cart
    Then the cart badge should show the correct count

  Scenario: Remove item from cart
    Given I have "Sauce Labs Backpack" in the cart
    When I remove it from the cart
    Then the cart badge should not be visible
