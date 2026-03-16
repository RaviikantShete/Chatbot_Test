@functional
Feature: Chatbot Functional Behaviour

  @smoke @regression
  Scenario: Chatbot initialises with a welcome message
    Given I am on the Paywatch app
    When I open the chatbot
    Then I should see a welcome message from the bot

  @regression
  Scenario: Known query returns a salary-relevant response
    Given I am on the Paywatch app
    And the chatbot is open
    When I send the message "What is the salary for Java developers with 4-6 years experience?"
    Then the bot response should contain salary-related information

  @regression
  Scenario: Ambiguous query triggers a clarification prompt
    Given I am on the Paywatch app
    And the chatbot is open
    When I send the message "Tell me about salaries"
    Then the bot should ask for clarification

  @regression
  Scenario: Unsupported query is handled gracefully
    Given I am on the Paywatch app
    And the chatbot is open
    When I send the message "What is the weather today?"
    Then the bot should respond with a graceful fallback message

  @regression
  Scenario: No-data scenario is handled gracefully
    Given I am on the Paywatch app with technology "cobol" and experience "0-1"
    And the chatbot is open
    When I send the message "What is the salary for COBOL developers?"
    Then the bot should respond gracefully without crashing

  @regression
  Scenario: Response is contextually relevant to technology and experience
    Given I am on the Paywatch app with technology "reactjs" and experience "6-8"
    And the chatbot is open
    When I send the message "What do React developers earn?"
    Then the bot response should be relevant to "reactjs" and "6-8" years

  @regression
  Scenario: Empty message submission is blocked or prompted
    Given I am on the Paywatch app
    And the chatbot is open
    When I submit an empty message
    Then the bot should not send the message or should prompt the user

  @regression
  Scenario: Special character input does not crash the chatbot
    Given I am on the Paywatch app
    And the chatbot is open
    When I send the message "<script>alert('xss')</script>"
    Then the chatbot should remain functional

  @data-driven @regression
  Scenario Outline: Valid queries return relevant salary data
    Given I am on the Paywatch app with technology "<technology>" and experience "<experience>"
    And the chatbot is open
    When I send the message "<query>"
    Then the bot response should contain salary-related information

    Examples:
      | technology | experience | query                                    |
      | javaj2ee   | 4-6        | Java developer salary for 4-6 years      |
      | python     | 2-4        | Python developer pay range               |
      | reactjs    | 6-8        | What do senior React developers earn?    |
