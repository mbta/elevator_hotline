# Elevator Hotline

Provides an automated telephone service which reads out MBTA elevator outages.

## AWS Connect

The Connect contact flow is currently not managed in Terraform; the source of
truth is the AWS dashboard. An export of the flow is committed to this repo as
`hotline_prod.json` and `hotline_dev.json`. When making changes in Connect, be
sure to re-export and update the committed files.

<img src="/hotline_dev.png" alt="Hotline IVR" />

## AWS Lambda

The Lambda function in this repo is called by the Connect contact flow when a
user calls the hotline. It in turn calls the V3 API to get current alerts and
affected stations, returning a set of voice lines to Connect.

### Setup

1. Clone this repo
1. Install [`asdf`](https://github.com/asdf-vm/asdf)
1. Install [`direnv`](https://direnv.net/)
1. `asdf plugin add nodejs`
1. `asdf install`
1. `cp .envrc.template .envrc`
1. `direnv allow`
1. `npm install`

### Development

- `npm test`: Run tests
- `npm run local`: Run the Lambda locally and print output
  - This requires filling in `API_KEY` in `.envrc` with a [V3 API key][api].
    Check [Notion][1p-secrets] for ways to do this securely, without storing the
    key unencrypted.

[api]: https://api-v3.mbta.com/
[1p-secrets]:
  https://www.notion.so/mbta-downtown-crossing/Loading-Secrets-from-1Password-into-Applications-101aa4debcb24372bdc3835918404c93#101aa4debcb24372bdc3835918404c93
