module.exports = {
    extends: 'erb',
    rules: {
        // A temporary hack related to IDE not resolving correct package.json
        'import/no-extraneous-dependencies': 'off',
        'import/no-unresolved': 'error',
        // import should always be in {} format
        'import/prefer-default-export': 'off',
        // Developers should have the right to disable @ts-ignore as long as
        // they know what they are doing
        '@typescript-eslint/ban-ts-comment': 'off',
    },
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        createDefaultProgram: true,
    },
    settings: {
        'import/resolver': {
            // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
            node: {},
            webpack: {
                config: require.resolve(
                    './.erb/configs/webpack.config.eslint.ts'
                ),
            },
            typescript: {},
        },
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
    },
};
