#!/bin/bash
# This bash script is a wrapper for the ghas-enablement tool to make it easier to run
# It is meant to be run from the command line in the same folder as the ghas-enablement tool
#

# Define the colors
GREEN=$(tput setaf 2)
RED=$(tput setaf 1)
CYAN=$(tput setaf 6)
GREY=$(tput setaf 8)
YELLOW=$(tput setaf 3)
BLUE=$(tput setaf 4)
RESET=$(tput sgr0)

# Check if the .env file exists
# If it doesn't exist, copy the .env.example file to .env
if [ ! -f .env ]; then
    cp .env.sample .env
fi

## Check if .bin/repos.json exists
## If it doesn't exist, create it
if [ ! -f ./bin/repos.json ]; then
    touch ./bin/repos.json
fi

function getOrgs {
    read -p "${CYAN}Enter your Enterprise name:${RESET} " enterpriseName
    sed -i '' -e "s/GITHUB_ENTERPRISE=.*/GITHUB_ENTERPRISE=$enterpriseName/g" .env
    yarn run getOrgs
    mv ./bin/organizations.json ./bin/organizations.work.json
}

function enableOnOrgPerRepo {
    echo -e "${CYAN}Type in the name of the organization you want to enable features for:${RESET} "
    echo -e "${GREY}Type 'next' to see the next page of organizations to select one${RESET}"
    echo -e "${GREY}Type 'all' to enable on all organizations found${RESET}"
    echo -e "${GREY}Type 'exit' to exit${RESET}"

    while true; do
        read -p "${CYAN} -> ${RESET}"  orgName
        
        if [ "$orgName" == "next" ]; then
            cat ./bin/organizations.work.json | jq -c '.[] | select(.completed != true)' | jq -c '.login' | sed 's/"//g' | sed 's/,//g' | sed 's/ //g' | head -n 10
        elif [ "$orgName" == "exit" ]; then
            break
        elif [ "$orgName" == "all" ]; then
            for org in $(cat ./bin/organizations.work.json | jq -c '.[] | select(.completed != true)' | jq -c '.login' | sed 's/"//g' | sed 's/,//g' | sed 's/ //g'); do
                sed -i '' -e "s/GITHUB_ORG=.*/GITHUB_ORG=$org/g" .env
                yarn run getRepos
                if [ $? -eq 0 ]; then
                    cp ./bin/repos.json ./bin/repos-$org.json
                    jq --arg orgName "$org" 'map(if .login == $orgName then . + {completed: true} else . end)' ./bin/organizations.work.json > ./bin/organizations.work.json.tmp && mv ./bin/organizations.work.json.tmp ./bin/organizations.work.json
                else
                    echo -e "${RED}Failed to get repos for $org${RESET}"
                fi
            done
            break
        else
            sed -i '' -e "s/GITHUB_ORG=.*/GITHUB_ORG=$orgName/g" .env
            yarn run getRepos
            if [ $? -eq 0 ]; then
                cp ./bin/repos.json ./bin/repos-$orgName.json
                jq --arg orgName "$orgName" 'map(if .login == $orgName then . + {completed: true} else . end)' ./bin/organizations.work.json > ./bin/organizations.work.json.tmp && mv ./bin/organizations.work.json.tmp ./bin/organizations.work.json
            else
                echo -e "${RED}Failed to get repos for $orgName${RESET}"
            fi
            break
        fi
    done
}

function enableOnOrgAllRepos {
    echo -e "${CYAN}Type in the name of the organization you want to enable features for:${RESET} "
    echo -e "${GREY}Type 'next' to see the next page of organizations${RESET}"
    echo -e "${GREY}Type 'all' to enable on all organizations found${RESET}"
    echo -e "${GREY}Type 'exit' to exit${RESET}"

    while true; do
        read -p "${CYAN} -> ${RESET}"  orgName
        
        if [ "$orgName" == "next" ]; then
            cat ./bin/organizations.work.json | jq -c '.[] | select(.completed != true)' | jq -c '.login' | sed 's/"//g' | sed 's/,//g' | sed 's/ //g'
        elif [ "$orgName" == "exit" ]; then
            break
        elif [ "$orgName" == "all" ]; then
            for org in $(cat ./bin/organizations.work.json | jq -c '.[] | select(.completed != true)' | jq -c '.login' | sed 's/"//g' | sed 's/,//g' | sed 's/ //g'); do
                sed -i '' -e "s/GITHUB_ORG=.*/GITHUB_ORG=$org/g" .env
                yarn run enableOrg
                if [ $? -eq 0 ]; then
                    jq --arg orgName "$org" 'map(if .login == $orgName then . + {completed: true} else . end)' ./bin/organizations.work.json > ./bin/organizations.work.json.tmp && mv ./bin/organizations.work.json.tmp ./bin/organizations.work.json
                else
                    echo -e "${RED}Failed to enable features for $org${RESET}"
                fi
            done
            break
        else
            sed -i '' -e "s/GITHUB_ORG=.*/GITHUB_ORG=$orgName/g" .env
            yarn run enableOrg
            if [ $? -eq 0 ]; then
                jq --arg orgName "$orgName" 'map(if .login == $orgName then . + {completed: true} else . end)' ./bin/organizations.work.json > ./bin/organizations.work.json.tmp && mv ./bin/organizations.work.json.tmp ./bin/organizations.work.json
            else
                echo -e "${RED}Failed to enable features for $orgName${RESET}"
            fi
            break
        fi
    done
}

