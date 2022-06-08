import Vue from 'vue';

Vue.filter('currencyUSD', (value) => `$${(value / 100).toFixed(2)}`);
