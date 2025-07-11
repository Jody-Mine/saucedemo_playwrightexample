Feature: End-to-End Shopping Experience
  As a user of Swag Labs
  I want to complete a full shopping flow
  So that I can verify the end-to-end purchase process

  Scenario: Complete full shopping experience - login to purchase
    Given I am logged in as a standard user
    When I add multiple items to the cart
    And I complete the checkout process
    Then I should see the checkout complete page
