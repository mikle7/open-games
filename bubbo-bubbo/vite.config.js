import {join} from 'path';

export default {
    base: './',
    resolve:{
        alias:{
            '@pixi/ui': join(__dirname, 'src/pixi-ui/index.ts'),
        },
    },
};