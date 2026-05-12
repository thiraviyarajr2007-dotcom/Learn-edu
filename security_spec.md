# Security Specification - Learn Edu

## 1. Data Invariants
- Users must have a profile in the `users` collection to act as a teacher.
- Students can only read courses belonging to their assigned syllabus.
- Students can only read their own progress, attempts, and badges.
- Teachers can read any student's profile, alerts, and attempts to provide feedback.
- Only teachers can create or modify courses and modules.
- Forum posts and replies are public to all authenticated users, but can only be modified/deleted by their authors.

## 2. The "Dirty Dozen" Payloads

### Identity Spoofing
1. **User A tries to read User B's profile**: Should be DENIED unless User A is a teacher.
2. **User A tries to update User B's points**: Should be DENIED.
3. **User A tries to create a course with User B's `teacherId`**: Should be DENIED.

### Integrity & Type Safety
4. **Creating a course with a 2MB title**: Should be DENIED (size limit).
5. **Updating a user with a `role` of 'admin'**: Should be DENIED (only 'student', 'teacher' allowed).
6. **Setting `points` to a string**: Should be DENIED (type safety).

### Relational Sync
7. **Reading a module from a course the student doesn't have access to**: Should be DENIED.
8. **Creating a progress record for a non-existent module**: Should be DENIED.

### State Shortcutting
9. **Updating a quiz attempt's `score` after it has been graded**: Should be DENIED unless by a teacher.
10. **Modifying `createdAt` during an update**: Should be DENIED (immutable fields).

### Resource Exhaustion
11. **Injecting 1KB junk characters as a document ID**: Should be DENIED (isValidId check).
12. **Creating 10,000 forum replies in one post**: Should be DENIED (though we'll use size limits on fields mostly).

## 3. Test Runner Configuration
- We will use `@firebase/rules-unit-testing` for local verification (simulated).
