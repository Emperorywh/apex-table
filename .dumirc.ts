import { defineConfig } from 'dumi';

export default defineConfig({
    outputPath: 'docs-dist',
    themeConfig: {
        name: 'apex-table',
    },
    proxy: {
        '/apis': {
            'target': 'http://192.168.4.201',
            'changeOrigin': true,
            'pathRewrite': { '^/apis': '' },
        }
    }
});
