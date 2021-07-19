/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const path = require('path');
const cracoPlugin = require('@cypress/react/plugins/craco');
const cracoConf = require(path.join(__dirname, '../../craco.config.js'));

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
export default (on: any, config: any) => {
  cracoPlugin(on, config, cracoConf);

  return config;
};
