# Annotated VR Tour
**🕶✨ A React VR + JSON API powered annotated tour frontend ✨🕶**

![Editing Demonstration](https://thumbs.gfycat.com/BlushingScaryElk-size_restricted.gif)

## Setup
Currently, this repo depends on the `master` branch of react-vr. Here's what you need to do to develop/deploy this repo locally:

### Development
* Clone this repository
* Clone [react-vr](https://github.com/facebook/react-vr)
* `cd` into the react-vr directory
* `yarn`
* Install babel and OVURI's dependencies. (React VR is a monorepo)
`npm i -g babel-cli && cd OVRUI && npm i && cd -`
* Package react-vr, react-vr-web, and ovrui
`node scripts/build-packages.js`
* You should see
`Built all packages! They are located at /Users/{your/dev/path}/react-vr/package_builds`
* `cd` to your clone of this repository
* `yarn`
* `yarn start`

### Deployment
* Complete above steps 👆🏻
* `yarn run deploy`

## Editing
To edit the location of components:
* Add `?placing=1` to the url
* Click and hold on a component. A green circle appears around it signifying that you have "picked up" the component.
* Drag around the scene to move the component.
* Click the component to drop it.
