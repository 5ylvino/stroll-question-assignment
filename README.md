# Dynamic Question Assignment

### Strategy and Design Overview:

1. **Rotation Timing and Question Expiration Control (Timer Class)**
   - `Timer` serves as the foundation by managing the rotation day and time, enabling a regional question assignment schedule based on time intervals.
   - The `assignRotationStamp` method generates a timestamp for the next assignment based on a weekly day/time format, ensuring accurate timing for question rotations.

2. **Grouping Questions by Region (`DynamicQuestionAssigner` Class)**
   - This class loads questions from `stored-questions.json` and organizes them by region using the `#questionByRegions` private method. This organization aligns each user to questions that pertain to their specified region.
   - The question assignment is validated for expiration by checking the `expiration_stamp` on each question.

3. **User-Based Assignment (Cycle Method)**
   - Each user receives a question according to their region via the `cycle()` method, which first checks for question expiration.
   - If expired, the question index is incremented, and a new expiration timestamp is generated. The assigned question and upcoming rotation are recorded for each user.

### Pros:
1. **Time-Based Flexibility:** The `Timer` class allows for customizable question rotations based on day and time, providing a convenient and adaptable way to manage cycles.
2. **Optimized User-Question Mapping:** Questions are pre-organized by region, making it efficient to assign relevant questions to users without needing to filter through all questions every time.
3. **Scalability:** The structure is set to handle numerous users by centralizing control with expiration checks, preventing over-assignment and keeping the next question ready for each user.
4. **Clear and Traceable Cache:** The cycle cache (`cycleCacheOnDB`) is updated only when the question expires, reducing redundant updates and improving resource efficiency.

### Cons:
1. **Potential for Overlapping Assignments:** If `assigned_question` reaches the last question in a region, the logic lacks a mechanism for resetting or looping through questions, which could leave users without an assignment if not handled.
2. **Complexity in Multi-Region Scaling:** For systems involving dozens of regions, the current design might require more frequent adjustments or enhancements for the `#questionByRegions()` logic to prevent performance bottlenecks.
3. **High Dependency on Timing Accuracy:** If the server time differs from client time or if there’s any drift in timing precision, rotation cycles could desynchronize slightly. Implementing regular checks or syncing mechanisms could improve reliability.
