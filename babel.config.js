module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['@babel/plugin-transform-optional-chaining'], // Adicione o plugin aqui
  };
};

