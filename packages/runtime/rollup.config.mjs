import cleanup from 'rollup-plugin-cleanup'
import filesize from 'rollup-plugin-filesize'
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
    input: './src/index.ts',
    plugins: [commonjs(), nodeResolve(), typescript(), cleanup()],
    output: [
        {
            file: 'dist/astralyn.js',
            format: 'esm',
            plugins: [filesize()]
        }
    ]
}