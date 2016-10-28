# OHI/O
Welcome to the official website for OHI/O, an organization working to foster a tech culture at the Ohio State University.

# File layout
Coming soon

# Submodules
Each of the directory's "sub-sites" (such as the annual hackathon websites) are separate repositories.
Those repositories are linked to from this repository as submodules.

To add an existing repository as a submodule of ohio:

* Enter the root folder of the ohio repo.
* `git submodule add <repository URL> <name of location>`
* Example: When the hackohio2016 repo was added, it was added through the following command:
`git submodule add https://github.com/hackohio/hackOHIO2016 2016`

To update a submodule:
* Commit to the repository of the submodule as you normally would.
* Navigate to the submodule folder (e.g. `ohio\2016`)
* Update the submodule contents: `git pull origin master`
* Go back to the root directory: `cd ..`
* Commit the update: `git add .` followed by `git commit -m 'Updating submodule'`
