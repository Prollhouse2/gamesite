[![Build Status](https://dev.azure.com/airmash/airmash/_apis/build/status/airmash-refugees.airmash-frontend?branchName=master)](https://dev.azure.com/airmash/airmash/_build/latest?definitionId=2&branchName=master)

# airmash-frontend

This repository contains the last available copy of the Airmash frontend app,
as extracted from archive.org, with a bunch of edits intended to make things
more readable and maintainable:

- Tidied HTML (HTML tidy, introduced a bunch of bugs, was kind of a mistake).
- Identified all the third party JS library versions in use and replaced them
  with canonical upstream releases. The official pixi.js breaks the HUD 
  rendering, so there is a patch to make it match the Airmash release.
- Carved up all the original JS into files living under ``src/js/``. Each file
  represents what appears to be one of the original source modules.
- Reindented all the JS, and applied some highly selective use of
  ``jsnice.org`` to improve readability of some functions, particularly in
  graphics. The Git log details each use individually.
- Modified the connection code to not rely on airma.sh DNS layout. Instead
  it reads the game data from `https://data.airmash.online/games`, and constructs
  each server's WebSocket (`wss://`) URL from ``host`` and ``path``.
- Print a nice error when WebSocket connections fail.

### Building and deployment

The code has been repackaged with npm to use [webpack](https://webpack.js.org/) for
building the final frontend code. To build locally, issue these commands after cloning
the repo:

```
npm install
npm run build
```

The output will be created in `dist/`, and can be served using a local web server for testing (e.g. something like `cd dist ; python3 -m http.server`).

For development, ``DEBUG=1 npm run build`` cuts build time down by disabling minification.

### This repository contains proprietary code

The original Airmash game was never published as free software, and so the
8,000 lines of non-library JS are covered by copyright. The copyright owner
appears disinterested in updating Airmash, but that does not mean their rights
have disappeared. Don't copy code you find here into projects you care about!

The existence of this repository is not even a grey area – it's directly
infringing. But it seems such infringement is the only option we have left to
keep the game alive.

Pristine copies of the original assets are available under the
[archive.org-original](https://github.com/airmash-refugees/airmash-frontend/tree/archive.org-original)
tag.

### Patches welcome

One reason I love Airmash so much is because it was such a beautiful piece of
code. They managed to fit a compelling multiplayer action game in a web
browser, that's really a work of art. I'd love to preserve that art as much as
possible, but it's also important for the remaining Airmash players to work
together to preserve what remains of the game.

So with that said, please assume quite a permissive policy with regard to what
can be merged into this repository, and please understand this repository
belongs to everyone.
