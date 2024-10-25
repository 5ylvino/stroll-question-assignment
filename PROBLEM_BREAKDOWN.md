## Problem: Dynamic Question Assignment ## 
Let’s assume you have N questions stored in a database, and each question needs to be assigned to a specific cycle. Each cycle spans 1 week, after which a new question is assigned to the next cycle. The question assignments are region-specific, meaning users in different regions receive different questions. For example, users in Singapore get question X, while users in the US receive question Y. All users in the same region will get the same question.
Singapore question set: [1, 2, 3, 4, 5, ..., N]
Timer 1 (Week 1): Assign question 1
Timer 2 (Week 2): Assign question 2
Timer N (Week N): Assign question N
US question set: [6, 7, 8, 9, 10, ..., N]
Timer 1 (Week 1): Assign question 6
Timer 2 (Week 2): Assign question 7
Timer N (Week N): Assign question N
Consideration:
The duration of each cycle is configurable and can vary (e.g., 1 day, 7 days, 14 days, 30 days).
For a start - we will set the question cycle duration every 7 days, at monday 7pm SGT weekly
Task:
Design & Implement: Build a question rotation system and design an efficient architecture to solve the problem. Consider any potential improvements to enhance the product.
Writeup: Provide a detailed explanation of your strategy, outlining the pros and cons of your design and implementation.
Submission: Share a link to a GitHub/GitLab repository with your solution. The README.md file should contain the writeup.
Scalability Requirement:
The solution should be capable of handling 100k daily active users (DAU) and scale to support millions of global users, ensuring efficient question assignment and rotation based on region and cycle configuration.



## Question break down ## 
1). N questions stored in a database
2). each question needs to be assigned to a specific cycle
3). Each cycle spans 1 week, after which a new question is assigned to the next cycle
4). The question assignments are region-specific - users in different regions receive different questions
5). All users in the same region will get the same question.
6). The duration of each cycle is configurable and can vary (e.g., 1 day, 7 days, 14 days, 30 days)

questions = [1,2,3,4,5,6,7,8,9,10]

region 1 - [1,2,3,4,5,] => length of questions === no. of cycles
region 2 - [6,7,8,9,10] => length of questions === no. of cycles

cycle 1 = ( q1, expiration, user )
cycle 2 = ( q2, expiration, user )
cycle 3 = ( q3, expiration, user )
cycle 4 = ( q4, expiration, user )
cycle 5 = ( q5, expiration, user )
