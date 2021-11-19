# GitHub Advanced Security - Code Scanning, Secret Scanning & Dependabot Bulk Enablement Tooling

## Purpose

The purpose of this tool is to help create a `codeql-analysis.yml` file across multiple repositories in an automated way, using the git client on the machine this script is running on. It also allows for the enablement of Dependabot and/or Secret Scanning on the repositories where Code Scanning was enabled (`codeql-analysis.yml`).

## Context

Currently, there is no API access into the `.github/workflows/*` directory, and teams do not want to go and create a `codeql-analysis.yml` files manually across hundreds of repositories. So an automated solution is still required, just not using the API, as that is currently not possible.

## What does this tooling do?

There are two main actions this tool does:

1. Goes and collects repositories based on either 1) user access (administering the repositories) or 2) the repository's language. E.G., if you specify option 1, the script will return all repositories you are an administrator over. If you select option 2, the script will return all repositories in the language you specify (which you have access to). The repositories collected from this script are then stored within a `repos.json` file.

2. Loops over the repositories found within the `repos.json` file and creates a pull request on that repository with the `codeql-analysis.yml` found in the root of this repository. For convenience, all pull requests made will be stored within the `prs.txt` file, where you can see and manually review the pull requests after the script has run.

## Prerequisite

- [Node v16](https://nodejs.org/en/download/) or higher installed.
- [Yarn](https://yarnpkg.com/)\*
- [Git](https://git-scm.com/downloads) installed on the user's machine running this tool.
- Someone who has at least admin access over the repositories they want to enable Code Scanning on.
- Some basic software development skills, e.g., can navigate their way around a terminal or command prompt.

* You can use `npm` but for the sake of this `README.md`; we are going to standardise the commands on yarn. These are easily replacable though with `npm` commands.

## Set up Instructions

1.  Clone this repository onto your local machine.

```bash
git clone https://github.com/NickLiffen/ghas-enablement.git
```

2.  Change the directory to the repository you have just installed.

```bash
cd ghas-enablement
```

3.  Generate your choosen authentication stratergy. You are either able to use a [GitHub App](https://docs.github.com/en/developers/apps/getting-started-with-apps/about-apps) or a [Personal Access Token (PAT)](https://github.com/settings/tokens/new). The GitHub App needs to have permissions of `read and write` of `pull requests` `issues`, `dependabot`, `contents`. The GitHub PAT needs access to `repo` only.

4.  Rename the `.env-sample` to `.env`. On a Mac, this can be done via the following terminal command:

```bash
mv .env-sample .env
```

5. Update the `.env` with the required values. Please pick one of the authentication methods for interacting with GitHub. You can either fill in the `GITHUB_API_TOKEN` with a PAT that has access to the Org. OR, fill in all the values required for a GitHub App. **Note**: It is recommended to pick the GitHub App choice, as this gives you more API requests versus a PAT, however, if you would like to pick Option 2 from the choices below, this won't be possible using a GitHub App and you will need to use a PAT.

6. Update the `GITHUB_ORG` value found within the `.env`. Remove the `XXXX` and replace that with the name of the GitHub Organisation you would like to use as part of this script.

7. Update the `LANGUAGE` value found within the `.env`. Remove the `XXXX` and replace that with the language you would like to use as a filter when collecting repositories.

8. **OPTIONAL**: Update the `SECRET_SCANNING` and the `DEPENDABOT` values to `true/false` depending on if you would like to enable Secret Scanning and/or Dependabot on the repositories you would like code scanning enabled on. `true` === enabled. `false` (or anything else) === disabled.

9. **OPTIONAL**: Update the `CREATE_ISSUE` value to `true/false` depending on if you would like to create an issue explaining purpose of the PR. We recommend this, as it will help explain why the PR was create; and give some context. However, this is optional. The text which is in the issue can be modified and found here: `./src/utils/text/`.

10. Check the `codeql-analysis.yml` file. This is a sample file; please configure this file to suit your application needs.

11. Run `yarn add` or `npm install`, which will install the necessary dependencies.

12. Run yarn run build` `npm run build`, which will create the JavaScript bundle from TypeScript.

## How to use?

There are two simple steps to run:

### Step One

The first step is collecting the repositories you would like to run this script on. You have three options. Option 1 is automated and finds all the repositories within an organisation based on the language you specify. Option 2 is automated and finds all the repositories within an organisation you have admin access to. Or, Option 3, which is a manual entry of the repositories you would like to run this script on. See more information below.

**OPTION 1** (Preferred)

```bash
yarn run getReposByLanguage
```

OR

```bash
npm run getReposByLanguage
```

When using GitHub Actions, we commonly find (especially for non-build languages such as JavaScript) that the `codeql-analysis.yml` file is repeatable and consistent across multiple repositories of the same language. About 80% of the time, teams can reuse the same workflow files for the same language. For Java, C++ that number drops down to about 60% of the time. But the reason why we recommend enabling Code Scanning at bulk via language is the `codeql-analysis.yml` file you propose within the pull request has the highest chance of being most accurate. Even if the file needs changing, the team reviewing the pull request would likely only need to make small changes. We recommend you run this command first to get a list of repositories to enable Code Scanning. After running the command, you are welcome to modify this file. Just make sure it's a valid JSON file if you do edit.

This script only returns repositories where CodeQL results have not already been uploaded to code scanning. If any CodeQL results have been uploaded to a repositories code scanning feature, that repository will not be returned to this list. The motivation behind this is not to raise pull requests on repositories where CodeQL has already been enabled.

**OPTION 2**

```bash
yarn run getReposByUser
```

OR

```bash
npm run getReposByUser
```

Similar to step one, another automated approach is to enable user access. This approach will be a little less accurate as the file will most certainly need changing between a Python project and a Java project, and the user's PAT you are using will most likely. But the file you propose is going to be a good start. After running the command, you are welcome to modify this file. Just make sure it's a valid JSON file if you do edit.

This script only returns repositories where CodeQL results have not already been uploaded to code scanning. If any CodeQL results have been uploaded to a repositories code scanning feature, that repository will not be returned to this list. The motivation behind this is not to raise pull requests on repositories where CodeQL has already been enabled.

**OPTION 3**

Create a file called `repos.json` within the root of this directory. This file needs to have an array of objects. The structure of the objects should look like this:

```JSON
[
  {
    "repo": "repo-name-one",
    "enableDependabot": false
  },
  {
    "repo": "repo-name-two",
    "enableDependabot": true
  }
]
```

As you can see, the object takes two keys, `repo` and `enableDependabot`. Set `repo` to the name of the repository name where you would like the `codeql-analysis.yml` file to be enabled on. Set `enableDependabot` to `true` if you would also like to enable `Dependabot` on that repo; set it to `false` if you do not want to enable `Dependabot`.

**NOTE:** The account that generated the PAT needs to have `write` access or higher over any repository that you include within the `repos` key.

### Step Two

Run the script which enables Code Scanning (and/or Dependabot) on your repository by running:

```bash
yarn run start
```

OR

```bash
npm run start
```

This will run a script, and you should see output text appearing on your screen.

After the script has run, please head to your `~/Desktop` directory and delete the `tempGitLocations` directory that has been automatically created.

## Found an Issue?

Create an issue within the repository and make it to `@nickliffen`. Key things to mention within your issue:

- Windows or Mac
- What version of NodeJS you are running.
- Print any logs that appear on the terminal or command prompt

## Want to Contribute?

Great! Open an issue, describe what feature you want to create and make sure to `@nickliffen`.
