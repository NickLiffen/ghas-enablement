# GitHub Advanced Security - Code Scanning & Dependabot Enablement Tooling

## Context

There is no API access into the `.github/workflows/*` directory, and teams do not want to go and create a `codeql-analysis.yml` files manually across hundreds of repositories. 

## Purpose

The purpose of this tool is to help enable GitHub Code Scanning across multiple repositories in an automated way.

## What does this tooling do?

There are two main actions this tool does:

1) Goes and collects all the repositories a user has admin access over and stores them in the `repos.json `file. 

2) Loops over the repos found within the `repos.json `file and creates a pull request on that repository with the `codeql-analysis.yml` found in the root of this repository. For peace of mind, all pull requests created are stored within the `prs.txt` file, where you can see the URL's of the pull requests created. 

## Prerequisite

-   [Node v12](https://nodejs.org/en/download/) or higher installed.
-   [Git](https://git-scm.com/downloads) installed on the user's machine running this tool.
-   Someone who has at least admin access over the repositories they want to enable Code Scanning on.
-   Some basic software development skills, e.g., can navigate their way around a terminal or command prompt.

## Set up Instructions

1.  Clone this repository onto your local machine.

```
git clone https://github.com/NickLiffen/ghas-enablement.git
```

2.  Change the directory to the repository you have just installed.

```
cd ghas-enablement
```

3.  Generate a [Personal Access Token (PAT)](https://github.com/settings/tokens/new) and assign the `repo` scope.

4.  Rename the `.env-sample` to `.env`. On a Mac, this can be done via the following terminal command:

```
mv .env-sample .env
```

5.  Update the `GITHUB_TOKEN` value found within the `.env`. Remove the `XXXX` and replace that with the PAT created in Step 1.

6.  Update the `GITHUB_ORG` value found within the `.env`. Remove the `XXXX` and replace that with the name of the GitHub Organisation you would like to use as part of this script.

7.  Check the `codeql-analysis.yml` file. This is a sample file; please configure this file to suit your application needs.

8. Run `npm run build`, which will create the JavaScript bundle from TypeScript.

## How to use?

There are two simple steps to run:

### Step One

The first step is collecting the repositories you would like to run this script on. You have two options. Option 1, which is automated and finds all the repositories you have admin access to. Or, Option 2, which is a manual entry of the repositories you would like to run this script on. See more information below.

**OPTION 1** (Preferred)

```
npm run getRepos
```

Suppose you don't want to manually go through and copy/paste the repo names into `repos.json`. In that case, you may execute this command that returns you with a list of repos the current user is associated with and has admin access to. Post successful execution of this command, `repos.json` is created/updated at the root level holding the desired list. This can be viewed/edited, and you may proceed with the following command to perform updates. You are welcome to modify this file. Just make sure it's a valid JSON file if you do edit.

OR

**OPTION 2**

Create a file called `repos.json` within the root of this directory. This file needs to have an array of objects. The structure of the objects should look like this:

```
[{
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

```
npm run start
```

This will run a script, and you should see output text appearing on your screen.

After the script has run, please head to your `~/Desktop` directory and delete the `tempGitLocations` directory that has been automatically created.

## Found an Issue?

Create an issue within the repository and make it to `@nickliffen`. Key things to mention within your issue:

-   Windows or Mac
-   What version of NodeJS you are running.
-   Print any logs that appear on the terminal or command prompt

## Want to Contribute?

Great! Open an issue, describe what feature you want to create and make sure to `@nickliffen`.
