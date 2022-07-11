// import { useObsidian } from 'https://deno.land/x/obsidian@v3.2.0/ObsidianWrapper/ObsidianWrapper.jsx';
import React from 'https://jspm.dev/react';
import ReactDOMServer from 'https://jspm.dev/react-dom/server';
import ReactDOM from 'https://jspm.dev/react-dom';
import {
  ObsidianWrapper,
  useObsidian,
} from './obsidian/ObsidianWrapper/ObsidianWrapper.jsx';
import BrowserCache from './obsidian/src/Browser/CacheClassBrowser.js';

// import { ObsidianWrapper, useObsidian, BrowserCache } from 'https://deno.land/x/obsidian@v.4.0.0/clientMod.ts';

// import {
//   ObsidianWrapper,
//   useObsidian
// } from '../obsidian/ObsidianWrapper/ObsidianWrapper.jsx';

// import BrowserCache from '../obsidian/src/Browser/CacheClassBrowser.js';

export { React, ReactDOMServer, ReactDOM ,ObsidianWrapper, useObsidian, BrowserCache};
