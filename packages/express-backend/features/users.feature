Feature: User backend API
  The backend should expose user data and allow new users to sign up.

  Scenario: Fetch public users through the backend API
    Given the backend has public users
    When I request the public users list
    Then the response status should be 200
    And the response should include public user names and points

  Scenario: Create a new user through the backend API
    Given a new user signup request
    When I submit the signup request
    Then the response status should be 201
    And the response should include the created username and email
