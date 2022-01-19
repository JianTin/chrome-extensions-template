const {watchFile} = require('fs')
const watch = require('node-watch')
const {dirname, join} = require('path')
const {copySync, removeSync} = require('fs-extra')

const root = dirname(__dirname)
// enter
const manifestPath = join(root, 'manifest.json')
const assetsPath = join(root, 'assets')
const locales = join(root, 'src/_locales')
// output
const distPath = join(root, 'dist')
const distManifest = join(distPath, 'manifest.json')
const distAsset = join(distPath, 'assets')
const distLocales = join(distPath, '_locales')

watchFile(manifestPath, ()=>{
    removeSync(distManifest)
    copySync(manifestPath, distManifest)
})
watch(assetsPath, {recursive: true},()=>{
    removeSync(distAsset)
    copySync(assetsPath, distAsset)
})
watch(locales, {recursive: true}, ()=> {
    removeSync(distLocales)
    copySync(locales, distLocales)
})