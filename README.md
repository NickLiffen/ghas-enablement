# GitHub Advanced Security - Code Scanning, Secret Scanning & Dependabot Bulk Enablement Tooling

## Purpose

The purpose of this tool is to help enable GitHub Advanced Security (GHAS) across multiple repositories in an automated way. There will be times when you need the ability to enable Code Scanning (CodeQL), Secret Scanning and/or Dependabot across various repositories, and you don't want to click buttons manually or drop a GitHub Workflow for CodeQL into every repository. Doing this is manual and painstaking. The purpose of this utility is to help automate these manual tasks.

## Context

The primary motivator for this utility is CodeQL. It is incredibly time-consuming to enable CodeQL across multiple repositories. Additionally, no API allows write access into the `.github/workflow/*` directory. So this means teams have to write various scripts with variating results. This tool provides a tried and proven way of doing that.

Secret Scanning & Dependabot is also hard to enable if you only want to enable it on specific repositories versus everything. This tool allows you to do that easily.

## What does this tooling do?

There are two main actions this tool does:

**Part One:**

Goes and collects repositories that will have Code Scanning(CodeQL)/Secret Scanning/Dependabot enabled. There are three main ways these repositories are collected.

- Collect the repositories where the primary language matches a specific value. For example, if you provide JavaScript, all repositories will be collected where the primary language is, Javascript.
- Collect the repositories to which a user has administrative access, or a GitHub App has access.
- Manually create `repos.json`.

If you select option 1, the script will return all repositories in the language you specify (which you have access to). The repositories collected from this script are then stored within a `repos.json` file. If you specify option 2, the script will return all repositories you are an administrator over. The third option is to define the `repos.json` manually. We don't recommend this, but it's possible. If you want to go down this path, first run one of the above options for collecting repository information automatically, look at the structure, and build your fine of the laid out format.

**Part Two:**

Loops over the repositories found within the `repos.json` file and enables Code Scanning(CodeQL)/Secret Scanning/Dependabot.

If you pick Code Scanning:

- Loops over the repositories found within the `repos.json` file. A pull request gets created on that repository with the `codeql-analysis.yml` found in the root of this repository. For convenience, all pull requests made will be stored within the `prs.txt` file, where you can see and manually review the pull requests after the script has run.

If you pick Secret Scanning:

- Loops over the repositories found within the `repos.json` file. Secret Scanning is then enabled on these repositories.

If you pick Dependabot:

- Loops over the repositories found within the `repos.json` file. Dependabot is then enabled on these repositories.

## Prerequisite

