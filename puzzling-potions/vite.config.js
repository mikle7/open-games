import {join} from 'path';


export default {
    base: './',
    define: {
        APP_VERSION: JSON.stringify(process.env.npm_package_version),
    },
    resolve:{
        alias:{
            '@pixi/ui': join(__dirname, 'src/pixi-ui/index.ts'),
            'pixi.js': join(__dirname, 'src/pixi-v8/index.mjs'),
        }
    }
    


}