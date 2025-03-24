import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import pkg from './package.json' with { type: 'json' };

const exports = Array.from(
    new Set(
        Object.values(pkg.exports)
            .map((e) => Object.values(e))
            .flat()
    )
);

const js = exports
    .filter((e) => !e.endsWith('.d.ts'))
    .map((e) => e.replace('./dist/', './src/').replace('.js', '.ts'));

const types = exports
    .filter((e) => e.endsWith('.d.ts'))
    .map((e) => e.replace('./dist/', 'src/').replace('.d.ts', '.ts'));

const dts_plugin = dts();

export default [
    {
        input: js,
        output: {
            dir: 'dist',
            format: 'es'
        },
        plugins: [typescript({
            declaration: false,
        })],
        external: [Object.keys(pkg.peerDependencies)]
    },
    {
        input: types,
        output: {
            dir: 'dist',
            format: 'es',
            entryFileNames: (info) => {
                return info.name.replace('src/', '') + '.d.ts';
            }
        },
        plugins: [
            {
                ...dts_plugin,
                outputOptions(...args) {
                    const opts = dts_plugin.outputOptions(...args);
                    opts.interop = 'esModule';
                    delete opts.namespaceToStringTag;
                    opts.generatedCode = { symbols: false, ...opts.generatedCode };
                    return opts;
                }
            }
        ],
        external: [Object.keys(pkg.peerDependencies)]
    }
];
