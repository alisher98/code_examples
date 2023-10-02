const libApi = require('libs/api');
const libMysql = require('libs/mysql');
const libValidator = require('libs/validator');
const crypt = require('./utils/EncryptDecrypt');

const i18n = require("libs/i18n");
const helper = require("libs/helper");
const deduplicator = require("libs/deduplicator");
const config = require("config");
const lodash = require("lodash");

var actionFunction = function (req, res, actionCallback) {
  let rules = [
    {
      name: "module",
      rule: "notEmptySetDefault",
      default: 'Account',
      message: "Module not be empty"
    },
    {
      name: "field_list",
      rule: "notEmptySetDefault",
      default: ['label'],
      message: "Fields not be empty"
    },
    {
      name: "whole_records",
      rule: "notEmptySetDefault",
      default: true
    },
    {
      name: "checker",
      rule: "notEmptySetDefault",
      default: 'simple'
    },
    {
      name: "checker",
      rule: "inValues",
      values: ['ML', 'simple', 'custom'],
      message: "Checker only in values: 'ML', 'simple', 'custom'"
    },
  ];

  i18n.setLocale(helper.getNotNull(req, "jwt.token.lang", config.get('i18n.defaultLanguage')));
  let validator = new libValidator(i18n);

  validator.addRules(req.query, rules);

  validator.validate(actionCallback, function () {

    req.responseAction = null;

    const options = {
      functions: [
        getModuleDate
      ],
      db: {
        type: libMysql.const.readType
      },
      callback: actionCallback,
      workflow: {
        filename: __filename
      }
    };

    var layout = require(req.app.locals.appPath + "/traits/layouts/dbOnlyLayout");
    layout(req, options);

    function getModuleDate(asyncObj, eachCallback) {
      (async() => {
        try {
          console.log('TEST_COMPANY_REQUEST IS ', req.jwt.token.cid);
          if (config.has('companies.' + req.jwt.token.cid + '.mysqlPoolCluster.master')) {
            const DB = config.get('companies.' + req.jwt.token.cid + '.mysqlPoolCluster.master') || {};
            const data = {
              params: {
                companyID: req.jwt.token.cid,
                module: req.query.module,
                fldsList: req.query.field_list,
                returnWholeRecords: req.query.whole_records,
                mode: 'frontend',
                checker: req.query.checker
              },
              config: deduplicator.deduplicator.createConfig(req.jwt.token.cid, DB),
            };

            console.log('TEST_SEND_DATA ', data);

            deduplicator.ws.call('listDuplicates', data).then(result => {
              console.log('TEST_LIST RESULT: ', JSON.parse(JSON.stringify(result)));
              req.responseAction = result.res;
              if (result.err === 1) {
                eachCallback(result.error, asyncObj);
                return;
              }
              eachCallback(null, asyncObj);
            }).catch(error=> {
              console.log(error);
              eachCallback(error, asyncObj);
            })
          } else {
            throw new Error('Not found DB connection for company ' + req.jwt.token.cid);
          }
        } catch (e) {
          eachCallback(libApi.convertErrorToObject(e), asyncObj);
        }
      })();
    }
  });


};

exports.action = actionFunction;

exports.get = function (req, res, next) {
  actionFunction(req, res, function (context, err, data) {
    libApi.restResponse(res, req, err, data);
  })
};