function printProgress {
    # print how many organizations from organization.work.json have completed
    echo -e "\n ${BLUE} Progress ${RESET}\n"
    echo -e "${BLUE}Total number of organizations${RESET}"
    cat ./bin/organizations.work.json | jq '. | length'
    echo -e "${BLUE}Number of organizations that have completed${RESET}"
    cat ./bin/organizations.work.json | jq -c '.[] | select(.completed == true)' | jq '.login' | sed 's/"//g' | sed 's/,//g' | sed 's/ //g' | wc -l | tr -d '[:space:]'
    # print percetage of organizations that have completed
    echo -e "\n${BLUE}Percentage of organizations that have completed${RESET}"
    cat ./bin/organizations.work.json | jq -c '.[] | select(.completed == true)' | jq '.login' | sed 's/"//g' | sed 's/,//g' | sed 's/ //g' | wc -l | awk -v total=$(cat ./bin/organizations.work.json | jq '. | length') '{printf "%.2f%%", ($1 / total) * 100}'
    echo -e "\n"

    total_repos=0
    echo -e "${BLUE}Number of repos that have completed for each organization:${RESET}"
    for org in $(cat ./bin/organizations.work.json | jq -c '.[] | select(.completed == true)' | jq '.login' | sed 's/"//g' | sed 's/,//g' | sed 's/ //g'); do
        num_repos=$(cat ./bin/repos-$org.json | jq '.[] | select(.login == "'"$org"'") | .repos | length')
        if [ -z "$num_repos" ]; then
            num_repos=0
        fi
        echo -e "${GREY}$org: ${RESET} $num_repos"
        total_repos=$((total_repos + num_repos))
    done
    echo -e "${BLUE}Total number of repositories enabled:${RESET} $total_repos\n"
}

function configure {
    read -p "${CYAN}Enter your admin PAT: ${RESET}" adminPat
    read -p "${CYAN}Enter the features you want to enable: ${RESET}" features
    read -p "${CYAN}Enter your GHES URL (leave empty if it is GHEC):${RESET}" ghesUrl
    read -p "${CYAN}Temp working directory (press enter to create /tmp/ghas-enablement): ${RESET}" tempDir
    if [ -z "$ghesUrl" ]; then
        sed -i '' -e "s/GHES_SERVER_BASE_URL=.*/GHES_SERVER_BASE_URL=/g" .env
        sed -i '' -e "s/GHES=.*/GHES=false/g" .env
    else
        sed -i '' -e "s|GHES_SERVER_BASE_URL=.*|GHES_SERVER_BASE_URL=$ghesUrl|g" .env
        sed -i '' -e "s/GHES=.*/GHES=true/g" .env
    fi
    sed -i '' -e "s/GITHUB_API_TOKEN=.*/GITHUB_API_TOKEN=$adminPat/g" .env
    sed -i '' -e "s/ENABLE_ON=.*/ENABLE_ON=$features/g" .env

    if [ -z "$tempDir" ]; then
        mkdir -p /tmp/ghas-enablement
        tempDir="/tmp/ghas-enablement"
    fi
    sed -i '' -e "s|TEMP_DIR=.*|TEMP_DIR=$tempDir|g" .env
    
}

# Define the menu options
OPTIONS=(1 "Get Organizations in your Enterprise"
         2 "Enable features for Organization"
         3 "Print progress of enablement"
         4 "Configure"
         5 "Exit")
 
# Print the banner
echo -e "${YELLOW}"
echo "  ____ _   _    _    ____  "
echo " / ___| | | |  / \  / ___| "
echo "| |  _| |_| | / _ \ \___ \ "
echo "| |_| |  _  |/ ___ \ ___) |"
echo " \____|_| |_/_/   \_|____/ "
echo "                           "
echo -e "${GREEN}GHAS Enablement CLI${RESET}"

# Loop until user chooses to exit
while true; do
    # Print a line of dashes
    printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -
    # Display the menu and get the user's choice
    echo -e "\nPlease choose an option:\n"
    echo -e "${GREEN} 1. Get Organizations in your Enterprise${RESET}"
    echo -e "${GREEN} 2. Enable features for Organization - For all repos at once${RESET}"
    echo -e "${GREEN} 3. Enable features for Organization - Per repo${RESET}"
    echo -e "${GREEN} 4. Print progress ${RESET}"
    echo -e "${GREEN} 5. Configure${RESET}"
    echo -e "${GREEN} 6. Exit${RESET}"
    read -p "${CYAN} Enter your choice: ${RESET}" choice
    # Print another line of dashes
    printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -

    # Call the appropriate function based on user input
    case $choice in
        1)
            getOrgs
            ;;
        2)
            enableOnOrgAllRepos
            ;;
        3)
            enableOnOrgPerRepo
            ;;
        4)
            printProgress
            ;;
        5)
            configure
            ;;
        6)
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid choice${RESET}"
            ;;
    esac
done