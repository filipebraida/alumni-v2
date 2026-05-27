/*
|--------------------------------------------------------------------------
| Edge globals
|--------------------------------------------------------------------------
|
| Shared values available to every Edge template (e.g. email layouts).
|
*/

import edge from 'edge.js'
import { appUrl } from '#config/app'

edge.global('appUrl', appUrl)
