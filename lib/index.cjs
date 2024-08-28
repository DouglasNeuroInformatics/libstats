function getBinary() {
  /** @type {`${NodeJS.Platform}-${NodeJS.Architecture}`} */
  const target = `${process.platform}-${process.arch}`;
  switch (target) {
    case 'darwin-arm64':
      return require('@douglasneuroinformatics/libstats-darwin-arm64');
    case 'darwin-x64':
      return require('@douglasneuroinformatics/libstats-darwin-x64');
    case 'linux-arm64':
      return require('@douglasneuroinformatics/libstats-darwin-arm64');
    case 'linux-x64':
      return require('@douglasneuroinformatics/libstats-darwin-x64');
    default:
      throw new Error(`Unsupported target: ${target}`);
  }
}

module.exports = getBinary();
