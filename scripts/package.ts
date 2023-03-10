import fs from "fs/promises";
import path from "path";
import { cwd } from "process";

interface PackageJson {
    name?: string;
    devDependencies?: Record<string, string>;
    dependencies?: Record<string, string>;
    scripts?: Record<string, string>;
    engines?: Record<string, string>;
}

const run = async () => {
    const mainPackagePath = path.resolve(__dirname, "../package.json");
    const distPackagePath = path.join(__dirname, "../dist/package.json");

    const fileContent = (await fs.readFile(mainPackagePath)).toString();
    const { name, dependencies, devDependencies, engines } = JSON.parse(fileContent) as PackageJson;

    await fs.writeFile(distPackagePath, JSON.stringify({
        name,
        dependencies,
        devDependencies,
        engines,
        "scripts": {
            "start": "node ./index.js"
        }
    } as PackageJson));

};

run().then(() => console.log("\"./dist\" folder is ready"));
