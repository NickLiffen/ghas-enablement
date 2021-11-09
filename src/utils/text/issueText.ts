export const issueText = (
  pullRequestURL: string,
  pullRequestNumber: string
): string => `

# CodeQL Pull Request Created :wave:

Hey there! 

As you may have seen by pull request:  [${pullRequestNumber}](${pullRequestURL}), I've created a pull request for you.

This pull request enables [GitHub Advanced Security](https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security), but most importantly, enables [CodeQL](https://docs.github.com/en/code-security/code-scanning/automatically-scanning-your-code-for-vulnerabilities-and-errors/about-code-scanning-with-codeql) on your repository. 

The purpose of this issue is:

1) Give you some context as to why this pull request was created.
2) Provide you with some links to help you understand what CodeQL and GitHub Advanced Security are.
3) Help you with some 

As a company, we are moving towards CodeQL for our static analysis tool. We didn't want to go and raise a pull request for every repository manually, and we didn't expect you to have to go and manually create a pull request for every single repositor either. So here is a pull request for you to review and hopefully approve!

We are rolling out CodeQL per language/user, so if you have only got a pull request for a few of your repositories, not to worry, more will come soon. 

Hopefully, you should see a nice green status tick next to CodeQL within the status section of the pull request. However, if you haven't, that's understandable. We have taken the best guess approach at configuring CodeQL for you, but 1) we are still maturing, and 2) codeql can differ repository by repository. 

If you have a red X next to CodeQL, that means that CodeQL is not configured for your repository. You may need to go ahead and edit the codeql-analysis.yml file to get it working with your build process/codebase. Some information on that can be found below:

1) [Complied Languages with CodeQL](https://docs.github.com/en/code-security/code-scanning/automatically-scanning-your-code-for-vulnerabilities-and-errors/configuring-the-codeql-workflow-for-compiled-languages)
2) [Configuring Code Scanning](https://docs.github.com/en/code-security/code-scanning/automatically-scanning-your-code-for-vulnerabilities-and-errors/configuring-code-scanning).

If you need any more assistance, please don't hesitate to contact a member of the central GitHub team. We are here to help. 

Thanks!
- IT :) 
`;
