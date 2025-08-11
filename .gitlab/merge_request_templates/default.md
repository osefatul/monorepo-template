# Merge Request

## Description
Brief description of the changes in this MR.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring
- [ ] Test improvements
- [ ] Build/CI improvements

## Affected Packages
- [ ] `packages/shared`
- [ ] `apps/corp-authsigner-ui-internal`
- [ ] `apps/corp-authsigner-ui-external`
- [ ] Root configuration

## Testing
- [ ] Tests pass locally with `npm run test:run`
- [ ] New tests added for new functionality
- [ ] Existing tests updated for changes
- [ ] Manual testing completed
- [ ] Test coverage maintained or improved

## Code Quality
- [ ] Code follows the project's coding standards
- [ ] Code is properly formatted with `npm run format`
- [ ] Linting passes with `npm run lint`
- [ ] Type checking passes with `npm run type-check`
- [ ] No new TypeScript errors or warnings
- [ ] Pre-commit hooks pass successfully

## Documentation
- [ ] README updated if needed
- [ ] Code comments added for complex logic
- [ ] JSDoc comments added for new functions/components
- [ ] API documentation updated if applicable

## Security
- [ ] No sensitive information (API keys, passwords, etc.) exposed
- [ ] Security best practices followed
- [ ] Dependencies reviewed for vulnerabilities
- [ ] No new security warnings introduced

## Performance
- [ ] No performance regressions introduced
- [ ] Bundle size impact considered and acceptable
- [ ] Lazy loading implemented where appropriate
- [ ] Memory leaks checked and prevented

## Deployment
- [ ] Changes are backward compatible
- [ ] Database migrations included if needed
- [ ] Environment variables documented in `.env.example`
- [ ] Deployment instructions updated if needed
- [ ] Docker builds successfully
- [ ] Configuration changes documented

## GitLab CI/CD
- [ ] All pipeline stages pass
- [ ] Code coverage maintained or improved
- [ ] Security scans pass
- [ ] Docker images build successfully
- [ ] Deployment jobs configured correctly

## Review Checklist
- [ ] Code has been self-reviewed
- [ ] Complex logic is well-commented
- [ ] No debugging code left in production
- [ ] Error handling is appropriate
- [ ] Edge cases are considered

## Screenshots/Videos
<!-- Add screenshots or videos if UI changes are included -->

## Related Issues
<!-- Link to related GitLab issues -->
Closes #issue-number

## Breaking Changes
<!-- Describe any breaking changes and migration steps -->

## Additional Notes
<!-- Any additional information that reviewers should know -->

---

**Assignee:** <!-- Tag the assignee -->
**Reviewers:** <!-- Tag required reviewers -->
**Labels:** <!-- Add appropriate labels -->

/assign @username
/label ~"type::feature" ~"priority::medium"