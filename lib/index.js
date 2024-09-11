import module from 'module';

const require = module.createRequire(import.meta.url);

/** @typedef {`${NodeJS.Platform}-${NodeJS.Architecture}`} TargetPlatform */

/** @type {Map<TargetPlatform, string>} */
const nativePackages = new Map([
  ['darwin-arm64', '@douglasneuroinformatics/libstats-aarch64-apple-darwin'],
  ['darwin-x64', '@douglasneuroinformatics/libstats-x86_64-apple-darwin'],
  ['linux-arm64', '@douglasneuroinformatics/libstats-aarch64-unknown-linux-musl'],
  ['linux-x64', '@douglasneuroinformatics/libstats-x86_64-unknown-linux-musl'],
  ['win32-arm64', '@douglasneuroinformatics/libstats-aarch64-pc-windows-msvc'],
  ['win32-x64', '@douglasneuroinformatics/libstats-x86_64-pc-windows-msvc']
]);

export function __getNativePackageName() {
  /** @type {TargetPlatform} */
  const targetPlatform = `${process.platform}-${process.arch}`;
  const nativePackageName = nativePackages.get(targetPlatform);
  if (!nativePackageName) {
    // prettier-ignore
    throw new Error(`Current platform '${targetPlatform}' not in supported targets: ${Array.from(nativePackages.keys()).map((platform) => `'${platform}'`).join(', ')}`);
  }
  return nativePackageName;
}

export const { linearRegression, mean, std, sum } = require(__getNativePackageName());
