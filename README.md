This is a Composer-based installer for the [Dung Beetle Project] and is based on a Drupal lighting distribution by Acquia.

The project uses Barrio Boostrap 4 for template managment and installs to the web/themes/custom directory.

Other modules required with this project:
- Moderation (although maybe not used initially it has potential to allow users to login and submit articles which was part of the original scope)
- Blazy - Lazy loading for images
- Bootstrap library via CDN
- Drupal Core provides a new concept of configurable block types similar to content types
- Media type manager extends the amount of media that can be managed within Drupal within the lightning distro
- Image Crop widget
- Image Effects 
- Image dropzonejs 
- Layout library provides a number of new layouts of specific pages as part of the layout builder initiaive
- Meta Tags module (should be part of core but isn't)
- Slick carousel 
- leaflet
- Views infinite scroll
- Real time SEO with Yoast
- Webform
- JSON:API & Serialisation setup for headless implemenation if Gatsbyjs might be utilised (defualt part of build)
- Claro Theme for admin has been setup instead of Seven and is the up and coming modernisation of D8 Admin
- Drush (part of lighting) used for clearing cache and config export and config import Drush 9 alo allows quick start modules to accelerate.
- Drupal console ()

## Why is this necessary?

1. In order to have multiple developers working on the one project at the same time it enhances our workflow where multiple people are involved.

2. Drupal 8 dependencies/modules are more easily maanged via composer and alothough not git part of the overall project.


## Getting Started

1. git clone the project structure setup on your machine. This is unlike FTPing down the files for the project it will go out and only get the structure files but no libraries.

git clone https://github.com/AngryAntWebDesign/DBEE.git

Imporant to note is that unless using "configuration manager" you will not get any drupal system configuration using the git clone or pull. 

Also important is that files such as:
-  images and assets are not stored in this repo but should be transferred separatly and placed under sites/default/files unless otherwise specified. Version contorl is not necessary on this repo. 
-  settings files containing database settings instead use the .env to setup the db connection which is outside of the web root and contains a flag to switch between running environents eg. prod, stag, dev. 

CSS and theme files are version controlled and part of this repo usually under the web/themes/custom

2. 

$ composer install 
From the proejct root and not the "web" This will download all of your vendor files and dependancies.

3.
Hosting environment setup is the next step in getting something running and will vary from environment to environemnt. 

## Hosing environments

### 1 DDEV

 - DDEV requires a docker container but will detect the required configuration for the proejct depending on the setup. The beuty of ddev is speed and configuration setup. easy quick snapshots. More information on ddev can be found https://ddev.readthedocs.io/en/latest/users/cli-usage/  Note that DDEV is most easily setup on Mac using brew if you don't already have brew you will also need to install it. Docker is downloaded from https://www.docker.com/get-started

--------------
$ ddev config
This will go through a config setup including choosing D8 as the envinroment. It configures your settings.php

$ ddev start
This will start a container with a db and configuration. Please note that this may use a settings.ddev.php file to link to a local db. 

$ ddev import-db --src=dbee_drupal.sql.zip

Note the recommended way to pass around configurations for D8 is by "configuration manager" using $ drush cex and $ drush cim However I have found this problematic for blocks when using layout builder.


### 2 Acquia Dev Desktop (legacy)
Provoide your codebase from 1 and 2 to the acquia dev desktop together with your database. You must run teh composer install first. No .env file will be used by acquia desktop. 

### 3 lando

TBA

### 4 MAMP

TBA


### 4 Server Environment LAMP stack for staging or production

Using a non-root account 

$ su dungbeetle
$ git clone #(first setup)
$ git pull origin master #(after it's active)
$ composer install
Configure your .env file
Depending on the setup you may need to edit the cpanel or provide a symlink to the webroot so it doens't appear in the web subfolder.

Alternate install with vendor inside web
------------------------------------------
Normally, Composer will install all dependencies into a `vendor` directory that
is *next* to `web`, not inside it. This may create problems in certain
hosting environments, so if you need to, you can tell Composer to install
dependencies into `docroot/vendor` instead:

```
$ composer create-project acquia/lightning-project MY_PROJECT --no-install
$ composer config vendor-dir docroot/vendor
$ cd MY_PROJECT
$ composer install
```

Either way, remember to keep the `composer.json` and `composer.lock` files that exist above `web` -- they are controlling your dependencies.

## Maintenance
`drush make`, `drush pm-download`, `drush pm-update` and their ilk are the old-school way of maintaining your code base. Forget them. You're in Composer land now!

Let this handy table be your guide:

| Task                                            | Drush                                         | Composer                                          |
|-------------------------------------------------|-----------------------------------------------|---------------------------------------------------|
| Installing a contrib project (latest version)   | ```drush pm-download PROJECT```               | ```composer require drupal/PROJECT```             |
| Installing a contrib project (specific version) | ```drush pm-download PROJECT-8.x-1.0-beta3``` | ```composer require drupal/PROJECT:1.0.0-beta3``` |
| Installing a javascript library (e.g. dropzone) | ```drush pm-download dropzone```              | ```composer require bower-asset/dropzone```       |
| Updating all contrib projects and Drupal core   | ```drush pm-update```                         | ```composer update```                             |
| Updating a single contrib project               | ```drush pm-update PROJECT```                 | ```composer update drupal/PROJECT```              |
| Updating Drupal core                            | ```drush pm-update drupal```                  | ```composer update drupal/core```                 |

The magic is that Composer, unlike Drush, is a *dependency manager*. If module ```foo version: 1.0.0``` depends on ```baz version: 3.2.0```, Composer will not let you update baz to ```3.3.0``` (or downgrade it to ```3.1.0```, for that matter). Drush has no concept of dependency management. If you've ever accidentally hosed a site because of dependency issues like this, you've probably already realized how valuable Composer can be.

But to be clear: it is still very helpful to use a site management tool like Drush or Drupal Console. Tasks such as database updates (```drush updatedb```) are still firmly in the province of such utilities. This installer will install a copy of Drush (local to the project) in the ```bin``` directory.

### Specifying a version
you can specify a version from the command line with:

    $ composer require drupal/<modulename>:<version> 

For example:

    $ composer require drupal/ctools:3.0.0-alpha26
    $ composer require drupal/token:1.x-dev 

In these examples, the composer version 3.0.0-alpha26 maps to the drupal.org version 8.x-3.0-alpha26 and 1.x-dev maps to 8.x-1.x branch on drupal.org.

If you specify a branch, such as 1.x you must add -dev to the end of the version.

**Composer is only responsible for maintaining the code base**.

## Source Control
If you peek at the ```.gitignore``` we provide, you'll see that certain directories, including all directories containing contributed projects, are excluded from source control. This might be a bit disconcerting if you're newly arrived from Planet Drush, but in a Composer-based project like this one, **you SHOULD NOT commit your installed dependencies to source control**.

When you set up the project, Composer will create a file called ```composer.lock```, which is a list of which dependencies were installed, and in which versions. **Commit ```composer.lock``` to source control!** Then, when your colleagues want to spin up their own copies of the project, all they'll have to do is run ```composer install```, which will install the correct versions of everything in ```composer.lock```.

### Theme setup

use the custom