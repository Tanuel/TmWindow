[![Powered by Tanuel](https://img.shields.io/badge/Powered%20by-Tanuel-b22.svg)](https://gitlab.com/Tanuel)
[![Documentation](https://img.shields.io/badge/-Documentation-blueviolet.svg)](https://tanuel.gitlab.io/tmwindow)
[![Build Pipeline](https://gitlab.com/Tanuel/tmwindow/badges/master/pipeline.svg)](https://gitlab.com/Tanuel/tmwindow/pipelines)
[![npm](https://img.shields.io/npm/v/tmwindow.svg?logo=npm)](https://www.npmjs.com/package/tmwindow)
[![npm](https://img.shields.io/npm/dt/tmwindow.svg?logo=npm)](https://www.npmjs.com/package/tmwindow)

# TmWindow

[➡ Project Page ⬅](https://tanuel.gitlab.io/tmwindow/)

[➡ Full API Reference (TypeDoc) ⬅](https://tanuel.gitlab.io/tmwindow/typedoc/)

## Install

Using yarn

    yarn add tmwindow

using npm
    
    npm install tmwindow

## Usage

[➡ More examples here ⬅](https://tanuel.gitlab.io/tmwindow)

```javascript
const TmWindow = require('tmwindow');

//create window
const tmw = new TmWindow('My Window');

//show window
tmw.open();

//close window
tmw.close();

//remove dom element
tmw.remove();
```