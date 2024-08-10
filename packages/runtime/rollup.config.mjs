import cleanup from 'rollup-plugin-cleanup'
import filesize from 'rollup-plugin-filesize'
import typescript from '@rollup/plugin-typescript';

export default {
    input: './src/index.ts',
    plugins: [typescript(), cleanup()],
    output: [
        {
            file: 'dist/astralyn.js',
            format: 'esm',
            plugins: [filesize()]
        }
    ]
}