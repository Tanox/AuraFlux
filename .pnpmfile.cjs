module.exports = {
  hooks: {
    readPackage(pkg) {
      // 配置 pnpm 使用全局包
      return pkg;
    }
  }
};
