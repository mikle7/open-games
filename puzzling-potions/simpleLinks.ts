import 'colors';

import fs from 'fs-extra';
import path from 'path';

const root = process.cwd();

/**
 *  Object that contain a location and target, used to link two folders together
 */
export interface ILink
{
    /**
     * A string that is used to link a folder to the target folder.
     */
    location: string;

    /**
     * A string that is used to link a folder to the location folder.
     */
    target: string;
}

/**
 * Takes two paths to a folder, watches and copies changes from one into the other.
 * @param folder - Folder to be linked.
 * @param target - Target for folder to be linked too.
 * @param watch - simple copy, or watch!
 * @returns Returns a promise that will return a boolean indicating if it fail/succeed at linking folders.
 */
function simpleLink(folder: string, target: string, watch = false): Promise<boolean>
{
    if (!path.isAbsolute(folder))
    {
        folder = path.join(root, folder);
    }

    if (!path.isAbsolute(target))
    {
        target = path.join(root, target);
    }

    return new Promise((resolve) =>
    {
        if (fs.existsSync(folder))
        {
            let id: number | NodeJS.Timeout = -1;

            fs.copySync(folder, target);

            if (watch)
            {
                fs.watch(folder, { recursive: true }, (_type, file) =>
                {
                    // adding check to see if file is null.
                    if (!file || file.indexOf('.DS_Store') !== -1) return;

                    if (id === -1)
                    // this happens a lot! lets throttle..
                    {
                        id = setTimeout(() =>
                        {
                            id = -1;
                            fs.copySync(folder, target);
                            console.log(`copied: ${folder}`);
                        }, 100);
                    }
                });
            }

            console.log(`copied: ${folder}`);

            resolve(true);
        }
        else
        {
            console.log('WARNING:'.red.bold + ` link path ${folder} not found`.red);
            resolve(false);
        }
    });
}

/**
 * Takes an array of folders to be linked and loops through each of them, applying the link.
 *
 * ```ts
 * const build = require('@goodboydigital/fido-build');
 *
 * const links = [
 *    { "location": "../shared/src", "target": "./node_modules/shared/src/" },
 *    { "location": "/Users/matgroves/work/projects/pixi/pixi.js/bundles/pixi.js/dist", "target": "./src/scripts/lib" },
 * ]
 *
 * build.utils.simpleLinks(links);
 * ```
 *
 * @param links - Array of objects that contain a location and target, used to link two folders together.
 * @param watch - true if you want to watch the links and copy the files on every change
 */
export async function simpleLinkAll(links: ILink[], watch = false): Promise<void>
{
    if (!links?.length) return;

    console.log('\n--- linking folders ---'.blue.bold);

    let allGood = true;

    for (let i = 0; i < links.length; i++)
    {
        const link = links[i];

        const success = await simpleLink(link.location, link.target, watch);

        if (!success)
        {
            allGood = false;
        }
    }

    if (!allGood)
    {
        console.log(
            `Linking failed for a few folders, this is mainly used by devs,
            ${'talk to Mat if you are unsure what this means'.red.bold}`,
        );
    }
    else
    {
        console.log('Linking successful!\n'.green.bold);
    }
}

//
async function run()
{
    const linksJson = fs.readJSONSync(`${root}/.links`);

    await simpleLinkAll(linksJson, true);

    // delete the file

    //fs.unlinkSync(`${root}/node_modules/.vite`);

    //.vite
}

run();