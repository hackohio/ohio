# OHI/O
[![Build Status](https://travis-ci.org/hackohio/ohio.svg?branch=master)](https://travis-ci.org/hackohio/ohio)  
Welcome to the official website for OHI/O, an organization working to foster a tech culture at the Ohio State University.

# How to contribute to the homepage
The homepage is built using Jekyll - a framework for building static webpages.  
https://jekyllrb.com

Installation instructions can be found here:  
https://jekyllrb.com/docs/installation/

A step-by-step tutorial can be found here:  
https://jekyllrb.com/docs/step-by-step/01-setup/

Markdown guide:  
https://www.markdownguide.org/basic-syntax

**Folder structure**:   
root: Contains the main HTML pages and configuration files.  
\_includes: Contains HTML fragments (ex. navbar, footer) that are repeatedly used across pages.  
\_layouts: Contains the HTML skeletons that the main content (ex. index.html, events.html) will be nested within.  
\_assets: Contains all project assets such as CSS, JS and images.  
\_site: Contains the compiled version of the homepage. (Not committed - will only show up locally after you build)

**To test your code locally**:  
1. Navigate to the root of the project  
2. Run `bundle exec jekyll serve`  
3. This will build your code (which is saved under \_site) and start a local server  
4. Open your browser and go to http://localhost:4000  

Important files:  
.travis.yml: Contains the configuration for Travis CI  
\_config.yml: Contains the configuration for Jekyll  
Gemfile: Lists all the ruby dependencies that the project needs (used for Jekyll)  
deploy_rsa.enc: Encrypted key that travis uses to connect to deploy server.  

Deployment thanks to Travis:  
https://travis-ci.org/hackohio/ohio  
https://oncletom.io/2016/travis-ssh-deploy/
