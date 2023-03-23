import fs from "fs/promises";
import path from "path";

interface PackageJson {
    name?: string;
    devDependencies?: Record<string, string>;
    dependencies?: Record<string, string>;
    scripts?: Record<string, string>;
    engines?: Record<string, string>;
}

const makePackageJson = async (mainPackagePath: string, packagePath: string) => {
    const fileContent = (await fs.readFile(mainPackagePath)).toString();
    const { name, dependencies, devDependencies, engines } = JSON.parse(fileContent) as PackageJson;

    await fs.writeFile(packagePath, JSON.stringify({
        name,
        dependencies,
        devDependencies,
        engines,
        "scripts": {
            "start": "node ./dist/index.js"
        }
    } as PackageJson));
};

const copyDist = async (distPath: string, packagedDistPath: string) => {
    await fs.cp(distPath, packagedDistPath, {
        recursive: true
    });
};

const run = async () => {
    const mainPackagePath = path.resolve(__dirname, "../package.json");
    const outputDestination = path.resolve(__dirname, "../built-package");
    const distPath = path.resolve(__dirname, "../dist");

    const packagePath = path.join(outputDestination, "/package.json");
    const packagedDistPath = path.join(outputDestination, "/dist");

    await fs.rm(outputDestination, {
        recursive: true,
        force: true
    });

    await Promise.all([
        makePackageJson(mainPackagePath, packagePath),
        copyDist(distPath, packagedDistPath)
    ]);
};

run().then(() => console.log("\"./built-package\" folder is ready"));