- [Node v16](https://nodejs.org/en/download/) or higher installed.
- [Yarn](https://yarnpkg.com/)\*
- [Git](https://git-scm.com/downloads) installed on the user's machine running this tool.
- Someone who has at least admin access over the repositories they want to enable Code Scanning on. Or, access to GitHub App credentails which has access to the repositories you want to enable Code Scanning on
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

3.  Generate your choosen authentication stratergy. You are either able to use a [GitHub App](https://docs.github.com/en/developers/apps/getting-started-with-apps/about-apps) or a [Personal Access Token (PAT)](https://github.com/settings/tokens/new). The GitHub App needs to have permissions of `read and write` of `pull requests`, `issues`, `administration`, `contents`. The GitHub PAT needs access to `repo` only.

4.  Rename the `.env.sample` to `.env`. On a Mac, this can be done via the following terminal command:

```bash
mv .env.sample .env
```

5. Update the `.env` with the required values. Please pick one of the authentication methods for interacting with GitHub. You can either fill in the `GITHUB_API_TOKEN` with a PAT that has access to the Org. OR, fill in all the values required for a GitHub App. **Note**: It is recommended to pick the GitHub App choice if running on thousands of repositories, as this gives you more API requests versus a PAT.
    - If using a GitHub App, either paste in the value as-is in the `APP_PRIVATE_KEY` in the field surrounded by double quotes (the key will take up multiple lines), or convert the private key to a single line surrounded in double quotes by replacing the new line character with `\n` (In VS Code on Mac, you can use `⌃ + Enter` to find/replace the new line character)

6. Update the `GITHUB_ORG` value found within the `.env`. Remove the `XXXX` and replace that with the name of the GitHub Organisation you would like to use as part of this script. **NOTE**: If you are running this across multiple organisations within an enterprise, you can not set the `GITHUB_ORG` variable and instead set the `GITHUB_ENTERPRISE` one with the name of the enterprise. You can then run `yarn run getOrgs`, which will collect all the organisations dynamically. This will mean you don't have to hardcode one. However, for most use cases, simply hardcoding the specific org within the `GITHUB_ORG` variable where you would like this script run will be the job.

7. Update the `LANGUAGE_TO_CHECK` value found within the `.env`. Remove the `XXXX` and replace that with the language you would like to use as a filter when collecting repositories. **Note**: Please make sure these are lowercase values, such as: `javascript`, `python`, `go`, `ruby`, etc.

8. Decide what you want to enable. Update the `ENABLE_ON` value to deicde what you want to enable on the repositories found within the `repos.json`. This can be one or multiple values. If you are enabling just code scanning (CodeQL) you will need to set `ENABLE_ON=codescanning`, if you are enabling everything, you will need to set `ENABLE_ON=codescanning,secretscanning,dependabot`. You can pick one, two or three. The format is a comma seperated list.

9. **OPTIONAL**: Update the `CREATE_ISSUE` value to `true/false` depending on if you would like to create an issue explaining purpose of the PR. We recommend this, as it will help explain why the PR was create; and give some context. However, this is optional. The text which is in the issue can be modified and found here: `./src/utils/text/`.

10. **OPTIONAL**: If you are a GHES customer, then you will need to set the `GHES` env to `true` and then set `GHES_SERVER_BASE_URL` to the URL of your GHES instance. E.G `https://octodemo.com`.

11. If you are enabling Code Scanning (CodeQL), check the `codeql-analysis.yml` file. This is a sample file; please configure this file to suit your repositories needs.

12. Run `yarn add` or `npm install`, which will install the necessary dependencies.

13. Run `yarn run build` or `npm run build`, which will create the JavaScript bundle from TypeScript.

## How to use?

There are two simple steps to run:

### Step One

The first step is collecting the repositories you would like to run this script on. You have three options as mentioned above. Option 1 is automated and finds all the repositories within an organisation you have admin access to. Option 2 is automated and finds all the repositories within an organisation based on the language you specify. Or, Option 3, which is a manual entry of the repositories you would like to run this script on. See more information below.

**OPTION 1** (Preferred)

```bash
yarn run getRepos // In the `.env` set the `LANGUAGE_TO_CHECK=` to the language. E.G `python`, `javascript`, `go`, etc.
```

When using GitHub Actions, we commonly find (especially for non-build languages such as JavaScript) that the `codeql-analysis.yml` file is repeatable and consistent across multiple repositories of the same language. About 80% of the time, teams can reuse the same workflow files for the same language. For Java, C++ that number drops down to about 60% of the time. But the reason why we recommend enabling Code Scanning at bulk via language is the `codeql-analysis.yml` file you propose within the pull request has the highest chance of being most accurate. Even if the file needs changing, the team reviewing the pull request would likely only need to make small changes. We recommend you run this command first to get a list of repositories to enable Code Scanning. After running the command, you are welcome to modify this file. Just make sure it's a valid JSON file if you do edit.

This script only returns repositories where CodeQL results have not already been uploaded to code scanning. If any CodeQL results have been uploaded to a repositories code scanning feature, that repository will not be returned to this list. The motivation behind this is not to raise pull requests on repositories where CodeQL has already been enabled.

**OPTION 2**

```bash
yarn run getRepos // or npm run getRepos
```

Similar to step one, another automated approach is to enable by user access. This approach will be a little less accurate as the file will most certainly need changing between a Python project and a Java project (if you are enabling CodeQL), and the user's PAT you are using will most likely. But the file you propose is going to be a good start. After running the command, you are welcome to modify this file. Just make sure it's a valid JSON file if you do edit.

This script only returns repositories where CodeQL results have not already been uploaded to code scanning. If any CodeQL results have been uploaded to a repositories code scanning feature, that repository will not be returned to this list. The motivation behind this is not to raise pull requests on repositories where CodeQL has already been enabled.

**OPTION 3**

Create a file called `repos.json` within the `./bin/` directory. This file needs to have an array of objects. The structure of the objects should look like this:

```JSON
[
  {
    "enableDependabot": "boolean",
    "enableSecretScanning": "boolean",
    "createIssue": "boolean",
    "repo": "string <org/repo>",
  }
]
```

As you can see, the object takes four keys: `repo`, `enableSecretScanning`, `createIssue` and `enableDependabot`. Set `repo` to the name of the repository name where you would like to run this script on. Set `enableDependabot` to `true` if you would also like to enable `Dependabot` on that repo; set it to `false` if you do not want to enable `Dependabot`. The same goes for `enableSecretScanning`. Finally set `createIssue` to `true` if you would like to create an issue on the repository with the text found in the `./src/utils/text/issueText.ts` directory.

**NOTE:** The account that generated the PAT needs to have `write` access or higher over any repository that you include within the `repos` key.

### Step Two

Run the script which enables Code Scanning (and/or Dependabot/Secret Scanning) on your repository by running:

```bash
yarn run start // or npm run start
```

This will run a script, and you should see output text appearing on your screen.

After the script has run, please head to your `~/Desktop` directory and delete the `tempGitLocations` directory that has been automatically created.

## Running this within a Codespace?

There are some key considerations which you will need to put into place if you are running this script within a GitHub Codespace:

1. You will need to add the following snippet to the `.devcontainer/devcontainer.json`:

```json
  "codespaces": {
    "repositories": [
      {
        "name": "<ORG_NAME>/*",
        "permissions": "write-all"
      }
    ]
  }
```

The reason you need this within your `.devcontainer/devcontainer.json` file is the `GITHUB_TOKEN` tied to the Codepsace will need to access other repositories within your organisation which this script may interact with. You will need to create a new Codespace **after** you have added the above and pushed it to your repository.

You do not need to do the above if you are not running it from a Codespace.

## Found an Issue?

Create an issue within the repository and make it to `@nickliffen`. Key things to mention within your issue:

- Windows or Mac
- What version of NodeJS you are running.
- Print any logs that appear on the terminal or command prompt

## Want to Contribute?

Great! Open an issue, describe what feature you want to create and make sure to `@nickliffen`.
