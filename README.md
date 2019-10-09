# Chromastax

Chromastax is a WebVR game inspired by Bejewled and Tetris. It can be played on desktop, mobile devices, and in most types of VR HMD's.

## Playing The Game

This README is mostly for the benefit of people who would like to contribute to the development of the game. If you're only interested in _playing_ Chromastax, head over to the [Demo Page](https://webvr.decodingsteve.com/chromastax) and try it out! For game play instructions, you can check out the (very basic), [manual page](https://github.com/stlewis/chromastax_reloaded/blob/master/HOWTO.md) contained in this repository.

## Contributing

I'm very open to any contributions, be they bug reports, comments, suggestions, or even PR's with improvements or code fixes. If you'd like to file a bug, comment or suggestion, please [open an issue](https://github.com/stlewis/chromastax_reloaded/issues/new).

If you're interested in working on the code, you'll need to make sure that you have a development environment that is suitable. Mostly this means having a relatively recent version of npm installed on your computer. To get up and running:

1. Fork this repository.
2. Clone your forked repository to your local machine.
3. Inside the project directory execute `npm i`
4. Still inside the project directory, execute `npm run build`

The 4th step will package all of the source files into a final `build.js`, which is already linked inside of the index.

After everything is built, you can start the project with `npm run start`. This will start a `live-server` instance and open the game up in your default browser. The benefit of `live-server` is that it will reload the page every time you make changes to your source.

A quick note related to that though. All of the A-Frame components for this project, (located in the `components` directory), are included in `index.js` in order to be bundled into `build.js`. Because `index.html` only includes `build.js`, this means that before your changes to any component are reflected in the game, you will need to rebuild.

To get around this temporarily, simply comment out the reference to the component you're working on in `index.js`, use a `<script>` tag to directly include the component on `index.html`, then rebuild. Thereafter, changes to the directly included component will be reflected immediately. I only ask that you don't leave things in this state permanently, as I'd prefer for everything to be compiled and referenced from `build.js`.

After you've finished working on the code, please feel free to submit a pull request, and I'll take a look as soon as I'm able!
