# Splash

A web app for visualizing National Basketball Association shooting statistics.
Though under active development, check it out at https://splash.jackfletch.com.

## Other Code

The utility functions for transforming the data are extracted to their own package, [@jackfletch/splash-vis-utils].

The database schema and ETL functions are in [@jackfletch/splash-db].

## TODO

- add an ergonomic player selection
- add more charts
  - left-right chart
    - implement hover manually
  - career shooting percentage trend chart
- design a proper layout
- style consistently
- refactor to React hooks
- create routes for different chart views
  - player view
  - player career view
  - compare players view
  - team view
  - compare team view
  - season view
  - compare season view

[@jackfletch/splash-vis-utils]: https://github.com/jackfletch/splash-vis-utils
[@jackfletch/splash-db]: https://github.com/jackfletch/splash-db
