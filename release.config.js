const preset = 'conventionalcommits';

/** @type {import('semantic-release').Options} */
export default {
  branches: ['main'],
  dryRun: false,
  plugins: [
    ['@semantic-release/commit-analyzer', { preset }],
    ['@semantic-release/release-notes-generator', { preset }],
    ['@semantic-release/changelog', { changelogTitle: '# Changelog' }],
    [
      '@semantic-release/npm',
      {
        npmPublish: false,
        tarballDir: 'dist'
      }
    ],
    // [
    //   '@semantic-release/github',
    //   {
    //     assets: 'dist/*.tgz'
    //   }
    // ],
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'CHANGELOG.md'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
      }
    ]
  ],
  tagFormat: 'v${version}'
};
