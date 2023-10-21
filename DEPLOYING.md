# Deployment Guide

1. `> git tag -a v#.#.# -m "Short Summary of User Facing Changes"`
1. Approve the deployment to staging via GitHub
1. (Optional) Spot check staging
1. Create a release from the new tag via GitHub
1. Generate release notes from the previous tag via GitHub
1. (Optional) Trim release notes down to user facing changes
1. Approve the deployment to production via GitHub
1. (Optional) Spot check production
1. (Optional) Close any related issue, comment with new tag via GitHub

[SemVer](https://semver.org/) tags must be used.

A short summary can be derived from clicking the latest tag in GitHub then reviewing the commits "to main since this release".

Staging APIs will only work with accounts that have been added to the app's staging dashboard via Spotify's developer portal.
